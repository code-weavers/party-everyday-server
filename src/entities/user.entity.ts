import { IsOptionalStringColumn } from '@/common/decorators/columns/isOptionalStringColumn.decorator';
import { IsRequiredStringColumn } from '@/common/decorators/columns/isRequiredStringColumn.decorator';
import {
   CreateDateColumn,
   Entity,
   JoinColumn,
   OneToMany,
   OneToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import { File } from './file.entity';
import { Guest } from './guest.entity';

@Entity()
export class User {
   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @IsRequiredStringColumn()
   public username: string;

   @IsOptionalStringColumn()
   public email: string;

   @IsRequiredStringColumn({ nullable: true })
   public telephoneNumber: string;

   @IsRequiredStringColumn()
   public password?: string;

   @IsOptionalStringColumn()
   public pushNotificationToken?: string;

   @IsOptionalStringColumn()
   public billingAccountKey: string;

   @CreateDateColumn()
   public createdAt: Date;

   @UpdateDateColumn()
   public updatedAt: Date;

   @OneToOne(() => File, (file) => file.ownerId, {
      cascade: true,
      onDelete: 'CASCADE',
      nullable: true,
   })
   @JoinColumn()
   public file?: File;

   @OneToMany(() => Guest, (guest) => guest.user)
   public guest?: Guest[];
}
