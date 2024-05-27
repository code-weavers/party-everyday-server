import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export const IsRequiredString = () => {
   return applyDecorators(
      IsString(),
      IsNotEmpty(),
      ApiProperty({
         required: true,
      }),
   );
};
