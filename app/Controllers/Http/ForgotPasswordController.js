"use strict";

const User = use("App/Models/User");

const crypto = require("crypto");

class ForgotPasswordController {
  async store({ request, response }) {
    try {
      const email = request.input("email");
      // const token = await auth.attempt(email, password);
      const user = await User.findByOrFail("email", email);

      user.token = crypto.randomBytes(10).toString("hex");
      user.token_created_at = new Date();

      await user.save();
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "E-mail não encontrado" } });
    }
  }
}

module.exports = ForgotPasswordController;
