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

  async generateSitemap() {
    const {
      alternateBaseUrls,
      baseUrl,
      dev,
      dir,
      outDir,
      distDir,
      buildId,
      excludedPaths,
      extraPaths,
      exportPathMap,
      exportTrailingSlash,
      pageExtensions,
      pages,
      pageTags,
    } = this.options;
    const pagesPath = path.join(dir, pages);

    const defaultPaths = glob
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
      .filter((page) => !page.startsWith("_"))
      .map((page) => `/${page}${exportTrailingSlash && page ? "/" : ""}`);

    let pathMap = {};
    defaultPaths.forEach((path) => {
      pathMap[path] = { page: path };
    });

    if (exportPathMap) {
      pathMap = await exportPathMap(pathMap, {
        dev,
        dir,
        outDir,
        distDir,
        buildId,
      });
    }

    if (excludedPaths) {
      excludedPaths.forEach((excludedPath) => delete pathMap[excludedPath]);
    }

    if (extraPaths) {
      extraPaths.forEach(
        (extraPath) => (pathMap[extraPath] = { path: extraPath })
      );
    }

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

    Object.keys(pathMap).forEach((page) => {
      const defaultsTags = {
        loc: `${baseUrl}${page}`,
        lastmod: date,
      };

      if (alternateBaseUrls.length) {
        defaultsTags["xhtml:link"] = alternateBaseUrls.map(({ lang, url }) => ({
          _rel: "alternate",
          _hreflang: lang,
          _href: `${url}${page}`,
        }));
      }

      const additionalTags = pageTags.find((p) => p.path === page) || {};

      sitemapObj.urlset.url.push({
        ...defaultsTags,
        ...additionalTags,
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

    compiler.hooks.done.tap("SitemapPlugin", async () => {
      const x2js = new X2JS();

      if (robots) {
        const robotsTxt = this.generateRobots();
        fs.writeFileSync(robotsDest, robotsTxt, {
          flag: "as",
        });
      }

      if (sitemap) {
        const sitemapObj = await this.generateSitemap();
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
