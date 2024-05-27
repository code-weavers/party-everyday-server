import { CreateFileDTO } from '@modules/file/presenters/file.dto';

export class FileUtils {
   static async createFile(file: Express.Multer.File): Promise<CreateFileDTO> {
      if (file) {
         const { originalname, mimetype, encoding, buffer } = await file;

         const key = `${Date.now()}-${originalname}`;

         const newFile: CreateFileDTO = new CreateFileDTO({
            originalname,
            fieldname: 'file',
            mimetype,
            encoding,
            buffer,
            key,
         });

         return newFile;
      }
   }

   static async createManyFiles(
      files: Express.Multer.File[],
   ): Promise<CreateFileDTO[]> {
      const newFiles: CreateFileDTO[] = [];

      if (files) {
         for (const file of files) {
            const { originalname, mimetype, encoding, buffer } = await file;

            const key = `${Date.now()}-${originalname}`;

            newFiles.push(
               new CreateFileDTO({
                  originalname,
                  fieldname: 'file',
                  mimetype,
                  encoding,
                  buffer,
                  key,
               }),
            );
         }

         return newFiles;
      }
   }

   static async createBufferFromReadStreamFile(
      file: Express.Multer.File,
   ): Promise<Buffer> {
      const { stream } = file;

      const chunks = [];

      return await new Promise<Buffer>((resolve, reject) => {
         let buffer: Buffer;

         stream.on('data', function (chunk) {
            chunks.push(chunk);
         });

         stream.on('end', function () {
            buffer = Buffer.concat(chunks);
            resolve(buffer);
         });

         stream.on('error', reject);
      });
   }

   static async createBase64FromBuffer(
      file: Express.Multer.File,
   ): Promise<string> {
      const buffer = await this.createBufferFromReadStreamFile(file);

      return buffer.toString('base64');
   }
}
