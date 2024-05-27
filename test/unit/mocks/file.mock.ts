import { OwnerType } from '@/common/enums/ownerType.enum';
import { File } from '@/entities/file.entity';
import { CreateFileDTO } from '@/modules/file/presenters/file.dto';

export const file: File = {
   id: '1',
   ownerId: '1',
   ownerType: OwnerType.USER,
   originalname: 'test.jpg',
   key: 'testKey',
   url: 'http://test.com/test.jpg',
};

export const uploadedFile: CreateFileDTO = {
   ownerId: '1',
   ownerType: OwnerType.USER,
   originalname: 'test.jpg',
   key: 'testKey',
   url: 'http://test.com/test.jpg',
};

export const createdLocalFile: CreateFileDTO = {
   ownerId: '1',
   ownerType: OwnerType.USER,
   fieldname: 'file',
   originalname: 'test.jpg',
   encoding: '7bit',
   mimetype: 'image/jpeg',
   buffer: Buffer.from('testBuffer'),
   key: 'testKey',
   url: 'http://test.com/test.jpg',
};

export const createdUploadFile: CreateFileDTO = {
   ownerId: '1',
   ownerType: OwnerType.USER,
   originalname: 'test.jpg',
   key: 'testKey',
   url: 'http://test.com/test.jpg',
};

export const multerFile: Express.Multer.File = {
   fieldname: 'file',
   originalname: 'test.jpg',
   encoding: '7bit',
   mimetype: 'image/jpeg',
   buffer: Buffer.from('testBuffer'),
   size: 100,
   destination: '',
   filename: '',
   path: '',
   stream: null,
};
