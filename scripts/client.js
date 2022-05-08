require('esbuild').build({
    entryPoints: ['./src/client/app.ts'],
    bundle: true,
    outfile: './src/client/static/bundle-microunivers.js',
    watch: {
        onRebuild(error, result) {
            if (error) console.error('> Rebuild failed :(', error)
            else console.log('> Rebuild succeeded !')
        },
    }
}).then(result => {
    console.log("> Client build success !");
}).catch((error) => {
    console.log("> Client build failed :(");
    process.exit(1);
})