export interface IEnvironmentConfigService {
   getRedisHost?(): string;
   getRedisPort?(): number;
   getEnvironment?(): string;
   getCloudUpload?(): boolean;
   getBucketName?(): string;
   getBucketRegion?(): string;
   getBucketDefaultACL?(): string;
   getBucketAccessKeyId?(): string;
   getBucketSecretAccessKey?(): string;
   getJwtSecret?(): string;
   getJwtExpirationTime?(): string;
   getDatabaseHost?(): string;
   getDatabasePort?(): number;
   getDatabaseUser?(): string;
   getDatabasePassword?(): string;
   getDatabaseName?(): string;
   getDatabaseSchema?(): string;
   getDatabaseSync?(): boolean;
   getDatabaseType?(): string;
}
