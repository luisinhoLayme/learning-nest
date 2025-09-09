import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto, user: User) {

    try {
      const { images = [], ...productDetails } = createProductDto

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user
      })

      await this.productRepository.save(product)

      return { ...product, images }
      // return product
    } catch (err) {
      this.handleDbExceptions(err)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    return products.map(product => ({
      ...product,
      images: product.images?.map(img => img.url)
    }))
  }

  async findOne(term: string) {
    let product: Product[]

    if (isUUID(term)) {
      // product = await this.productRepository.findOneBy({ id: term })
      product = await this.productRepository.find({ where: { id: term } })
    } else {
      //WARN: Busqueda exacta
      // product = await queryBuilder.where(`UPPER(title) =:title or slug =:slug`, {
      //   title: term.toUpperCase(),
      //   slug: term.toLowerCase()
      // }).getOne()

      // PERF: Busqueda por parciales
      const queryBuilder = this.productRepository.createQueryBuilder('prod')
      product = await queryBuilder.where(`UPPER(title) like :title or slug like :slug`, {
        title: `%${term.toUpperCase()}%`,
        slug: `%${term.toLowerCase()}%`
      }).leftJoinAndSelect('prod.images', 'prodImages').getMany()
    }

    if ( !product.length)
      throw new NotFoundException(`Product with "${ term }" not found`)

    return product.map(prod => ({ ...prod, images: prod.images?.map(img => img.url) }))
  }

  // intermediario
  async findOnePlain( term: string ) {
    const products = await this.findOne(term)
    console.log(typeof products)
    // return {
    //   ...rest,
    //   images: images.map((image) => image.url)
    // }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...toUpdate } = updateProductDto

    // busca y lo prepara
    const product = await this.productRepository.preload({ id, ...toUpdate })

    if (!product) throw new NotFoundException(`Product with id: ${ id } not found.`)

    // create query runner
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()


    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })

        product.images = images.map(img => this.productImageRepository.create({ url: img }))
      }

      product.user = user
      await queryRunner.manager.save(product)
      // await this.productRepository.save(product);

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return (await this.findOne(id)).at(0)
    } catch (err) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleDbExceptions(err)
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.delete({ id }) // or use remove()
    // console.log(product)
    if ( product.affected == 0 )
      throw new BadRequestException(`Product with id "${ id }" not found`)

    return { msg: 'Delete product successfully.' }
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check ser logs')
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')

    try {
      return await query
        .delete()
        .where({})
        .execute()
    } catch (err) {
      this.handleDbExceptions(err)
    }
  }
}
