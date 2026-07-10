const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const metaPath = path.join(__dirname, '..', 'route-meta.json');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Build output dist/index.html not found! Run npm run build first.');
  process.exit(1);
}

if (!fs.existsSync(metaPath)) {
  console.error('route-meta.json not found!');
  process.exit(1);
}

const template = fs.readFileSync(indexHtmlPath, 'utf8');
const metaConfig = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

console.log('Starting pre-rendering build script...');

for (const [route, meta] of Object.entries(metaConfig.routes)) {
  console.log(`Pre-rendering route: ${route}`);
  
  // Format tags for insertion
  const robotsValue = meta.index ? 'index,follow' : 'noindex,nofollow';
  
  // Construct head tags
  const seoTags = `
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <meta name="robots" content="${robotsValue}" />
  <link rel="canonical" href="${meta.canonical}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${meta.canonical}" />
  <meta property="og:image" content="${meta.image || metaConfig.site.defaultImage}" />
  <meta name="twitter:card" content="${metaConfig.site.twitterCard}" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  `;

  // Clean template of existing title and meta descriptions if they exist
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/i, '');
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '');
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, '');
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, '');
  
  // Insert seoTags at the start of <head>
  html = html.replace('<head>', `<head>${seoTags}`);

  if (route === '/') {
    // Overwrite the root index.html with root SEO tags
    fs.writeFileSync(indexHtmlPath, html, 'utf8');
  } else {
    // Create directory for page (e.g. dist/about/)
    const routeDir = path.join(distDir, route.replace(/^\//, ''));
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    // Write pre-rendered index.html inside the route directory
    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
  }
}

console.log('Pre-rendering completed successfully!');
