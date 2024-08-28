import { Checkout } from "@/entities/checkout.entity";

export interface ICheckoutRepository {
   findAll(partyId: string): Promise<Checkout[]>;
   findById(id: string): Promise<Checkout>;
   create(partyId: string, checkout: Checkout): Promise<Checkout>;
   delete(id: string): Promise<Checkout>;
}