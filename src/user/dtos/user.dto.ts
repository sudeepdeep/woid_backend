import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  profileUrl: string;

  @IsOptional()
  @IsString()
  coverUrl: string;

  @IsOptional()
  @IsArray()
  followers: string[];

  @IsOptional()
  @IsArray()
  following: string[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
