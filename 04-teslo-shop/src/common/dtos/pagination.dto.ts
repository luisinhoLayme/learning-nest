import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @ApiProperty({
    default: 10,
    description: 'How many rows do you need'
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number) //enableImplicitConversions: true
  limit?: number

  @ApiProperty({
    default: 0,
    description: 'How many rows do you want to skip'
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number) //enableImplicitConversions: true
  offset?: number
}
