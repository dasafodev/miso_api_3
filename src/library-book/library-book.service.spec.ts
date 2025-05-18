import { Test, TestingModule } from '@nestjs/testing';
import { LibraryBookService } from './library-book.service';

describe('LibraryBookService', () => {
  let service: LibraryBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibraryBookService],
    }).compile();

    service = module.get<LibraryBookService>(LibraryBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
