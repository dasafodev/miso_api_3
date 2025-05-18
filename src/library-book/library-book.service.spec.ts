import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../book/entities/book.entity';
import { Library } from '../library/entities/library.entity';
import { LibraryBookService } from './library-book.service';

const mockBook = { id: 1, title: 'Book', author: 'Author', publishedDate: new Date('2020-01-01'), isbn: '978-3-16-148410-0', libraries: [] };
const mockLibrary = { id: 1, name: 'Library', address: 'Addr', city: 'City', openingTime: '08:00', closingTime: '18:00', books: [mockBook] };
const emptyLibrary = { ...mockLibrary, books: [] };

describe('LibraryBookService', () => {
  let service: LibraryBookService;
  let libraryRepository: Repository<Library>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryBookService,
        {
          provide: getRepositoryToken(Library),
          useValue: {
            findOne: jest.fn().mockImplementation(({ where: { id }, relations }) => {
              if (id === mockLibrary.id) return Promise.resolve({ ...mockLibrary });
              if (id === emptyLibrary.id) return Promise.resolve({ ...emptyLibrary });
              return Promise.resolve(undefined);
            }),
            save: jest.fn().mockImplementation(lib => Promise.resolve(lib)),
          },
        },
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOne: jest.fn().mockImplementation(({ where: { id } }) =>
              id === mockBook.id ? Promise.resolve(mockBook) : Promise.resolve(undefined)
            ),
          },
        },
      ],
    }).compile();

    service = module.get<LibraryBookService>(LibraryBookService);
    libraryRepository = module.get<Repository<Library>>(getRepositoryToken(Library));
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a book to library', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...emptyLibrary });
    (bookRepository.findOne as jest.Mock).mockResolvedValueOnce(mockBook);
    const dto = { libraryId: 1, bookId: 1 };
    const result = await service.addBookToLibrary(dto);
    expect(result).toEqual({ message: 'Book 1 added to library 1' });
  });

  it('should throw if library not found', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.addBookToLibrary({ libraryId: 999, bookId: 1 })).rejects.toThrow(NotFoundException);
  });

  it('should throw if book not found', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...emptyLibrary });
    (bookRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.addBookToLibrary({ libraryId: 1, bookId: 999 })).rejects.toThrow(NotFoundException);
  });

  it('should throw if book already in library', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...mockLibrary });
    await expect(service.addBookToLibrary({ libraryId: 1, bookId: 1 })).rejects.toThrow(BadRequestException);
  });

  it('should find books from library', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...mockLibrary });
    expect(await service.findBooksFromLibrary(1)).toEqual([mockBook]);
  });

  it('should throw if library not found (findBooksFromLibrary)', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findBooksFromLibrary(999)).rejects.toThrow(NotFoundException);
  });

  it('should find a book from library', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...mockLibrary });
    expect(await service.findBookFromLibrary(1, 1)).toEqual(mockBook);
  });

  it('should throw if book not found in library', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...emptyLibrary, books: [] });
    await expect(service.findBookFromLibrary(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('should update books from library', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...mockLibrary });
    (bookRepository.findOne as jest.Mock).mockResolvedValueOnce(mockBook);
    const result = await service.updateBooksFromLibrary(1, { bookId: 1 });
    expect(result).toEqual([mockBook]);
  });

  it('should throw if library not found (updateBooksFromLibrary)', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.updateBooksFromLibrary(999, { bookId: 1 })).rejects.toThrow(NotFoundException);
  });

  it('should throw if new book not found (updateBooksFromLibrary)', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...mockLibrary });
    (bookRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.updateBooksFromLibrary(1, { bookId: 999 })).rejects.toThrow(NotFoundException);
  });

  it('should delete a book from library', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...mockLibrary });
    const result = await service.deleteBookFromLibrary(1, 1);
    expect(result).toEqual({ message: 'Book 1 removed from library 1' });
  });

  it('should throw if library not found (deleteBookFromLibrary)', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.deleteBookFromLibrary(999, 1)).rejects.toThrow(NotFoundException);
  });

  it('should throw if book not found in library (deleteBookFromLibrary)', async () => {
    (libraryRepository.findOne as jest.Mock).mockResolvedValueOnce({ ...emptyLibrary, books: [] });
    await expect(service.deleteBookFromLibrary(1, 1)).rejects.toThrow(NotFoundException);
  });
});
