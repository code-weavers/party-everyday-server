import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export const IsOptionalDate = () => {
   return applyDecorators(
      IsDate(),
      IsOptional(),
      ApiProperty({
         required: false,
      }),
   );
};
