import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new S3(
    {
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      },
      region: 'ap-northeast-2',
    } ||
      new S3Client({
        credentials: {
          accessKeyId: process.env.AWS_S3_ACCESS_KEY,
          secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        },
        region: 'ap-northeast-2',
      }),
  );

  async uploadFile(file, id) {
    const { originalname } = file;
    return this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      `${id}/${originalname}`,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-northeast-2',
      },
    };
    const parallelUpload3 = new Upload({
      client: this.s3,
      params,
    });
    try {
      await parallelUpload3.done();
      return `https://animateduser.s3.ap-northeast-2.amazone.com/${name}`;
    } catch (e) {
      throw new InternalServerErrorException('Image Upload Failed');
    }
  }
}
