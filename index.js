const { getState } = require("@saltcorn/data/db/state");
const Table = require("@saltcorn/data/models/table");
const Field = require("@saltcorn/data/models/field");

module.exports = {
  sc_plugin_api_version: 1,
  onInstall: async () => {
    // Create UserEmailSettings table
    const userSettings = await Table.create("user_email_settings", {
      min_role_read: 1,
      fields: [
        new Field({ name: "user", label: "User", type: "Key", reftable_name: "users" }),
        new Field({ name: "smtp_host", type: "String" }),
        new Field({ name: "smtp_port", type: "Integer" }),
        new Field({ name: "smtp_username", type: "String" }),
        new Field({ name: "smtp_password", type: "String" }),
        new Field({ name: "imap_host", type: "String" }),
        new Field({ name: "imap_port", type: "Integer" }),
        new Field({ name: "imap_username", type: "String" }),
        new Field({ name: "imap_password", type: "String" }),
      ],
    });

    // Create Emails table
    const emails = await Table.create("emails", {
      min_role_read: 1,
      fields: [
        new Field({ name: "user", label: "User", type: "Key", reftable_name: "users" }),
        new Field({ name: "contact", label: "Contact", type: "Key", reftable_name: "contacts" }),
        new Field({ name: "subject", type: "String" }),
        new Field({ name: "body", type: "HTML" }),
        new Field({ name: "from", type: "String" }),
        new Field({ name: "to", type: "String" }),
        new Field({ name: "direction", type: "String" }), // 'inbound' or 'outbound'
        new Field({ name: "sent_at", type: "Date" }),
        new Field({ name: "read", type: "Bool" })
      ],
    });
  },
};
