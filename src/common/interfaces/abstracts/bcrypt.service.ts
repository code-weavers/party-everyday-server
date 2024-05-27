export interface IBcryptService {
   createHash?(string: string): Promise<string>;
   checkHash?(string: string, hash: string): Promise<boolean>;
}
