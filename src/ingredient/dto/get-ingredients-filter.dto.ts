import { IsOptional, IsString } from 'class-validator';

export class GetIngredientsFilterDto {
  @IsOptional()
  @IsString()
  name?: string;
}
