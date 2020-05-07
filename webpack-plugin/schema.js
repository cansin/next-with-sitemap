module.exports = {
  type: "object",
  definitions: {},
  properties: {
    alternateBaseUrls: {
      type: "array",
      items: {
        type: "object",
        properties: {
          lang: {
            type: "string",
            minLength: 1,
          },
          url: {
            type: "string",
            minLength: 1,
          },
        },
        additionalProperties: false,
        required: ["lang", "url"],
      },
      uniqueItems: true,
    },
    baseUrl: {
      type: "string",
    },
    buildId: {
      type: "string",
    },
    dest: {
      type: "string",
    },
    dev: {
      type: "boolean",
    },
    dir: {
      type: "string",
    },
    distDir: {
      type: "string",
    },
    excludedPaths: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
      uniqueItems: true,
    },
    extraPaths: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
      uniqueItems: true,
    },
    exportPathMap: {
      instanceof: "Function",
    },
    exportTrailingSlash: {
      type: "boolean",
    },
    outDir: {
      type: "string",
    },
    pageExtensions: {
      type: "array",
      uniqueItems: true,
    },
    pages: {
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
      uniqueItems: true,
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
