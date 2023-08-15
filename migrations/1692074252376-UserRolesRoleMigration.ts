import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolesRoleMigration1692074252376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS public.user_roles_role
      (
          "userId" uuid NOT NULL,
          "roleId" uuid NOT NULL,
          CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"),
          CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId")
              REFERENCES public.role (id) MATCH SIMPLE
              ON UPDATE CASCADE
              ON DELETE CASCADE,
          CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId")
              REFERENCES public."user" (id) MATCH SIMPLE
              ON UPDATE CASCADE
              ON DELETE CASCADE
      )
      
      TABLESPACE pg_default;
      
      ALTER TABLE public.user_roles_role
          OWNER to postgres;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.user_roles_role;`);
  }
}
