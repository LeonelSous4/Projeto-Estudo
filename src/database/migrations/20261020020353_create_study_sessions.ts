import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("study_sessions", (table) => {
        table.increments("id").primary();
        table.enum("type", ["teoria", "questoes", "revisao"]).notNullable();
        table.enum("status", ["active", "paused", "finished"]).notNullable().defaultTo("active");
        table.integer("duration_seconds").unsigned().notNullable().defaultTo(0);
        table.timestamp("active_since").nullable();
        table.timestamp("finished_at").nullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

        table.integer("notebook_id").unsigned().notNullable();
        table.foreign("notebook_id").references("id").inTable("notebooks").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("study_sessions")
}
