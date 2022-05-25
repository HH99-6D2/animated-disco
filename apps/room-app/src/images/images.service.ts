import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  async uploadImage(files) {
    return { imageUrl: files[0].location };
  }
}
