// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  // Default rules that apply to all entities not explicitly defined
  $default: {
    allow: {
      $default: "false", // Deny all operations on any undefined entities
    },
  },
  // Rules for all attributes - prevents creation of new namespaces
  attrs: {
    allow: {
      $default: "false", // Deny all attribute operations
    },
  },
  // Specific rules for notes - only allow access for joeaverbach@gmail.com
  notes: {
    allow: {
      view: "isAuthorizedUser && isOwner",
      create: "isAuthorizedUser && auth.id == data.ownerId",
      update: "isAuthorizedUser && isOwner",
      delete: "isAuthorizedUser && isOwner",
    },
    bind: [
      "isAuthorizedUser",
      "auth.id != null && auth.email == 'joeaverbukh@gmail.com'",
      "isLoggedIn",
      "auth.id != null",
      "isOwner",
      "isLoggedIn && auth.id == data.ownerId",
    ],
  },
} satisfies InstantRules;

export default rules;
