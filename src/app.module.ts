import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibraryModule } from './library/library.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [LibraryModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
