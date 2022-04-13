require('esbuild').build({
    entryPoints: ['./src/client/app.ts'],
    bundle: true,
    outfile: './src/client/static/bundle-microunivers.js',
}).then(result => {
    console.log("Client build success");
}).catch(() => {
    console.log("Client build failed");
    process.exit(1);
})