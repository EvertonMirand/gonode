"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TaskSchema extends Schema {
  up() {
    this.create("tasks", table => {
      table.increments();
      table
        .integer("project_id")
        .unsigned()
        .references("id")
        .inTable("projects")
        .onUpdate("CASCADE")
        .onDele("CASCADE")
        .notNullabe();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDele("SET NULL");
      table
        .integer("file_id")
        .unsigned()
        .references("id")
        .inTable("files")
        .onUpdate("CASCADE")
        .onDele("SET NULL");
      table.string("title").notNullabe();
      table.tex("description").notNullable();
      table.timestamp("dure_date");
      table.timestamps();
    });
  }

  down() {
    this.drop("tasks");
  }
}

module.exports = TaskSchema;
