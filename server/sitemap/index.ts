const { SitemapStream, streamToPromise } = require('sitemap')
import { getSettings, getPopArticles } from '../proxy/index';
import fs from "fs"
import blogConfig from '../../blog.config';
async function getsitemap(hostname: any) {
  try {
    const sitemap = new SitemapStream({ hostname, lastmodDateOnly: true });
    let { articles } = await getPopArticles(50000);
    sitemap.write({ url: '/', changefreq: 'monthly', priority: 1 })
    for (let i in articles) {
      sitemap.write({ url: `/blog/${articles[i].category.alias}/${articles[i].alias}`, changefreq: 'Weekly', priority: 0.5, lastmod: articles[i].modifyTime })
    }
    sitemap.end()
    streamToPromise(sitemap).then(sm => {
      // console.log(sm.toString())
      fs.writeFile(blogConfig.rootPath + "/static/sitemap.xml", sm.toString(), function (err) {
        if (err) {
          console.error(err);
        }
        console.log("生成sitemap成功！");
      });
    }).catch(console.error);
  } catch (error) {
    console.log('请输入正确的域名', error)
    return;
  }
}
export function sitemap() {
  getSettings().then((settings: any) => {
    if (settings.settings.blogHost == '' || settings.settings.blogHost == undefined) {
      console.log("没有配置站点域名，无法生成sitemap")
    } else {
      getsitemap(settings.settings.blogHost)
    }
  })
}

