"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Project = use("App/Models/Project");

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request }) {
    const { page } = request.get();
    const projects = await Project.query()
      .with("user")
      .paginate(page);
    return projects;
  }

  /**
   * Create/save a new project.
   * POST projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const data = request.only(["title", "description"]);

    const project = await Project.create({
      ...data,
      user_id: auth.user.id
    });

    return project;
  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    try {
      const project = await Project.findOrFail(params.id);
      await project.load("user");
      await project.load("tasks");
      return project;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: "Erro ao encontrar o projeto"
        }
      });
    }
  }

  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id);
      const data = request.only(["title", "description"]);
      project.merge(data);
      await project.save();
      return project;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: "Erro ao atualizar o projeto"
        }
      });
    }
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id);

      await project.delete();
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: "Erro ao deletar o projeto"
        }
      });
    }
  }
}

module.exports = ProjectController;
