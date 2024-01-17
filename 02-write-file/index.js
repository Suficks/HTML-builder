const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

let dataText = '';

const rl = readline.createInterface({
  input: process.stdin,
});

const setFinalMessage = () => {
  console.log('Goodbye! Have a good day!');
  process.exit();
};

fs.appendFile(path.join(__dirname, '02-write-file.txt'), '', (err) => {
  if (err) throw err;
});

stdout.write('Write your text\n');
stdin.on('data', (data) => {
  dataText += data.toString();
  fs.writeFile(path.join(__dirname, '02-write-file.txt'), dataText, (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', setFinalMessage);
rl.on('line', (line) => {
  if (line === 'exit') setFinalMessage();
});
