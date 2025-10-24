import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1761041363459 implements MigrationInterface {
    name = 'Initial1761041363459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ride" ("id" SERIAL NOT NULL, "departure_city" character varying(100) NOT NULL, "arrival_city" character varying(100) NOT NULL, "departure_address" character varying(255) NOT NULL, "arrival_address" character varying(255) NOT NULL, "departure_at" TIMESTAMP WITH TIME ZONE NOT NULL, "arrival_at" TIMESTAMP WITH TIME ZONE NOT NULL, "max_passenger" smallint NOT NULL, "nb_passenger" smallint NOT NULL DEFAULT '0', "distance_km" numeric(6,2), "duration_min" integer, "route_polyline5" text, "departure_location" geography(Point,4326) NOT NULL, "arrival_location" geography(Point,4326) NOT NULL, "is_cancelled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, CONSTRAINT "CHK_08f14c499ea54975aca3e617ab" CHECK (nb_passenger <= max_passenger), CONSTRAINT "CHK_8a6d4f52cd95369c485b4b8418" CHECK (nb_passenger >= 0), CONSTRAINT "CHK_2e9b958b68c0d0c878fea7df86" CHECK (max_passenger BETWEEN 1 AND 4), CONSTRAINT "PK_f6bc30c4dd875370bafcb54af1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."passenger_ride_status_enum" AS ENUM('approved', 'refused', 'waiting', 'cancelled_by_passenger', 'cancelled_by_driver')`);
        await queryRunner.query(`CREATE TABLE "passenger_ride" ("user_id" integer NOT NULL, "ride_id" integer NOT NULL, "status" "public"."passenger_ride_status_enum" NOT NULL DEFAULT 'waiting', CONSTRAINT "PK_52b0ac76f6894a0d33eeba63db3" PRIMARY KEY ("user_id", "ride_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."userRole" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(100) NOT NULL, "email" citext NOT NULL, "role" "public"."userRole" NOT NULL DEFAULT 'user', "hashed_password" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "CHK_577ea0c1e32487ec5af01389aa" CHECK (char_length(last_name) >= 2), CONSTRAINT "CHK_e0c3fabdbfb51b4ae5a707351d" CHECK (char_length(first_name) >= 2), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ride" ADD CONSTRAINT "FK_90a1ac5467b49859d4ed9637f2e" FOREIGN KEY ("driver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passenger_ride" ADD CONSTRAINT "FK_3cee8ec80cac9042e7889c256f4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passenger_ride" ADD CONSTRAINT "FK_92eb981571f7ddcb506ccf9c822" FOREIGN KEY ("ride_id") REFERENCES "ride"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passenger_ride" DROP CONSTRAINT "FK_92eb981571f7ddcb506ccf9c822"`);
        await queryRunner.query(`ALTER TABLE "passenger_ride" DROP CONSTRAINT "FK_3cee8ec80cac9042e7889c256f4"`);
        await queryRunner.query(`ALTER TABLE "ride" DROP CONSTRAINT "FK_90a1ac5467b49859d4ed9637f2e"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."userRole"`);
        await queryRunner.query(`DROP TABLE "passenger_ride"`);
        await queryRunner.query(`DROP TYPE "public"."passenger_ride_status_enum"`);
        await queryRunner.query(`DROP TABLE "ride"`);
    }

}
