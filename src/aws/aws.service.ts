import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private region: string;
  private s3: S3Client;
  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('S3_REGION');
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY,
      },
    });
  }

  async uploadFiles(
    files: Express.Multer.File[],
    parent_folder: string,
    product_number: string,
  ) {
    const bucket = this.configService.get<string>('S3_BUCKET');
    const folder = `${parent_folder}/${product_number}`;

    const uploadPromises = files.map((file) => {
      const key = `${folder}/${file.fieldname}${Date.now()}`;

      const input: PutObjectCommandInput = {
        Body: file.stream,
        Bucket: bucket,
        Key: key,
        ContentType: file.mimetype,
      };

      return this.s3.send(new PutObjectCommand(input));
    });

    try {
      const responses: PutObjectCommandOutput[] = await Promise.all(
        uploadPromises,
      );

      const successfulUploads = responses.filter(
        (response) => response.$metadata.httpStatusCode === 200,
      );

      if (successfulUploads.length === files.length) {
        const message = `All files uploaded to S3 ${parent_folder} folder`;
        return { message };
      } else {
        throw new Error('Some files failed to upload');
      }
    } catch (e) {
      const msg = e.message;
      console.log(e);
      return { msg };
    }
  }
}
