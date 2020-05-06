const defaults = require("./defaults");
const SitemapPlugin = require(".");

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
      dest: "public",
      pages: "pages",
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
      pages: "webpack-plugin/test/pages",
    };
    const plugin = new SitemapPlugin(options);
    expect(plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          {
            lastmod: "2020-05-06",
            loc: "https://www.example.com/about",
          },
          {
            lastmod: "2020-05-06",
            loc: "https://www.example.com/",
          },
          {
            lastmod: "2020-05-06",
            loc: "https://www.example.com/login",
          },
          {
            lastmod: "2020-05-06",
            loc: "https://www.example.com/signup",
          },
        ],
      },
    });
  });

  it("can have 'pageTags'", () => {
    const options = {
      baseUrl: "https://www.example.com",
      pages: "webpack-plugin/test/pages",
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
    };
    const plugin = new SitemapPlugin(options);
    expect(plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          {
            changefreq: "weekly",
            lastmod: "2020-05-06",
            loc: "https://www.example.com/about",
            path: "/about",
            priority: 0.5,
          },
          {
            lastmod: "2020-05-06",
            loc: "https://www.example.com/",
            path: "/",
            priority: 1,
          },
          {
            changefreq: "monthly",
            lastmod: "2020-05-06",
            loc: "https://www.example.com/login",
            path: "/login",
          },
          {
            lastmod: "2020-05-06",
            loc: "https://www.example.com/signup",
          },
        ],
      },
    });
  });
});
