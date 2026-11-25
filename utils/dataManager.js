
const fs = require("fs").promises;
const path = require("path");

// Read data from a JSON file
async function readData(fileName) {
  const filePath = path.join(__dirname, "../data", fileName);

  const data = await fs.readFile(filePath, "utf-8");

  return JSON.parse(data);
}

// Write data into a JSON file
async function writeData(fileName, data) {
  const filePath = path.join(__dirname, "../data", fileName);

  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  readData,
  writeData,
};
