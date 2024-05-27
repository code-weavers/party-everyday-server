export interface S3Config {
   getBucketName(): string;
   getBucketRegion(): string;
   getBucketDefaultACL(): string;
   getBucketAccessKeyId(): string;
   getBucketSecretAccessKey(): string;
}
