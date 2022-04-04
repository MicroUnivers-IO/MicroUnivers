const target = "./dist";
const uws_target = 'uws_' + process.platform + '_' + process.arch + '_' + process.versions.modules + '.node';
const fs = require("fs");

try {
    fs.copyFileSync("./node_modules/uWebSockets.js/" + uws_target, "./dist/" + uws_target, fs.constants.COPYFILE_EXCL);
} catch (e) {} // On fait rien si le fichier existe déjà

fs.readdir(target, (err, files) => {
    files.forEach((file) => {;
        if (file.endsWith(".node") && !uws_target.includes(file))
            fs.unlinkSync("./dist/" + file);
    });
});





