import { MigrationInterface, QueryRunner } from "typeorm";

export class SportClass1708249145819 implements MigrationInterface {
    name = 'SportClass1708249145819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport-class" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "duration" integer, "sportId" uuid, CONSTRAINT "PK_3faa4cabd4dff4b96d0aaf10fd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sport-class" ADD CONSTRAINT "FK_b1e993080572ed5544097a72d67" FOREIGN KEY ("sportId") REFERENCES "sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport-class" DROP CONSTRAINT "FK_b1e993080572ed5544097a72d67"`);
        await queryRunner.query(`DROP TABLE "sport-class"`);
    }

}
