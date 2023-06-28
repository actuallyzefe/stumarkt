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

  async uploadFile(
    file: Express.Multer.File,
    key: string,
    parent_folder: string,
    account_number: string,
  ) {
    const bucket = this.configService.get<string>('S3_BUCKET');
    const folder = `${parent_folder}/${account_number}`;
    const newKey = `${folder}/${key}`;

    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: bucket,
      Key: newKey,
      ContentType: file.mimetype,
    };
    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        const message = `image uploaded to s3 ${parent_folder} folder`;
        return { message };
      }
      throw new Error('Image upload failed');
    } catch (e) {
      const msg = e.message;
      console.log(e);
      return { msg };
    }
  }
}
