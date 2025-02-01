import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class _event_table_20250201_191443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Event table:
    await queryRunner.createTable(
      new Table({
        name: "event",
        columns: [
          { name: "id", type: "integer", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", isNullable: false },
          { name: "description", type: "varchar", isNullable: false },
          { name: "start_date", type: "datetime", isNullable: false },
          { name: "end_date", type: "datetime", isNullable: false },
          { name: "location", type: "varchar", isNullable: false },
          { name: "total_tickets", type: "integer", isNullable: false },
          { name: "available_tickets", type: "integer", isNullable: false },
          { name: "price", type: "decimal", isNullable: false },
          { name: "created_at", type: "datetime", isNullable: false, default: "CURRENT_TIMESTAMP" },
          { name: "updated_at", type: "datetime", isNullable: false, default: "CURRENT_TIMESTAMP" },
        ],
      })
    );

    // Create Booking Table
    await queryRunner.createTable(
      new Table({
        name: "booking",
        columns: [
          { name: "id", type: "integer", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "event_id", type: "integer", isNullable: false },
          { name: "email", type: "string", isNullable: false },
          { name: "ticket_count", type: "integer", isNullable: false },
          { name: "total_price", type: "decimal", isNullable: false },
          { name: "created_at", type: "datetime", isNullable: false, default: "CURRENT_TIMESTAMP" },
          { name: "updated_at", type: "datetime", isNullable: false, default: "CURRENT_TIMESTAMP" },
        ],
      })
    );

    // Create Foreign Key
    await queryRunner.createForeignKey(
      "booking",
      new TableForeignKey({
        columnNames: ["event_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "event",
        onDelete: "CASCADE",
      })
    );

    // Create Waiting List
    await queryRunner.createTable(
      new Table({
        name: "waiting_list",
        columns: [
          { name: "id", type: "integer", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "event_id", type: "integer", isNullable: false },
          { name: "email", type: "string", isNullable: false },
          { name: "ticket_count", type: "integer", isNullable: false },
          { name: "created_at", type: "datetime", isNullable: false, default: "CURRENT_TIMESTAMP" },
          { name: "updated_at", type: "datetime", isNullable: false, default: "CURRENT_TIMESTAMP" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("waiting_list");
    await queryRunner.dropTable("booking");
    await queryRunner.dropTable("event");
  }
}
