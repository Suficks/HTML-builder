const fs = require('fs').promises;
const path = require('path');

const mergeStyles = async (source, destination) => {
  let combinedStyles = '';

  try {
    await fs.access(source, fs.constants.F_OK);
    const files = await fs.readdir(source);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    for (const file of cssFiles) {
      const data = await fs.readFile(path.join(source, file), 'utf-8');
      combinedStyles += data;
    }

    await fs.writeFile(path.join(destination, 'bundle.css'), combinedStyles);
  } catch {
    await fs.writeFile(path.join(destination, 'bundle.css'), '');
  }
};

const sourceDir = path.join(__dirname, 'styles');
const destinationDir = path.join(__dirname, 'project-dist');

mergeStyles(sourceDir, destinationDir);
