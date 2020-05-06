const defaults = require("./webpack/defaults");
const SitemapPlugin = require("./webpack/SitemapPlugin");

describe("Sitemap Plugin", () => {
  it("should error out if 'baseUrl' is missing", () => {
    const options = {};
    const plugin = () => new SitemapPlugin(options);
    expect(plugin).toThrow(/sitemap misses the property 'baseUrl'/);
  });

  it("won't error out if 'baseUrl' is given", () => {
    const options = {
      baseUrl: "https://www.example.com",
    };
    const plugin = new SitemapPlugin(options);
    expect(plugin).toEqual({ options: { ...defaults, ...options } });
  });

  it("can accept all the options", () => {
    const options = {
      baseUrl: "https://www.example.com",
      destPath: "/path/to/public",
      pagesPath: "/path/to/pages",
      pageTags: [
        {
          path: "/",
          priority: 1.0,
        },
        {
          path: "/login",
          changefreq: "monthly",
        },
        {
          path: "/about",
          changefreq: "weekly",
          priority: 0.5,
        },
      ],
      robots: false,
      sitemap: true,
    };
    const plugin = new SitemapPlugin(options);
    expect(plugin).toEqual({ options: { ...defaults, ...options } });
  });

  it("should error out if 'pageTags[].changefreq' is illformed", () => {
    const options = {
      baseUrl: "https://www.example.com",
      pageTags: [
        {
          path: "/",
          changefreq: "a-random-string",
        },
      ],
    };
    const plugin = () => new SitemapPlugin(options);
    expect(plugin).toThrow(/changefreq should be one of these/);
  });

  it("should error out if 'pageTags[].priority' is illformed", () => {
    const options = {
      baseUrl: "https://www.example.com",
      pageTags: [
        {
          path: "/",
          priority: 1.5,
        },
      ],
    };
    const plugin = () => new SitemapPlugin(options);
    expect(plugin).toThrow(/priority should be/);
  });

  it("should error out if unknown options is given", () => {
    const options = {
      baseUrl: "https://www.example.com",
      unknown: "option",
    };
    const plugin = () => new SitemapPlugin(options);
    expect(plugin).toThrow(/sitemap has an unknown property 'unknown'/);
  });

  it("can generate 'sitemap.xml'", () => {
    const options = {
      baseUrl: "https://www.example.com",
    };
    const plugin = new SitemapPlugin(options);
    expect(plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [],
      },
    });
  });

  it("can generate 'robots.txt'", () => {
    const options = {
      baseUrl: "https://www.example.com",
    };
    const plugin = new SitemapPlugin(options);
    expect(plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [],
      },
    });
  });
});
