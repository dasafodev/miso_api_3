import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Library } from "../../library/entities/library.entity";

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publishedDate: Date;

    @Column()
    isbn: string;

    @ManyToMany(() => Library, library => library.books)
    libraries: Library[];
}
