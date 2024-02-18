import { MigrationInterface, QueryRunner } from 'typeorm'

export class Schedule1708250863824 implements MigrationInterface {
  name = 'Schedule1708250863824'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sport-class" RENAME COLUMN "duration" TO "scheduleId"`)
    await queryRunner.query(
      `CREATE TABLE "schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "duration" integer, "dayOfWeek" "public"."schedule_dayofweek_enum" NOT NULL, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "sport-class" DROP COLUMN "scheduleId"`)
    await queryRunner.query(`ALTER TABLE "sport-class" ADD "scheduleId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "sport-class" ADD CONSTRAINT "FK_6aae1a292ad24f725c6fec89f7a" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sport-class" DROP CONSTRAINT "FK_6aae1a292ad24f725c6fec89f7a"`)
    await queryRunner.query(`ALTER TABLE "sport-class" DROP COLUMN "scheduleId"`)
    await queryRunner.query(`ALTER TABLE "sport-class" ADD "scheduleId" integer`)
    await queryRunner.query(`DROP TABLE "schedule"`)
    await queryRunner.query(`ALTER TABLE "sport-class" RENAME COLUMN "scheduleId" TO "duration"`)
  }
}
