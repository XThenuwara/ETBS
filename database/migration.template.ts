import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class MigrationName implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create new table:
        // await queryRunner.createTable(
        //     new Table({
        //         name: "table_name",
        //         columns: [
        //             {
        //                 name: "id",
        //                 type: "integer",
        //                 isPrimary: true,
        //                 isGenerated: true,
        //                 generationStrategy: "increment"
        //             }
        //         ]
        //     })
        // );

        // Add column:
        // await queryRunner.addColumn(
        //     "table_name",
        //     new TableColumn({
        //         name: "column_name",
        //         type: "varchar"
        //     })
        // );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop table:
        // await queryRunner.dropTable("table_name");
        
        // Drop column:
        // await queryRunner.dropColumn("table_name", "column_name");
    }
}