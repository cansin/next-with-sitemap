const fs = require("fs");
const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const validate = require("schema-utils");
const X2JS = require("x2js");
const format = require("xml-formatter");
const glob = require("glob");

const defaults = require("./defaults");
const schema = require("./schema");

class SitemapPlugin {
  constructor(options) {
    validate(schema, options, {
      name: "SitemapPlugin",
      baseDataPath: "sitemap",
    });
    this.options = {
      ...defaults,
      ...options,
    };
  }

  generateRobots() {
    const { baseUrl, sitemapFilename } = this.options;

    return `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/${sitemapFilename}`;
  }

  generateSitemap() {
    const { baseUrl, dir, pageExtensions, pages } = this.options;
    const pagesPath = path.join(dir, pages);

    const pageUrls = glob
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
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        url: [],
      },
    };

    pageUrls.forEach((page) => {
      sitemapObj.urlset.url.push({
        loc: `${baseUrl}/${page}`,
        lastmod: date,
      });
    });

    return sitemapObj;
  }

  apply(compiler) {
    const {
      dest,
      dir,
      robotsFilename,
      sitemapFilename,
      robots,
      sitemap,
    } = this.options;
    const robotsDest = path.join(dir, dest, robotsFilename);
    const sitemapDest = path.join(dir, dest, sitemapFilename);

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [robotsDest, sitemapDest],
    }).apply(compiler);

    compiler.hooks.done.tap("SitemapPlugin", () => {
      const x2js = new X2JS();

      if (robots) {
        const robotsTxt = this.generateRobots();
        fs.writeFileSync(robotsDest, robotsTxt, {
          flag: "as",
        });
      }

      if (sitemap) {
        const sitemapObj = this.generateSitemap();
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
