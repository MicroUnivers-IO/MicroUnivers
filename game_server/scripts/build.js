const target = "./dist";
const entryPoints = require("./entryPoints");

require("esbuild").buildSync({
  entryPoints,
  bundle: true,
  outdir: target,
  minify: true,
  platform: 'node'
});

