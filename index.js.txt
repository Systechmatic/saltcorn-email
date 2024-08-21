module.exports = {
  sc_plugin_api_version: 1, // Required API version
  plugin_name: "saltcorn-email-plugin",
  description: "A plugin to send emails from within Saltcorn",

  functions: {
    sendUserEmail: async (user_id, to, subject, body) => {
      const sqlQuery = require("@saltcorn/data/db/sql-query");
      const nodemailer = require("nodemailer");

      // Fetch user SMTP settings
      const user = await sqlQuery(
        `SELECT smtp_force_tls, smtp_host, smtp_password, smtp_port, smtp_username FROM users WHERE id = $1`,
        [user_id]
      );

      if (!user || user.length === 0) {
        throw new Error("User not found or SMTP settings are missing.");
      }

      const { smtp_force_tls, smtp_host, smtp_password, smtp_port, smtp_username } = user[0];

      // Set up the transporter with user's SMTP settings
      const transporter = nodemailer.createTransport({
        host: smtp_host,
        port: smtp_port,
        secure: smtp_force_tls, // true for 465, false for other ports
        auth: {
          user: smtp_username,
          pass: smtp_password,
        },
      });

      // Send email
      let info = await transporter.sendMail({
        from: smtp_username, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: body, // plain text body
      });

      return info;
    },
  },
};
