const fs = require('fs');
const path = require('path');

const copyDir = async (source, destination) => {
  await fs.promises.rm(destination, { force: true, recursive: true });
  await fs.promises.mkdir(destination, { recursive: true });
  const files = await fs.promises.readdir(
    source,
    { withFileTypes: true },
    (_error, files) => {
      return files;
    },
  );
  files.forEach((file) => {
    fs.promises.copyFile(
      path.join(source, file.name),
      path.join(destination, file.name),
    );
  });
};

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, destinationDir);
