import { IsRequiredStringColumn } from '@/common/decorators/columns/isRequiredStringColumn.decorator';
import { GuestStatus } from '@/common/enums/guest.enum';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Party } from './party.entity';
import { User } from './user.entity';

@Entity()
export class Guest {
   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @IsRequiredStringColumn()
   public userId: string;

   @IsRequiredStringColumn()
   public partyId: string;

   @IsRequiredStringColumn({
      enum: GuestStatus,
      default: GuestStatus.PENDING,
   })
   public status: GuestStatus;

   @ManyToOne(() => Party, (party) => party.guests, {
      onDelete: 'CASCADE',
   })
   @JoinColumn({ name: 'partyId' })
   public party?: Party;

   @ManyToOne(() => User)
   public user: User;
}
