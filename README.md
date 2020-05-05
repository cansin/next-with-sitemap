# next-with-sitemap

Higher order Next.js config to generate `sitemap.xml` and `robots.txt`.

![size](https://img.shields.io/bundlephobia/minzip/next-with-sitemap.svg) ![dependencies](https://img.shields.io/david/cansin/next-with-sitemap.svg) ![downloads](https://img.shields.io/npm/dt/next-with-sitemap) ![license](https://img.shields.io/npm/l/next-with-sitemap.svg)

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
    domain: "https://www.example.com",
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
by adding `sitemap` object in the Next.js config in `next.config.js`:

```js
const withSitemap = require("next-with-sitemap");

module.exports = withSitemap({
  sitemap: {
    domain: "https://www.example.com",
    dest: "public",
    pages: "pages",
    robots: true,
    sitemap: true,
  },
});
```

### Available Options

- **domain:** string (required) - the domain name including protocol and subdomain (e.g. `https://www.example.com`)
- **dest:** string - the destination folder to put generated files, relative to the project root
  - default to `public`
- **pages:** string - the folder that contains page files, relative to the project root
  - default to `pages`
- **robots:** boolean - whether to enable `robots.txt` generation
  - default to `true`
  - set `robots: false`, so it won't generate a `robots.txt`
  - set `robots: true` to generate a `robots.txt`
- **sitemap:** boolean - whether to enable `sitemap.xml` generation
  - default to `true`
  - set `sitemap: false`, so it won't generate a `sitemap.xml`
  - set `sitemap: true` to generate a `sitemap.xml`