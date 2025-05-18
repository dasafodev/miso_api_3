import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateLibraryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsDateString()
    openingTime: string;

    @IsNotEmpty()
    @IsDateString()
    closingTime: string;
}
