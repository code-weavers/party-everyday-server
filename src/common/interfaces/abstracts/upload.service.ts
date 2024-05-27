import { CreateFileDTO } from '@modules/file/presenters/file.dto';

export interface IUploadService {
   uploadFile?(file: CreateFileDTO): Promise<CreateFileDTO>;
   deleteFile?(keys: string[]): Promise<void>;
}
