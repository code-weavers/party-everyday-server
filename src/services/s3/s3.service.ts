import { IS3ClientUploadConfig } from '@/common/interfaces/s3.interface';
import {
   DeleteObjectsCommand,
   PutObjectCommand,
   S3Client,
} from '@aws-sdk/client-s3';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { CreateFileDTO } from '@modules/file/presenters/file.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service implements IUploadService {
   private readonly service: S3Client;
   private readonly config: IS3ClientUploadConfig = {
      credentials: {
         accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
         secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
      },
      bucketName: String(process.env.AWS_S3_BUCKET),
      ACL: 'public-read',
      region: String(process.env.DEFAULT_REGION),
   };

   constructor() {
      this.service = new S3Client({
         credentials: {
            accessKeyId: this.config.credentials.accessKeyId,
            secretAccessKey: this.config.credentials.secretAccessKey,
         },
         region: this.config.region,
         forcePathStyle: true,
      });
   }

   public async uploadFile(file: CreateFileDTO): Promise<CreateFileDTO> {
      const putObjectCommand = new PutObjectCommand({
         ACL: this.config.ACL,
         Bucket: this.config.bucketName,
         Key: file.key,
         Body: file.buffer,
         ContentType: file.mimetype,
         ServerSideEncryption: 'AES256',
      });

      await this.service.send(putObjectCommand);

      file.url = `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${file.key}`;

      delete file.buffer;

      return file;
   }

   public async deleteFile(keys: string[]): Promise<void> {
      const deleteObjectsCommand = new DeleteObjectsCommand({
         Bucket: this.config.bucketName,
         Delete: {
            Objects: keys.map((key) => ({ Key: key })),
         },
      });

      await this.service.send(deleteObjectsCommand);
   }
}
