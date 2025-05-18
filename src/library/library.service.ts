import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { Library } from './entities/library.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,

  ) { }

  async create(createLibraryDto: CreateLibraryDto): Promise<Library> {
    this.validateLibraryTime(createLibraryDto.openingTime, createLibraryDto.closingTime);
    const library = this.libraryRepository.create(createLibraryDto);
    return this.libraryRepository.save(library);
  }

  async findAll(): Promise<Library[]> {
    return this.libraryRepository.find({ relations: ['books'] });
  }

  async findOne(id: number): Promise<Library> {
    const library = await this.libraryRepository.findOne({
      where: { id },
      relations: ['books']
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${id} not found`);
    }

    return library;
  }

  async update(id: number, updateLibraryDto: UpdateLibraryDto): Promise<Library> {
    const library = await this.findOne(id);

    if (updateLibraryDto.openingTime || updateLibraryDto.closingTime) {
      const openingTime = updateLibraryDto.openingTime || library.openingTime;
      const closingTime = updateLibraryDto.closingTime || library.closingTime;
      this.validateLibraryTime(openingTime, closingTime);
    }

    return this.libraryRepository.save({
      ...library,
      ...updateLibraryDto,
    });
  }

  async remove(id: number): Promise<void> {
    const library = await this.findOne(id);
    await this.libraryRepository.remove(library);
  }

  private validateLibraryTime(openingTime: string, closingTime: string): void {
    const openingDate = new Date(`2025-01-01T${openingTime}`);
    const closingDate = new Date(`2025-01-01T${closingTime}`);

    if (openingDate >= closingDate) {
      throw new BadRequestException('The opening time must be before the closing time');
    }
  }
}
