const path = require("path");

const SitemapPlugin = require("./webpack/SitemapPlugin");

function withSitemap(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(webpackConfig, options) {
      let config = webpackConfig;
      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
      }

      const {
        isServer,
        config: {
          pageExtensions,
          sitemap: { dest = "public", domain, pages = "pages" } = {},
        },
      } = options;

      if (isServer) {
        return config;
      }

      const destPath = path.join(options.dir, dest);
      const pagesPath = path.join(options.dir, pages);

      console.log("> Generating sitemap.xml and robots.txt");
      console.log(`> Pages path: "${pagesPath}"`);
      console.log(`> Destination path: "${destPath}"`);

      config.plugins.push(
        new SitemapPlugin({
          destPath,
          domain,
          pagesPath,
          pageExtensions,
        })
      );

      return config;
    },
  };
}

module.exports = withSitemap;
