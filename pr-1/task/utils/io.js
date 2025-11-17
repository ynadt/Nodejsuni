const fs = require('fs');

/**
 * Write data to JSON file.
 * @param {any} data
 * @param {string} filePath
 */
function saveToJSON(data, filePath) {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, json, 'utf8');
}

/**
 * Read JSON or return null if file does not exist.
 * @param {string} filePath
 * @returns {any|null}
 */
function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

module.exports = { saveToJSON, loadJSON };
