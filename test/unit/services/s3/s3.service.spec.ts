import { IUploadService } from '@/common/interfaces/abstracts/upload.service';
import { S3Service } from '@/services/s3/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { createMock } from '@golevelup/ts-jest';
import { CreateFileDTO } from '@modules/file/presenters/file.dto';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@aws-sdk/client-s3');

describe('S3Service', () => {
   let service: IUploadService;
   let mockS3Client: S3Client;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [S3Service],
      })
         .useMocker(() => createMock())
         .compile();

      service = module.get<IUploadService>(S3Service);
      mockS3Client = createMock<S3Client>();
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should upload a file', async () => {
      const file: CreateFileDTO = {
         key: 'testKey',
         buffer: Buffer.from('testBuffer'),
         mimetype: 'testMimetype',
      };

      jest
         .spyOn(mockS3Client, 'send')
         .mockImplementation(() => Promise.resolve({}));

      const result = await service.uploadFile(file);

      expect(result.url).toBeDefined();
   });

   it('should delete files', async () => {
      const keys = ['key1', 'key2'];

      jest
         .spyOn(mockS3Client, 'send')
         .mockImplementation(() => Promise.resolve({}));

      await service.deleteFile(keys);
   });
});
