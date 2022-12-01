import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ default: true })
  isUse: boolean;

  @Exclude()
  @Column({ default: false })
  isDel: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
