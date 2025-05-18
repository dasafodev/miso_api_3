import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from './entities/library.entity';
import { LibraryService } from './library.service';

const mockLibrary = {
  id: 1,
  name: 'Central Library',
  address: '123 Main St',
  city: 'Test City',
  openingTime: '08:00',
  closingTime: '18:00',
  books: [],
};

describe('LibraryService', () => {
  let service: LibraryService;
  let libraryRepository: Repository<Library>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: getRepositoryToken(Library),
          useValue: {
            create: jest.fn().mockImplementation(dto => ({ ...dto })),
            save: jest.fn().mockResolvedValue(mockLibrary),
            find: jest.fn().mockResolvedValue([mockLibrary]),
            findOne: jest.fn().mockImplementation(({ where: { id } }) =>
              id === mockLibrary.id ? Promise.resolve(mockLibrary) : Promise.resolve(undefined)
            ),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
    libraryRepository = module.get<Repository<Library>>(getRepositoryToken(Library));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a library', async () => {
    const dto = { name: mockLibrary.name, address: mockLibrary.address, city: mockLibrary.city, openingTime: mockLibrary.openingTime, closingTime: mockLibrary.closingTime, books: [] };
    expect(await service.create(dto as any)).toEqual(mockLibrary);
  });

  it('should throw if openingTime >= closingTime', async () => {
    const dto = { ...mockLibrary, openingTime: '18:00', closingTime: '08:00' };
    await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('should find all libraries', async () => {
    expect(await service.findAll()).toEqual([mockLibrary]);
  });

  it('should find one library by id', async () => {
    expect(await service.findOne(1)).toEqual(mockLibrary);
  });

  it('should throw if library not found', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a library', async () => {
    const updateDto = { name: 'Updated Library' };
    (libraryRepository.save as jest.Mock).mockResolvedValue({ ...mockLibrary, ...updateDto });
    expect(await service.update(1, updateDto as any)).toEqual({ ...mockLibrary, ...updateDto });
  });

  it('should throw if update openingTime >= closingTime', async () => {
    const updateDto = { openingTime: '18:00', closingTime: '08:00' };
    await expect(service.update(1, updateDto as any)).rejects.toThrow(BadRequestException);
  });

  it('should remove a library', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
