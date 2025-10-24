import { MigrationInterface, QueryRunner } from "typeorm";

export class NewUpdateUserEntity1761235209490 implements MigrationInterface {
    name = 'NewUpdateUserEntity1761235209490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hashed_reset_token" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "reset_token_expires_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isVerified" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isVerified" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "reset_token_expires_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashed_reset_token"`);
    }

}
