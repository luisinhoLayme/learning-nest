import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import bcrypt from "bcryptjs";
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './intefaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password: pass, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(pass, 10)
      })
      await this.userRepository.save(user)

      const {password, ...newUser} = user

      return {
        ...newUser,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (err) {
      this.handleDBErrors( err )
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email:true, password: true, id: true }
    })

    if (!user)
      throw new UnauthorizedException('Credentials are not valid.')

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid.')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async checkAuthStatus(user: User) {

    return {
      ...user,
      newToken: this.getJwtToken({ id: user.id })
    }
  }

  private getJwtToken( payload: JwtPayload ) {
    //
    const token = this.jwtService.sign(payload)
    return token
  }


  private handleDBErrors(err: any): never {
    if ( err.code === '23505' )
      throw new BadRequestException( err.detail )

    console.log(err)
    throw new InternalServerErrorException('Please check server logs')
  }



  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
