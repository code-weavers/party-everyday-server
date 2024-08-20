import { IsOptionalStringColumn } from '@/common/decorators/columns/isOptionalStringColumn.decorator';
import { IsRequiredNumberColumn } from '@/common/decorators/columns/isRequiredNumberColumn.decorator';
import { IsRequiredStringColumn } from '@/common/decorators/columns/isRequiredStringColumn.decorator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @IsOptionalStringColumn()
   public name?: string;

   @IsRequiredStringColumn()
   public zipCode: string;

   @IsRequiredStringColumn()
   public state: string;

   @IsRequiredStringColumn()
   public city: string;

   @IsOptionalStringColumn()
   public neighborhood: string;

   @IsRequiredStringColumn()
   public street: string;

   @IsOptionalStringColumn()
   public complement?: string;

   @IsRequiredNumberColumn()
   public number: number;

   @IsRequiredStringColumn()
   public lat: string;

   @IsRequiredStringColumn()
   public lng: string;
}
