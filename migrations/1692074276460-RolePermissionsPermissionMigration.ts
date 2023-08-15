import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolePermissionsPermissionMigration1692074276460
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS public.role_permissions_permission
      (
          "roleId" uuid NOT NULL,
          "permissionId" uuid NOT NULL,
          CONSTRAINT "PK_b817d7eca3b85f22130861259dd" PRIMARY KEY ("roleId", "permissionId"),
          CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9" FOREIGN KEY ("roleId")
              REFERENCES public.role (id) MATCH SIMPLE
              ON UPDATE CASCADE
              ON DELETE CASCADE,
          CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2" FOREIGN KEY ("permissionId")
              REFERENCES public.permission (id) MATCH SIMPLE
              ON UPDATE CASCADE
              ON DELETE CASCADE
      )
      
      TABLESPACE pg_default;
      
      ALTER TABLE public.role_permissions_permission
          OWNER to postgres;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.role_permissions_permission;`);
  }
}
