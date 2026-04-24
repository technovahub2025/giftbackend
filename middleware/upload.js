const multer = require("multer");
const path = require("path");

// Optimized memory storage with file size limits
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only image files
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for better performance
    files: 1 // Limit to 1 file per request
  },
  fileFilter
});

module.exports = upload;