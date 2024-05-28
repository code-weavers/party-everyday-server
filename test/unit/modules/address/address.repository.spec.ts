import { Address } from '@/entities/address.entity';
import { AddressRepository } from '@/modules/address/address.repository';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import {
   address,
   addressList,
   createAddressDTO,
   updateAddressDTO,
} from '../../mocks/address.mock';

describe('AddressRepository', () => {
   let addressRepository: AddressRepository;
   let repository: Repository<Address>;

   beforeEach(() => {
      repository = createMock<Repository<Address>>({
         find: jest.fn(),
         findOne: jest.fn(),
         save: jest.fn(),
         delete: jest.fn(),
      });

      addressRepository = new AddressRepository(repository);
   });

   it('should find all addresses', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(addressList);

      const result = await addressRepository.findAll();

      expect(result).toEqual(addressList);

      expect(repository.find).toHaveBeenCalled();
   });

   it('should find address by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(address);

      const result = await addressRepository.findById('1');

      expect(result).toEqual(address);

      expect(repository.findOne).toHaveBeenCalledWith({
         where: { id: '1' },
      });
   });

   it('should create an address', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(address);

      const result = await addressRepository.create(createAddressDTO);

      expect(result).toEqual(address);

      expect(repository.save).toHaveBeenCalledWith(createAddressDTO);
   });

   it('should update an address', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(address);

      const result = await addressRepository.update('1', updateAddressDTO);

      expect(result).toEqual(address);

      expect(repository.save).toHaveBeenCalledWith({
         id: '1',
         ...updateAddressDTO,
      });
   });

   it('should delete an address', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(address);
      jest.spyOn(repository, 'delete').mockResolvedValue({
         affected: 1,
         raw: address,
      });

      const result = await addressRepository.delete('1');

      expect(result).toEqual(address);

      expect(repository.findOne).toHaveBeenCalledWith({
         where: { id: '1' },
      });

      expect(repository.delete).toHaveBeenCalledWith('1');
   });
});
