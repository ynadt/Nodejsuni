const fs = require('fs').promises;

/**
 * Write data to JSON file asynchronously.
 * @param {any} data
 * @param {string} filePath
 * @returns {Promise<void>}
 */
async function saveToJSON(data, filePath) {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json, 'utf8');
}

/**
 * Read JSON file asynchronously or return null if file does not exist.
 * @param {string} filePath
 * @returns {Promise<any|null>}
 */
async function loadJSON(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

module.exports = { saveToJSON, loadJSON };
