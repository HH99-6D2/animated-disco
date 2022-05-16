import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '../utils/auth.guard';
import { GetUser } from '../utils/decorator/get-user.decorator';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
          cb(null, `${Date.now().toString()}_${file.originalname}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFiles() files: Express.Multer.File, @GetUser()) {
    return this.imagesService.uploadImage(files);
  }
}
