export interface IJwtAuthPayload {
   id: string;
}

export interface IJwtService {
   checkToken?<T>(token: string): Promise<T>;
   createToken?(payload: IJwtAuthPayload): string;
}
