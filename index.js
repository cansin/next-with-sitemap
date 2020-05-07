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
        dev,
        dir,
        outDir,
        distDir,
        buildId,
        isServer,
        config: { exportPathMap, exportTrailingSlash, pageExtensions, sitemap },
      } = options;

      if (isServer) {
        return config;
      }

      const { dest = "public", pages = "pages" } = sitemap;

      console.log("> Generating sitemap.xml and robots.txt");
      console.log(`> Pages folder: "${pages}"`);
      console.log(`> Destination folder: "${dest}"`);

      config.plugins.push(
        new SitemapPlugin({
          ...sitemap,
          dev,
          dir,
          outDir,
          distDir,
          buildId,
          pageExtensions,
          exportPathMap,
          exportTrailingSlash,
        })
      );

      return config;
    },
  };
}

module.exports = withSitemap;
