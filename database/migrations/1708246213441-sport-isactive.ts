import { MigrationInterface, QueryRunner } from "typeorm";

export class SportIsactive1708246213441 implements MigrationInterface {
    name = 'SportIsactive1708246213441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "isActive"`);
    }

}
