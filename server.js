// @ts-check
const fs = require('fs')
const path = require('path')

const resolve = (p) => path.resolve(__dirname, p)
const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
const manifest = require('./dist/client/ssr-manifest.json');
const { render } = require('./dist/server/entry-server.js');

exports.handler = async (event) => {
  console.log(event)
  console.log(event.path)
  try {
    const [appHtml, preloadLinks, { ctx }] = await render(event.path, manifest)
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

    return {
      body: html,
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
    };
    
  } catch (handlerError) {
    return {
      statusCode: 502,
      body: JSON.stringify({
        status: 'BAD_GATEWAY',
        data: {
          error_message: handlerError.message,
          error_stack: handlerError.stack,
        },
      }),
    };
  }
};
