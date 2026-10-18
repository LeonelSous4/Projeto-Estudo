import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("topics", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.text("content").nullable();
        table.boolean("is_completed").defaultTo(false);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        table.integer("notebook_id").unsigned().notNullable();
        table.foreign("notebook_id").references("id").inTable("notebooks").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("topics");
}

