import { IsDate, IsString, Max, MaxLength, Min } from "class-validator";
import {
  Field,
  ID,
  InputType,
  ObjectType,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { IdInput } from "./Id";

@Entity()
@ObjectType()
export class Ride extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  departure_city!: string;

  @Column()
  @Field()
  arrival_city!: string;

  @Column()
  @Field()
  departure_address!: string;

  @Column()
  @Field()
  arrival_address!: string;

  @Column({ type: "timestamp" })
  @Field()
  departure_at!: Date;

  @Column({ type: "timestamp" }) // how to put timestampz ?
  @Field()
  arrival_at!: Date

  @Column()
  @Field()
  max_passenger!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' }) // this specifies the name of the column in the database
  @Field(() => User)
  driver_id!: User;

  @Column({default: 0})
  @Field()
  nb_passenger!: number;

  // It has to be declared automatically by the departure_city / arrival_city position
  @Column({ type: "decimal", precision: 10, scale: 6 })
  @Field()
  departure_lat!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  @Field()
  departure_lng!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  @Field()
  arrival_lat!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  @Field()
  arrival_lng!: number;

  @Column({default: false})
  @Field()
  is_canceled!: boolean;

  @Field()
  @CreateDateColumn()
  created_at!: Date;
}

@InputType()
export class RideCreateInput {

  @Field()
  @MaxLength(255)
  @IsString()
  departure_city!: string;

  @Field()
  @MaxLength(255)
  @IsString()
  arrival_city!: string;

  @Field()
  @MaxLength(255)
  @IsString()
  departure_address!: string;

  @Field((type) => IdInput)
  driver_id!: IdInput;

  @Field()
  @MaxLength(255)
  @IsString()
  arrival_address!: string;

  @Field()
  @IsDate()
  departure_at!: Date;

  @Field()
  @IsDate()
  arrival_at!: Date;

  @Field()
  departure_lng!: number;

  @Field()
  departure_lat!: number;

  @Field()
  arrival_lng!: number;
  
  @Field()
  arrival_lat!: number;

  @Field()
  @Min(1)
  @Max(4)
  max_passenger!: number;

  @Field()
  @CreateDateColumn()
  created_at!: Date;
}

@InputType()
export class RideUpdateInput {
  @Field()
  departure_at!: string;

  @Field()
  arrival_at!: string;

  @Field()
  max_passenger!: number;

  @Field()
  is_canceled!: boolean;
}
