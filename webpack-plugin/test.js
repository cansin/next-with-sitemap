const defaults = require("./defaults");

const SitemapPlugin = require("./index");

const lastmod = new Date().toISOString().slice(0, 10);

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

  it("can generate 'sitemap.xml'", async () => {
    const options = {
      baseUrl: "https://www.example.com",
    };
    const plugin = new SitemapPlugin(options);
    expect(await plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [],
      },
    });
  });

  it("can generate 'robots.txt'", async () => {
    const options = {
      baseUrl: "https://www.example.com",
      pages: "webpack-plugin/test/pages",
    };
    const plugin = new SitemapPlugin(options);
    expect(await plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          {
            lastmod,
            loc: "https://www.example.com/about",
          },
          {
            lastmod,
            loc: "https://www.example.com/",
          },
          {
            lastmod,
            loc: "https://www.example.com/login",
          },
          {
            lastmod,
            loc: "https://www.example.com/signup",
          },
        ],
      },
    });
  });

  it("can have 'pageTags'", async () => {
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
    expect(await plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          {
            changefreq: "weekly",
            lastmod,
            loc: "https://www.example.com/about",
            path: "/about",
            priority: 0.5,
          },
          {
            lastmod,
            loc: "https://www.example.com/",
            path: "/",
            priority: 1,
          },
          {
            changefreq: "monthly",
            lastmod,
            loc: "https://www.example.com/login",
            path: "/login",
          },
          {
            lastmod,
            loc: "https://www.example.com/signup",
          },
        ],
      },
    });
  });

  it("can support 'exportPathMap'", async () => {
    const options = {
      baseUrl: "https://www.example.com",
      pages: "webpack-plugin/test/pages",
      exportPathMap: async function () {
        return {
          "/": { page: "/" },
          "/about": { page: "/about" },
          "/p/hello-nextjs": {
            page: "/post",
            query: { title: "hello-nextjs" },
          },
          "/p/learn-nextjs": {
            page: "/post",
            query: { title: "learn-nextjs" },
          },
          "/p/deploy-nextjs": {
            page: "/post",
            query: { title: "deploy-nextjs" },
          },
        };
      },
    };
    const plugin = new SitemapPlugin(options);
    expect(await plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          { lastmod, loc: "https://www.example.com/" },
          { lastmod, loc: "https://www.example.com/about" },
          { lastmod, loc: "https://www.example.com/p/hello-nextjs" },
          { lastmod, loc: "https://www.example.com/p/learn-nextjs" },
          { lastmod, loc: "https://www.example.com/p/deploy-nextjs" },
        ],
      },
    });
  });

  it("can support 'exportTrailingSlash'", async () => {
    const options = {
      baseUrl: "https://www.example.com",
      pages: "webpack-plugin/test/pages",
      exportTrailingSlash: true,
    };
    const plugin = new SitemapPlugin(options);
    expect(await plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          { lastmod, loc: "https://www.example.com/about/" },
          { lastmod, loc: "https://www.example.com/" },
          { lastmod, loc: "https://www.example.com/login/" },
          { lastmod, loc: "https://www.example.com/signup/" },
        ],
      },
    });
  });

  it("can have 'excludedPaths'", async () => {
    const options = {
      baseUrl: "https://www.example.com",
      pages: "webpack-plugin/test/pages",
      excludedPaths: ["/login", "/signup"],
    };
    const plugin = new SitemapPlugin(options);
    expect(await plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          { lastmod, loc: "https://www.example.com/about" },
          { lastmod, loc: "https://www.example.com/" },
        ],
      },
    });
  });

  it("can have 'extraPaths'", async () => {
    const options = {
      baseUrl: "https://www.example.com",
      pages: "webpack-plugin/test/pages",
      extraPaths: ["/extra/path"],
    };
    const plugin = new SitemapPlugin(options);
    expect(await plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          { lastmod, loc: "https://www.example.com/about" },
          { lastmod, loc: "https://www.example.com/" },
          { lastmod, loc: "https://www.example.com/login" },
          { lastmod, loc: "https://www.example.com/signup" },
          { lastmod, loc: "https://www.example.com/extra/path" },
        ],
      },
    });
  });

  it("can have 'alternateBaseUrls'", async () => {
    const options = {
      alternateBaseUrls: [
        {
          lang: "jp",
          url: "https://example.jp",
        },
        {
          lang: "es",
          url: "https://example.com/es",
        },
      ],
      baseUrl: "https://www.example.com",
      pages: "webpack-plugin/test/pages",
      extraPaths: ["/extra/path"],
    };
    const plugin = new SitemapPlugin(options);
    expect(await plugin.generateSitemap()).toEqual({
      urlset: {
        _xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xsi:schemaLocation":
          "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
        url: [
          {
            lastmod,
            loc: "https://www.example.com/about",
            "xhtml:link": [
              {
                _href: "https://example.jp/about",
                _hreflang: "jp",
                _rel: "alternate",
              },
              {
                _href: "https://example.com/es/about",
                _hreflang: "es",
                _rel: "alternate",
              },
            ],
          },
          {
            lastmod,
            loc: "https://www.example.com/",
            "xhtml:link": [
              {
                _href: "https://example.jp/",
                _hreflang: "jp",
                _rel: "alternate",
              },
              {
                _href: "https://example.com/es/",
                _hreflang: "es",
                _rel: "alternate",
              },
            ],
          },
          {
            lastmod,
            loc: "https://www.example.com/login",
            "xhtml:link": [
              {
                _href: "https://example.jp/login",
                _hreflang: "jp",
                _rel: "alternate",
              },
              {
                _href: "https://example.com/es/login",
                _hreflang: "es",
                _rel: "alternate",
              },
            ],
          },
          {
            lastmod,
            loc: "https://www.example.com/signup",
            "xhtml:link": [
              {
                _href: "https://example.jp/signup",
                _hreflang: "jp",
                _rel: "alternate",
              },
              {
                _href: "https://example.com/es/signup",
                _hreflang: "es",
                _rel: "alternate",
              },
            ],
          },
          {
            lastmod,
            loc: "https://www.example.com/extra/path",
            "xhtml:link": [
              {
                _href: "https://example.jp/extra/path",
                _hreflang: "jp",
                _rel: "alternate",
              },
              {
                _href: "https://example.com/es/extra/path",
                _hreflang: "es",
                _rel: "alternate",
              },
            ],
          },
        ],
      },
    });
  });
});
