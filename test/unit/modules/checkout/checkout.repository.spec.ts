import { CheckoutRepository } from '@/modules/checkout/checkout.repository';
import { Checkout } from '@entities/checkout.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { checkoutMock, checkoutsMock } from '../../mocks/checkout.mock';

describe('CheckoutRepository', () => {
   let repository: CheckoutRepository;
   let mockRepository: Repository<Checkout>;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            CheckoutRepository,
            {
               provide: getRepositoryToken(Checkout),
               useClass: Repository,
            },
         ],
      }).compile();

      repository = module.get<CheckoutRepository>(CheckoutRepository);
      mockRepository = module.get<Repository<Checkout>>(getRepositoryToken(Checkout));
   });

   it('should find all checkouts by partyId', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValue(checkoutsMock);

      const result = await repository.findAll('party123');
      expect(result).toEqual(checkoutsMock);
      expect(mockRepository.find).toHaveBeenCalledWith({ where: { partyId: 'party123' } });
   });

   it('should find a checkout by id', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(checkoutMock);

      const result = await repository.findById('checkout123');
      expect(result).toEqual(checkoutMock);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'checkout123' } });
   });

   it('should create a new checkout', async () => {
      const partyId = '1';
      const checkout = { id: 'checkout123', name: 'test', value: 1, partyId };

      jest.spyOn(mockRepository, 'create').mockReturnValue(checkoutMock);
      jest.spyOn(mockRepository, 'save').mockResolvedValue(checkoutMock);

      const result = await repository.create(partyId, checkout as Checkout);
      expect(result).toEqual(checkoutMock);
      expect(mockRepository.create).toHaveBeenCalledWith(checkout);
      expect(mockRepository.save).toHaveBeenCalledWith(checkoutMock);
   });

   it('should delete a checkout by id', async () => {
      const id = '1';

      jest.spyOn(repository, 'findById').mockResolvedValue(checkoutMock);
      jest.spyOn(mockRepository, 'delete').mockResolvedValue(undefined);

      const result = await repository.delete(id);
      expect(result).toEqual(checkoutMock);
      expect(repository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.delete).toHaveBeenCalledWith({ id });
   });
});