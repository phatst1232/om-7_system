import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermissionMigration1692073215624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS public.permission
      (
          name character varying COLLATE pg_catalog."default" NOT NULL,
          description character varying COLLATE pg_catalog."default" NOT NULL,
          status character varying(50) COLLATE pg_catalog."default" NOT NULL,
          id uuid NOT NULL DEFAULT uuid_generate_v4(),
          CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY (id),
          CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE (name),
          CONSTRAINT "UQ_b690135d86d59cc689d465ac952" UNIQUE (description)
      )
      
      TABLESPACE pg_default;
      
      ALTER TABLE public.permission
          OWNER to postgres;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.permission;`);
  }
}
