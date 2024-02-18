import { MigrationInterface, QueryRunner } from "typeorm";

export class ScheduleTime1708257970968 implements MigrationInterface {
    name = 'ScheduleTime1708257970968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" ADD "time" TIME NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "time"`);
    }

}
