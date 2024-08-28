import { GatewayService } from '@/services/gateway/gateway.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';

describe('GatewayService', () => {
   let gatewayService: GatewayService;
   let server: Server;
   let client: Socket;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [GatewayService],
      }).compile();

      server = createMock<Server>();
      client = createMock<Socket>();
      gatewayService = module.get<GatewayService>(GatewayService);

      gatewayService['server'] = server;
   });

   it('should be defined', () => {
      expect(gatewayService).toBeDefined();
   });

   it('should initialize WebSocket Gateway', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      gatewayService.afterInit(server);
      expect(consoleSpy).toHaveBeenCalledWith('WebSocket Gateway initialized');
   });

   it('should handle client connection', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      gatewayService.handleConnection(client);
      expect(consoleSpy).toHaveBeenCalledWith(`Client connected: ${client.id}`);
      expect(gatewayService['clients'].has(client)).toBe(true);
   });

   it('should handle client disconnection', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      gatewayService.handleConnection(client); // Add client first
      gatewayService.handleDisconnect(client);
      expect(consoleSpy).toHaveBeenCalledWith(`Client disconnected: ${client.id}`);
      expect(gatewayService['clients'].has(client)).toBe(false);
   });

   it('should send notification', () => {
      const emitSpy = jest.spyOn(server, 'emit');
      const data = { message: 'test' };
      gatewayService.sendNotification(data);
      expect(emitSpy).toHaveBeenCalledWith('notification', data);
   });
});