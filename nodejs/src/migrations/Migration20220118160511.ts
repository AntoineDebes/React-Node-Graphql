import { Migration } from '@mikro-orm/migrations';

export class Migration20220118160511 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "count" int4 null default 0, "updated_at" timestamptz(0) not null, "username" text not null, "access_token" text null, "refresh_token" text null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
  }

}
