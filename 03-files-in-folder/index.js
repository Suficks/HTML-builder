const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'secret-folder');

fs.readdir(filePath, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    fs.stat(path.join(filePath, file.name), (err, stats) => {
      if (stats.isFile()) {
        const name = path.basename(file.name, path.extname(file.name));
        const extname = path.extname(file.name).slice(1);
        const size = `${stats.size / 1000}kb`;
        console.log(`${name} - ${extname} - ${size}`);
      }
    });
  });
});
