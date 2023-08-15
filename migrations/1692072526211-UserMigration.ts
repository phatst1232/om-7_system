import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1692072526211 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS public."user"
      (
          id uuid NOT NULL DEFAULT uuid_generate_v4(),
          email character varying(100) COLLATE pg_catalog."default" NOT NULL,
          username character varying(100) COLLATE pg_catalog."default",
          password character varying(100) COLLATE pg_catalog."default" NOT NULL,
          "fullName" character varying COLLATE pg_catalog."default",
          phone character varying(15) COLLATE pg_catalog."default",
          gender boolean,
          image character varying COLLATE pg_catalog."default",
          "dateOfBirth" date,
          "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
          status character varying(50) COLLATE pg_catalog."default" NOT NULL,
          CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id)
      )
      
      TABLESPACE pg_default;
      
      ALTER TABLE public."user"
          OWNER to postgres;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public."user";`);
  }
}
