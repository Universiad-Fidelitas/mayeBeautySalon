// multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const sharp = require('sharp');

// Determine the path to the uploads folder
const uploadFolder = path.join(__dirname, '..', 'uploads');

// Create the uploads folder if it doesn't exist
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const todayFolder = path.join(uploadFolder, moment().format('YYYY-MM-DD'));

    // Create the day folder if it doesn't exist
    if (!fs.existsSync(todayFolder)) {
      fs.mkdirSync(todayFolder);
    }

    cb(null, todayFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + moment().format('YYYY-MM-DD-HHmmss') + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware for processing uploaded files
const uploadMiddleware = (req, res, next) => {
    if (!req.file) {
      return next();
    }
  
    // Resize and convert to WebP using sharp
    const inputFile = req.file.path;
    const relativePath = moment().format('YYYY-MM-DD-HHmmss') + '.webp'; // Relative path
    const outputFile = path.join(uploadFolder, relativePath);
  
    sharp(inputFile)
      .resize({ width: 300, height: 300 })
      .toFormat('webp')
      .toFile(outputFile, (err) => {
        if (err) {
          return next(err);
        }
  
        // Remove the original uploaded file
        //fs.unlinkSync(inputFile);
  
        // Update the request file path to the WebP version with a relative path
        req.file.path = 'uploads/' + relativePath;
  
        next();
      });
  };

module.exports = { upload, uploadMiddleware };
