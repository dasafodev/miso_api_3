import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "../../book/entities/book.entity";

@Entity()
export class Library {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    openingTime: string;

    @Column()
    closingTime: string;

    @ManyToMany(() => Book, book => book.libraries)
    @JoinTable()
    books: Book[];
}
