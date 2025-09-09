import { BadRequestException, Injectable } from '@nestjs/common';
import { exists, existsSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class FilesService {
  async upload(){}
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products/', imageName)

    if (!existsSync(path)) {
      throw new BadRequestException(`No product found with image ${ imageName }`)
    }

    return path
  }
}
