import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { IJwtService } from '../../../../src/common/interfaces/abstracts/jwt.service';
import { JwtTokenService } from '../../../../src/services/jwt/jwt.service';

describe('JwtTokenService', () => {
   let service: IJwtService;
   let jwtService: JwtService;

   beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
         providers: [
            JwtTokenService,
            { provide: JwtService, useValue: createMock() },
         ],
      })
         .useMocker(() => createMock())
         .compile();

      service = moduleRef.get<IJwtService>(JwtTokenService);
      jwtService = moduleRef.get<JwtService>(JwtService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
      expect(jwtService).toBeDefined();
   });

   describe('checkToken', () => {
      it('should return the result of jwtService.verifyAsync', async () => {
         const token = 'test-token';
         const verifyResult = { userId: '1' };

         jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(verifyResult);

         expect(await service.checkToken(token)).toBe(verifyResult);
         expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
      });
   });

   describe('createToken', () => {
      it('should return the result of jwtService.sign', () => {
         const payload = { id: '1', userId: '1', username: 'test' };
         const signResult = 'test-token';

         jest.spyOn(jwtService, 'sign').mockReturnValue(signResult);

         expect(service.createToken(payload)).toBe(signResult);
         expect(jwtService.sign).toHaveBeenCalledWith(payload);
      });
   });
});
