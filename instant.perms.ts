// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  notes: {
    allow: {
      view: "isOwner",
      create: "isLoggedIn && auth.id == data.ownerId",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: [
      "isLoggedIn",
      "auth.id != null",
      "isOwner",
      "isLoggedIn && auth.id == data.ownerId",
    ],
  },
} satisfies InstantRules;

export default rules;
