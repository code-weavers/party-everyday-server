import { IsRequiredStringColumn } from '@/common/decorators/columns/isRequiredStringColumn.decorator';
import { UserStatusParty } from '@/common/enums/userStatusParty.enum';
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
      enum: UserStatusParty,
      default: UserStatusParty.PENDING,
   })
   public status: UserStatusParty;

   @ManyToOne(() => Party, (party) => party.guests, {
      onDelete: 'CASCADE',
   })
   @JoinColumn({ name: 'partyId' })
   public party: Party;

   @ManyToOne(() => User)
   public user: User;
}
