import { Checkout } from "@/entities/checkout.entity";

export const checkoutMock: Checkout = {
   id: '1',
   partyId: '1',
   name: 'teste',
   value: 1,
   createdAt: new Date(),
   updatedAt: new Date(),
}

export const checkoutsMock: Checkout[] = [
   {
      id: '1',
      partyId: '1',
      name: 'teste',
      value: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
   }
]