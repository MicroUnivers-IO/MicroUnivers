require('esbuild').build({
  entryPoints: ['./src/app.ts'],
  bundle: true,
  outdir: './dist'
}).catch(() => process.exit(1))