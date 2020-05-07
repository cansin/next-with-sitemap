# next-with-sitemap

Higher order Next.js config to generate `sitemap.xml` and `robots.txt`.
Read more at [Medium](https://medium.com/@cansinyildiz/your-first-higher-order-next-js-config-cf8813b15807).
Heavily inspired from [IlusionDev/nextjs-sitemap-generator](https://github.com/IlusionDev/nextjs-sitemap-generator).

![size](https://img.shields.io/bundlephobia/minzip/next-with-sitemap.svg) ![dependencies](https://img.shields.io/david/cansin/next-with-sitemap.svg) ![build](https://img.shields.io/travis/com/cansin/next-with-sitemap) ![downloads](https://img.shields.io/npm/dt/next-with-sitemap) ![license](https://img.shields.io/npm/l/next-with-sitemap.svg)

## Install

```bash
yarn add next-with-sitemap
```

## Basic Usage

Update or create `next.config.js` with

```js
const withSitemap = require("next-with-sitemap");

module.exports = withSitemap({
  sitemap: {
    baseUrl: "https://www.example.com",
  },
  // .
  // ..
  // ... other Next.js config
});
```

Add `sitemap.xml` and `robots.txt` to your `.gitignore`

```git
robots.txt
sitemap.xml
```

## Configuration

There are options you can use to customize the behavior of this plugin
by adding `sitemap` object in the Next.js config in `next.config.js`.
Alongside those given `sitemap` options, this library would also rely
on your Next.js config values `exportPathMap`, `exportTrailingSlash`,
and `pageExtensions` to come up with the correct `sitemap.xml` content.

```js
const withSitemap = require("next-with-sitemap");

module.exports = withSitemap({
  sitemap: {
    baseUrl: "https://www.example.com",
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
    dest: "public",
    excludedPaths: ["/login", "/signup"],
    extraPaths: ["/extra/path"],
    pages: "pages",
    pageTags: [
      {
        path: "/",
        priority: 1.0,
      },
      {
        path: "/extra/path",
        changefreq: "monthly",
      },
      {
        path: "/about",
        changefreq: "weekly",
        priority: 0.5,
      },
    ],
    robots: true,
    sitemap: true,
  },
});
```

### Available Options

- **baseUrl:** string (required) - the baseUrl name including protocol and subdomain (e.g. `https://www.example.com`).
- **alternateBaseUrls:** array - an array of alternative base urls for given languages.
  - defaults to `[]`.
  - for each object in array:
    - set `lang` (required) to the language identifier,
    - set `url` (required) to the base url that should be used for that `lang`.
- **dest:** string - the destination folder to put generated files, relative to the project root.
  - defaults to `public`.
- **excludedPaths:** array - an array of paths that should be excluded from the sitemap.
  - defaults to `[]`.
- **extraPaths:** array - an array of extra paths that cannot be found at `pages` folder and that should be included to the sitemap.
  - defaults to `[]`.
- **pages:** string - the folder that contains page files, relative to the project root.
  - defaults to `pages`.
- **pageTags:** array - an array of additional tags for any given path.
  - defaults to `[]`.
  - for each object in array:
    - set `path` (required) to the relative path of the page,
    - set `changefreq` to one of `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never` values,
    - set `priority` to a number value between `0` and `1` (inclusive).
- **robots:** boolean - whether to enable `robots.txt` generation.
  - defaults to `true`,
  - set `robots: false`, so it won't generate a `robots.txt`,
  - set `robots: true` to generate a `robots.txt`.
- **sitemap:** boolean - whether to enable `sitemap.xml` generation.
  - defaults to `true`,
  - set `sitemap: false`, so it won't generate a `sitemap.xml`,
  - set `sitemap: true` to generate a `sitemap.xml`.
