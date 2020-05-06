const path = require("path");

const SitemapPlugin = require("./webpack-plugin");

function withSitemap(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(webpackConfig, options) {
      let config = webpackConfig;
      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
      }

      const {
        dir,
        isServer,
        config: { pageExtensions, sitemap },
      } = options;

      if (isServer) {
        return config;
      }

      const { dest, pages } = sitemap;

      console.log("> Generating sitemap.xml and robots.txt");
      console.log(`> Pages folder: "${pages}"`);
      console.log(`> Destination folder: "${dest}"`);

      config.plugins.push(
        new SitemapPlugin({
          dir,
          pageExtensions,
          ...sitemap,
        })
      );

      return config;
    },
  };
}

module.exports = withSitemap;
