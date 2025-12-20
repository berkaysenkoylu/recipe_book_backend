import { IsOptional, IsString } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  ingredient?: string;
}
