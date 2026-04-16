const multer = require("multer");

// store in memory (for base64 conversion)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;