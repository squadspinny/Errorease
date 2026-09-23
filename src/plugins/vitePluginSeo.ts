import { Plugin, createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

export interface SeoPluginOptions {
  defaultDomain?: string;
}

export function vitePluginSeo(options: SeoPluginOptions = {}): Plugin {
  const defaultDomain = options.defaultDomain || process.env.SITE_URL || 'https://errorease.com';

  const generateRobotsTxt = (domain: string) => {
    return [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${domain}/sitemap.xml`,
      '',
    ].join('\n');
  };

  return {
    name: 'vite-plugin-errorease-seo',

    // 1. In Dev Server: dynamic on-the-fly handling for /sitemap.xml and /robots.txt
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || '';
        const pathname = rawUrl.split('?')[0];

        if (pathname === '/sitemap.xml') {
          try {
            const host = req.headers.host || 'errorease.com';
            const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
            const domain = `${protocol}://${host}`;

            // Load articles module dynamically with Vite SSR
            const articlesMod = await server.ssrLoadModule('/src/lib/articles.ts');
            const xml = articlesMod.generateSitemapXml(domain);

            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            res.statusCode = 200;
            res.end(xml);
            return;
          } catch (err) {
            console.error('[SEO Plugin] Failed to generate sitemap.xml:', err);
            next(err);
            return;
          }
        }

        if (pathname === '/robots.txt') {
          try {
            const host = req.headers.host || 'errorease.com';
            const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
            const domain = `${protocol}://${host}`;

            const robots = generateRobotsTxt(domain);

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            res.statusCode = 200;
            res.end(robots);
            return;
          } catch (err) {
            console.error('[SEO Plugin] Failed to generate robots.txt:', err);
            next(err);
            return;
          }
        }

        next();
      });
    },

    // 2. In Production Build: emit sitemap.xml and robots.txt into dist output
    async generateBundle() {
      try {
        // Create an ephemeral SSR server to dynamically load src/lib/articles.ts
        const ssrServer = await createViteServer({
          server: { middlewareMode: true },
          appType: 'custom',
        });

        const articlesMod = await ssrServer.ssrLoadModule('/src/lib/articles.ts');
        const sitemapXml = articlesMod.generateSitemapXml(defaultDomain);
        const robotsTxt = generateRobotsTxt(defaultDomain);

        await ssrServer.close();

        // Emit assets into Rollup/Vite build bundle
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: sitemapXml,
        });

        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: robotsTxt,
        });

        // Also ensure public/ folder has copies for any static file references
        try {
          const publicDir = path.resolve(process.cwd(), 'public');
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
          fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
        } catch (e) {
          // non-fatal
        }

        console.log(`[SEO Plugin] Generated sitemap.xml (${articlesMod.getAllArticles().length} articles) and robots.txt`);
      } catch (err) {
        console.error('[SEO Plugin] Error in generateBundle:', err);
      }
    },
  };
}
