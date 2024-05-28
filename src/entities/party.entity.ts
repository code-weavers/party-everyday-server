import { IsOptionalStringColumn } from '@/common/decorators/columns/isOptionalStringColumn.decorator';
import { IsRequiredDateColumn } from '@/common/decorators/columns/isRequiredDateColumn.decorator';
import { IsRequiredStringColumn } from '@/common/decorators/columns/isRequiredStringColumn.decorator';
import { StatusParty } from '@/common/enums/statusParty.enum';
import {
   Entity,
   JoinColumn,
   ManyToOne,
   OneToMany,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { File } from './file.entity';
import { Guest } from './guest.entity';

@Entity()
export class Party {
   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @IsRequiredStringColumn()
   public ownerId: string;

   @IsRequiredStringColumn()
   public name: string;

   @IsOptionalStringColumn()
   public description?: string;

   @IsRequiredDateColumn()
   public date: Date;

   @IsRequiredStringColumn({ enum: StatusParty, default: StatusParty.ACTIVE })
   public status: StatusParty;

   @ManyToOne(() => Address, {
      cascade: true,
      onDelete: 'CASCADE',
      nullable: true,
   })
   @JoinColumn({ name: 'addressId' })
   public address: Address;

   @IsOptionalStringColumn({ select: false })
   public addressId: string;

   @OneToMany(() => File, (file) => file.party, {
      cascade: true,
      onDelete: 'CASCADE',
      nullable: true,
   })
   public files?: File[];

   @OneToMany(() => Guest, (guest) => guest.party)
   public guests: Guest[];
}
