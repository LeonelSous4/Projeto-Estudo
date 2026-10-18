import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("notebooks", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("updated_at").defaultTo(knex.fn.now())
        table.integer("collection_id").unsigned().notNullable();

        
        table.foreign("collection_id").references("id").inTable("collections").onDelete("CASCADE");
    } )
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("notebooks")
}
