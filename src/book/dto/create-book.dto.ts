import { IsDate, IsISBN, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsDate()
    publishedDate: Date;

    @IsNotEmpty()
    @IsISBN()
    isbn: string;
}
