import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { Book } from './book/entities/book.entity';
import { Library } from './library/entities/library.entity';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'pass12345',
      username: 'postgres',
      entities: [Library, Book],
      database: 'library',
      synchronize: true,
      logging: true,
    }),
    LibraryModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
