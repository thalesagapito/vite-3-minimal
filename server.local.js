// @ts-check
const fs = require('fs')
const path = require('path')
const express = require('express')

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

async function createServer(root = process.cwd()) {
  const resolve = (p) => path.resolve(__dirname, p)
  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  const vite = await require('vite').createServer({
    root,
    logLevel: isTest ? 'error' : 'info',
    server: {
      middlewareMode: true
    }
  })
  // use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      // always read fresh template in dev
      const template = fs.readFileSync(resolve('index.html'), 'utf-8');
      const viteTransformedTemplate = await vite.transformIndexHtml(url, template);
      const { render } = (await vite.ssrLoadModule('/src/entry-server.js'));

      const [appHtml, preloadLinks, { ctx }] = await render(url, {});
      const teleports = ctx.teleports || {};

      const html = viteTransformedTemplate
        .replace('ssr-html-attrs', teleports.htmlAttrs || '')
        .replace('ssr-head-attrs', teleports.headAttrs || '')
        .replace('<!--ssr-head-->', teleports.head || '')
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace('ssr-body-attrs', teleports.bodyAttrs || '')
        .replace('<!--ssr-body-prepend-->', teleports['body-prepend'] || '')
        .replace('<!--ssr-app-->', appHtml)
        .replace('<!--ssr-body-append-->', teleports.body || '')

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  )
}

// for test use
exports.createServer = createServer
