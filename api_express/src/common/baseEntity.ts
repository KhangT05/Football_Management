// import {
//     Column,
//     CreateDateColumn,
//     PrimaryGeneratedColumn
// } from 'typeorm';

// export abstract class BaseEntity {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ default: true })
//     isActive: boolean;

//     @CreateDateColumn()
//     created_at: Date;

//     @UpdateDateColumn({ nullable: true })
//     updated_at: Date | null;
// }