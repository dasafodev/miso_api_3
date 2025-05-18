import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../book/entities/book.entity';
import { Library } from '../library/entities/library.entity';
import { LibraryBookController } from './library-book.controller';
import { LibraryBookService } from './library-book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Library, Book])],
  controllers: [LibraryBookController],
  providers: [LibraryBookService],
})
export class LibraryBookModule { }
