import { ICheckoutRepository } from '@/common/interfaces/repositories/checkout.repository';
import { Checkout } from '@entities/checkout.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CheckoutRepository implements ICheckoutRepository {
   constructor(
      @InjectRepository(Checkout)
      private repository: Repository<Checkout>,
   ) { }

   public async findAll(partyId: string): Promise<Checkout[]> {
      return await this.repository.find({ where: { partyId } });
   }

   public async findById(id: string): Promise<Checkout> {
      return await this.repository.findOne({ where: { id } });
   }

   public async create(partyId: string, checkout: Checkout): Promise<Checkout> {
      const newCheckout = this.repository.create(checkout);
      return await this.repository.save({ ...newCheckout, partyId });
   }

   public async delete(id: string): Promise<Checkout> {
      const checkout = await this.findById(id);

      this.repository.delete({ id });

      return checkout;
   }
}
