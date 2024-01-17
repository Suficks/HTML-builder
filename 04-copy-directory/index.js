const fs = require('fs');
const path = require('path');

const copyDir = (source, destination) => {
  fs.mkdir(destination, { recursive: true }, () => {});

  fs?.readdir(destination, (err, files) => {
    files.forEach((file) => {
      const copyFilePath = path.join(destination, file);
      fs.unlink(copyFilePath, () => {});
    });
  });

  fs.readdir(source, (err, files) => {
    files.forEach((file) => {
      const filePath = path.join(source, file);
      const copyFilePath = path.join(destination, file);

      fs.copyFile(
        filePath,
        copyFilePath,
        fs.constants.COPYFILE_FICLONE,
        (err) => {
          if (err) throw err;
        },
      );
    });
  });
};

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, destinationDir);
