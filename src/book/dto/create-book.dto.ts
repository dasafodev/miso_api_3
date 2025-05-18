import { IsISBN, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    publishedDate: string;

    @IsNotEmpty()
    @IsISBN()
    isbn: string;
}
