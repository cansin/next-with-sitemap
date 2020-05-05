const fs = require("fs");
const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const validateOptions = require("schema-utils");
const X2JS = require("x2js");
const format = require("xml-formatter");
const glob = require("glob");

const schema = {
  type: "object",
  properties: {
    destPath: {
      type: "string",
    },
    domain: {
      type: "string",
    },
    pageExtensions: {
      type: "array",
    },
    pagesPath: {
      type: "string",
    },
    robots: {
      type: "boolean",
    },
    sitemap: {
      type: "boolean",
    },
  },
};

class SitemapPlugin {
  constructor(options) {
    validateOptions(schema, options, "SitemapPlugin");
    this.options = options;
  }

  apply(compiler) {
    const {
      destPath,
      robotsFilename = "robots.txt",
      sitemapFilename = "sitemap.xml",
      domain,
      pageExtensions,
      pagesPath,
      robots = true,
      sitemap = true,
    } = this.options;
    const robotsDest = path.join(destPath, robotsFilename);
    const sitemapDest = path.join(destPath, sitemapFilename);

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [robotsDest, sitemapDest],
    }).apply(compiler);

    compiler.hooks.done.tap("SitemapPlugin", () => {
      const x2js = new X2JS();
      const pages = glob
        .sync(`**/*.+(${pageExtensions.join(",")})`, { cwd: pagesPath })
        .map((page) =>
          page.replace(
            new RegExp(
              `(.*?)(index)?\\.(${pageExtensions
                .map((ext) => ext.replace(".", "\\."))
                .join("|")})`
            ),
            "$1"
          )
        )
        .filter((page) => !page.startsWith("_"));
      const date = new Date().toISOString().slice(0, 10);
      const sitemapObj = {
        urlset: {
          _xmlns: "https://www.sitemaps.org/schemas/sitemap/0.9/",
          url: [],
        },
      };

      pages.forEach((page) => {
        sitemapObj.urlset.url.push({
          loc: `${domain}/${page}`,
          lastmod: date,
        });
      });

      if (robots) {
        const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${domain}/${sitemapFilename}`;
        fs.writeFileSync(robotsDest, robotsTxt, {
          flag: "as",
        });
      }

      if (sitemap) {
        const sitemapXml = format(
          `<?xml version="1.0" encoding="UTF-8"?>${x2js.js2xml(sitemapObj)}`,
          {
            collapseContent: true,
          }
        );
        fs.writeFileSync(sitemapDest, sitemapXml, {
          flag: "as",
        });
      }
    });
  }
}

module.exports = SitemapPlugin;
