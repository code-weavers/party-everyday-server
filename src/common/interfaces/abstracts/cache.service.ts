export interface ICacheManager {
   getCachedObject<T>(key: string): Promise<T>;
   setObjectInCache(key: string, value: any): Promise<any>;
}
