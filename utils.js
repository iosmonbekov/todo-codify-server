const fs = require('fs');

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) reject(error);
      resolve(JSON.parse(data));
    })
  })
}

function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (error) => {
      if (error) reject(error);
      resolve(JSON.parse(content));
    })
  })
}

module.exports = {readFile, writeFile}