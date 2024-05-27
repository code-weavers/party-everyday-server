interface IS3Credentials {
   accessKeyId: string;
   secretAccessKey: string;
}

export interface IS3ClientUploadConfig {
   credentials: IS3Credentials;
   bucketName: string;
   ACL:
      | 'private'
      | 'public-read'
      | 'public-read-write'
      | 'authenticated-read'
      | 'aws-exec-read'
      | 'bucket-owner-read'
      | 'bucket-owner-full-control';
   region?: string;
}
