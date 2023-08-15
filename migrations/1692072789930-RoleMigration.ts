import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleMigration1692072789930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS public.role
      (
          name character varying COLLATE pg_catalog."default" NOT NULL,
          description character varying COLLATE pg_catalog."default" NOT NULL,
          status character varying(50) COLLATE pg_catalog."default" NOT NULL,
          id uuid NOT NULL DEFAULT uuid_generate_v4(),
          CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id),
          CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name),
          CONSTRAINT "UQ_c216a82ffa1e4c6d0224c349272" UNIQUE (description)
      )
      
      TABLESPACE pg_default;
      
      ALTER TABLE public.role
          OWNER to postgres;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.role;`);
  }
}
