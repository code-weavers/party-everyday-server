import { OwnerType } from '@/common/enums/ownerType.enum';
import { IsOptionalStringColumn } from '@decorators/columns/isOptionalStringColumn.decorator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @IsOptionalStringColumn()
   public originalname?: string;

   @IsOptionalStringColumn()
   public ownerId: string;

   @IsOptionalStringColumn()
   public ownerType: OwnerType;

   @IsOptionalStringColumn()
   public key: string;

   @IsOptionalStringColumn()
   public url: string;

   @Column({ type: 'bytea', nullable: true })
   public buffer?: Buffer;
}
