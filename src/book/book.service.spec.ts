import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

const mockBook = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  publishedDate: '2020-01-01',
  isbn: '978-3-16-148410-0',
  libraries: [],
};

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            create: jest.fn().mockImplementation(dto => ({ ...dto })),
            save: jest.fn().mockResolvedValue(mockBook),
            find: jest.fn().mockResolvedValue([mockBook]),
            findOne: jest.fn().mockImplementation(({ where: { id } }) =>
              id === mockBook.id ? Promise.resolve(mockBook) : Promise.resolve(undefined)
            ),
            merge: jest.fn(),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book', async () => {
    const dto = { title: mockBook.title, author: mockBook.author, publishedDate: mockBook.publishedDate, isbn: mockBook.isbn, libraries: [] };
    expect(await service.create(dto as any)).toEqual(mockBook);
  });

  it('should throw if publishedDate is in the future', async () => {
    const dto = { ...mockBook, publishedDate: new Date(Date.now() + 10000000).toISOString() };
    await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('should find all books', async () => {
    expect(await service.findAll()).toEqual([mockBook]);
  });

  it('should find one book by id', async () => {
    expect(await service.findOne(1)).toEqual(mockBook);
  });

  it('should throw if book not found', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a book', async () => {
    const updateDto = { title: 'Updated Title' };
    (bookRepository.save as jest.Mock).mockResolvedValue({ ...mockBook, ...updateDto });
    expect(await service.update(1, updateDto as any)).toEqual({ ...mockBook, ...updateDto });
  });

  it('should throw if update publishedDate is in the future', async () => {
    const updateDto = { publishedDate: new Date(Date.now() + 10000000).toISOString() };
    await expect(service.update(1, updateDto as any)).rejects.toThrow(BadRequestException);
  });

  it('should remove a book', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
