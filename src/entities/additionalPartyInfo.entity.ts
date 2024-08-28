import { IsOptionalNumberColumn } from '@/common/decorators/columns/isOptionalnumberColumn.decorator';
import { IsOptionalStringColumn } from '@/common/decorators/columns/isOptionalStringColumn.decorator';
import { IsRequiredStringColumn } from '@/common/decorators/columns/isRequiredStringColumn.decorator';
import { AdditionalInfoType } from '@/common/enums/additionalInfoType.enum';
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
export class AdditionalPartyInfo {
   @PrimaryGeneratedColumn('uuid')
   public id?: string;

   @IsOptionalStringColumn({ select: false })
   public partyId?: string;

   @IsRequiredStringColumn()
   public userId?: string;

   @IsRequiredStringColumn()
   public name: string;

   @IsOptionalNumberColumn()
   public value: number;

   @IsRequiredStringColumn({ enum: AdditionalInfoType })
   public type?: AdditionalInfoType;

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
