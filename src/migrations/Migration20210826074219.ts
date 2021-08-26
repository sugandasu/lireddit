import { Migration } from "@mikro-orm/migrations";

export class Migration20210826074219 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "email" varchar(255) not null;');
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");'
    );
  }
}
