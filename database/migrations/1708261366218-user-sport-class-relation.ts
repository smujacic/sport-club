import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSportClassRelation1708261366218 implements MigrationInterface {
    name = 'UserSportClassRelation1708261366218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_sport_class" ("userId" uuid NOT NULL, "sportClassId" uuid NOT NULL, CONSTRAINT "PK_484e29ca4e6ae4334e7204cea29" PRIMARY KEY ("userId", "sportClassId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0ad412da86fc2119a4c9ad3355" ON "user_sport_class" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1a495f954363f200c14f1de37" ON "user_sport_class" ("sportClassId") `);
        await queryRunner.query(`ALTER TABLE "user_sport_class" ADD CONSTRAINT "FK_0ad412da86fc2119a4c9ad3355c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_sport_class" ADD CONSTRAINT "FK_c1a495f954363f200c14f1de372" FOREIGN KEY ("sportClassId") REFERENCES "sport-class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_sport_class" DROP CONSTRAINT "FK_c1a495f954363f200c14f1de372"`);
        await queryRunner.query(`ALTER TABLE "user_sport_class" DROP CONSTRAINT "FK_0ad412da86fc2119a4c9ad3355c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1a495f954363f200c14f1de37"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ad412da86fc2119a4c9ad3355"`);
        await queryRunner.query(`DROP TABLE "user_sport_class"`);
    }

}
