import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class ImagesService {
  async uploadImage(files) {
    return files;
  }
}
