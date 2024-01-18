const fsPromise = require('fs').promises;
const fs = require('fs');
const path = require('path');

const sourceStyles = path.join(__dirname, 'styles');
const sourceAssets = path.join(__dirname, 'assets');
const sourceComponents = path.join(__dirname, 'components');
const sourceTemplate = path.join(__dirname, 'template.html');

const destinationDir = path.join(__dirname, 'project-dist');
const destinationAssets = path.join(destinationDir, 'assets');
const destinationComponents = path.join(destinationDir, 'index.html');
const destinationStyles = path.join(destinationDir, 'style.css');

fs.mkdir(destinationDir, { recursive: true }, (err) => err);

const mergeStyles = async () => {
  let combinedStyles = '';

  try {
    await fsPromise.access(sourceStyles, fsPromise.constants.F_OK);
    const files = await fsPromise.readdir(sourceStyles);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    for (const file of cssFiles) {
      const data = await fsPromise.readFile(
        path.join(sourceStyles, file),
        'utf-8',
      );
      combinedStyles += data;
    }

    await fsPromise.writeFile(destinationStyles, combinedStyles, (err) => err);
  } catch {
    await fsPromise.writeFile(destinationStyles, '', (err) => err);
  }
};

mergeStyles();

const copyDir = async (source, destination) => {
  await fsPromise.rm(destination, {
    recursive: true,
    force: true,
  });

  fs.mkdir(destination, { recursive: true }, (err) => err);

  fs.readdir(source, { withFileTypes: true }, (err, direct) => {
    for (let dir of direct) {
      let fromDir = path.join(source, dir.name);
      let toDir = path.join(destination, dir.name);

      if (dir.isFile()) {
        fs.copyFile(fromDir, toDir, (err) => err);
      } else if (!dir.isFile()) {
        fs.mkdir(toDir, { recursive: true }, (err) => err);
        copyDir(fromDir, toDir);
      }
    }
  });
};

copyDir(sourceAssets, destinationAssets);

const createHTML = async () => {
  const regex = /{{(.*?)}}/g;

  let data = await fsPromise.readFile(sourceTemplate, 'utf-8', (err) => err);
  const matches = data.match(regex);

  const files = await fsPromise.readdir(
    sourceComponents,
    { withFileTypes: true },
    (err) => err,
  );

  for (const file of files) {
    const name = path.basename(file.name, path.extname(file.name));
    const filePath = path.join(sourceComponents, file.name);

    const componentText = await fsPromise.readFile(
      filePath,
      'utf-8',
      (err) => err,
    );

    for (const match of matches) {
      if (match.slice(2, -2) === name) {
        data = data.replace(match, componentText);
      }
    }
  }

  await fsPromise.writeFile(destinationComponents, data, (err) => err);
};

createHTML();
