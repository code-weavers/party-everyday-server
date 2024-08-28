import { IsOptionalNumberColumn } from '@/common/decorators/columns/isOptionalnumberColumn.decorator';
import { IsOptionalStringColumn } from '@/common/decorators/columns/isOptionalStringColumn.decorator';
import { IsRequiredStringColumn } from '@/common/decorators/columns/isRequiredStringColumn.decorator';
import {
   CreateDateColumn,
   Entity,
   JoinColumn,
   ManyToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn
} from 'typeorm';
import { Party } from './party.entity';

@Entity()
export class Checkout {
   @PrimaryGeneratedColumn('uuid')
   public id?: string;

   @IsOptionalStringColumn({ select: false })
   public partyId?: string;

   @IsRequiredStringColumn()
   public name: string;

   @IsOptionalNumberColumn()
   public value: number;

   @CreateDateColumn()
   public createdAt?: Date;

   @UpdateDateColumn()
   public updatedAt?: Date;

   @ManyToOne(() => Party, {
      cascade: true,
      onDelete: 'CASCADE',
      nullable: true,
   })
   @JoinColumn({ name: 'partyId' })
   public party?: Party;
}
