import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LibraryBookService } from './library-book.service';

@Controller('libraries')
export class LibraryBookController {
  constructor(private readonly libraryBookService: LibraryBookService) { }

  @Post(':libraryId/books/:bookId')
  addBookToLibrary(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string
  ) {
    return this.libraryBookService.addBookToLibrary({
      libraryId: +libraryId,
      bookId: +bookId
    });
  }

  @Get(':libraryId/books')
  findBooksFromLibrary(@Param('libraryId') libraryId: string) {
    return this.libraryBookService.findBooksFromLibrary(+libraryId);
  }

  @Get(':libraryId/books/:bookId')
  findBookFromLibrary(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.libraryBookService.findBookFromLibrary(+libraryId, +bookId);
  }

  @Patch(':libraryId/books/:bookId')
  updateBooksFromLibrary(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.libraryBookService.updateBooksFromLibrary(+libraryId, { bookId: +bookId });
  }

  @Delete(':libraryId/books/:bookId')
  deleteBookFromLibrary(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.libraryBookService.deleteBookFromLibrary(+libraryId, +bookId);
  }
}
