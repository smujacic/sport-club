import { MigrationInterface, QueryRunner } from "typeorm";

export class SportAndImage1708216667031 implements MigrationInterface {
    name = 'SportAndImage1708216667031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" bytea NOT NULL, "imageName" character varying NOT NULL, "mimetype" character varying NOT NULL, CONSTRAINT "PK_fbdc8c3fcf46f6d0a292b485f68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sport" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "imageId" uuid, CONSTRAINT "UQ_6a16e1d83cb581484036cee92bf" UNIQUE ("name"), CONSTRAINT "REL_f75242fec6d2a85c569c3a5fba" UNIQUE ("imageId"), CONSTRAINT "PK_c67275331afac347120a1032825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sport" ADD CONSTRAINT "FK_f75242fec6d2a85c569c3a5fba8" FOREIGN KEY ("imageId") REFERENCES "sport_image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport" DROP CONSTRAINT "FK_f75242fec6d2a85c569c3a5fba8"`);
        await queryRunner.query(`DROP TABLE "sport"`);
        await queryRunner.query(`DROP TABLE "sport_image"`);
    }

}
