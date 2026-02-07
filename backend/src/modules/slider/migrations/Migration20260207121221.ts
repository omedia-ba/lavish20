import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207121221 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "slide" ("id" text not null, "title" text null, "image_url" text not null, "link" text null, "position" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "slide_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_slide_deleted_at" ON "slide" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "slide" cascade;`);
  }

}
