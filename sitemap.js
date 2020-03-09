const { SitemapStream, streamToPromise } = require('sitemap')
// Creates a sitemap object given the input configuration with URLs
const sitemap = new SitemapStream({ hostname: 'http://example.com' });
sitemap.write({ url: '/page-1/', changefreq: 'daily', priority: 0.3 })
sitemap.write('/page-2')
sitemap.end()
 
streamToPromise(sitemap)
  .then(sm => console.log(sm.toString()))
  .catch(console.error);