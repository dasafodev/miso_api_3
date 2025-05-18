import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../book/entities/book.entity';
import { Library } from '../library/entities/library.entity';
import { CreateLibraryBookDto } from './dto/create-library-book.dto';
import { UpdateLibraryBookDto } from './dto/update-library-book.dto';

@Injectable()
export class LibraryBookService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) { }

  async addBookToLibrary(createLibraryBookDto: CreateLibraryBookDto) {
    const { libraryId, bookId } = createLibraryBookDto;

    const library = await this.libraryRepository.findOne({
      where: { id: libraryId },
      relations: ['books'],
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${libraryId} not found`);
    }

    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    if (library.books.some(b => b.id === bookId)) {
      throw new BadRequestException(`Book with ID ${bookId} is already in library ${libraryId}`);
    }

    library.books.push(book);
    await this.libraryRepository.save(library);

    return { message: `Book ${bookId} added to library ${libraryId}` };
  }

  async findBooksFromLibrary(libraryId: number) {
    const library = await this.libraryRepository.findOne({
      where: { id: libraryId },
      relations: ['books'],
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${libraryId} not found`);
    }

    return library.books;
  }

  async findBookFromLibrary(libraryId: number, bookId: number) {
    const library = await this.libraryRepository.findOne({
      where: { id: libraryId },
      relations: ['books'],
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${libraryId} not found`);
    }

    const book = library.books.find(b => b.id === bookId);

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found in library ${libraryId}`);
    }

    return book;
  }

  async updateBooksFromLibrary(libraryId: number, updateLibraryBookDto: UpdateLibraryBookDto) {
    const library = await this.libraryRepository.findOne({
      where: { id: libraryId },
      relations: ['books'],
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${libraryId} not found`);
    }

    if (updateLibraryBookDto.bookId) {
      const newBook = await this.bookRepository.findOne({
        where: { id: updateLibraryBookDto.bookId },
      });

      if (!newBook) {
        throw new NotFoundException(`Book with ID ${updateLibraryBookDto.bookId} not found`);
      }

      library.books = [newBook];
      await this.libraryRepository.save(library);
    }

    return library.books;
  }

  async deleteBookFromLibrary(libraryId: number, bookId: number) {
    const library = await this.libraryRepository.findOne({
      where: { id: libraryId },
      relations: ['books'],
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${libraryId} not found`);
    }

    const initialBookCount = library.books.length;
    library.books = library.books.filter(book => book.id !== bookId);

    if (library.books.length === initialBookCount) {
      throw new NotFoundException(`Book with ID ${bookId} not found in library ${libraryId}`);
    }

    await this.libraryRepository.save(library);

    return { message: `Book ${bookId} removed from library ${libraryId}` };
  }
}
