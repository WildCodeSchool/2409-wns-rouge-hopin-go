import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1761125726746 implements MigrationInterface {
    name = 'UpdateUserEntity1761125726746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isVerified" boolean NOT NULL DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isVerified"`);
    }

}
