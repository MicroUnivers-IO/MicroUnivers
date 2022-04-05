require('esbuild').build({
  entryPoints: ['./src/app.ts'],
  bundle: true,
  outfile: './static/bundle-microunivers.js',
  /*minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true*/
}).catch(() => process.exit(1))