module.exports = {
  type: "object",
  definitions: {},
  properties: {
    baseUrl: {
      type: "string",
    },
    destPath: {
      type: "string",
    },
    pageExtensions: {
      type: "array",
    },
    pagesPath: {
      type: "string",
    },
    pageTags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: {
            type: "string",
          },
          changefreq: {
            enum: [
              "always",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly",
              "never",
            ],
          },
          priority: {
            allOf: [{ minimum: 0 }, { maximum: 1 }, { type: "number" }],
          },
        },
        additionalProperties: false,
        required: ["path"],
      },
    },
    robots: {
      type: "boolean",
    },
    sitemap: {
      type: "boolean",
    },
  },
  required: ["baseUrl"],
  additionalProperties: false,
};
