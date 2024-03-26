// multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

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
  console.log(req)
  if (!req.files || req.files.length === 0) {
      return next();
  }

  // Create an array to store modified files
  const modifiedFiles = [];

  // Iterate through each uploaded file
  req.files.forEach((file) => {
      // Resize and convert to WebP using sharp
      const inputFile = file.path;
      const imageId = uuidv4();
      const relativePath = imageId + '.webp';
      const outputFile = path.join(uploadFolder, moment().format('YYYY-MM-DD'), relativePath);

      sharp(inputFile)
          .resize({ width: 800, height: 600 })
          .toFormat('webp')
          .toFile(outputFile, (err) => {
              if (err) {
                  return next(err);
              }

              // Remove the original uploaded file
              fs.unlinkSync(inputFile);

              // Update the request file path to the WebP version with a relative path
              file.path = path.join(moment().format('YYYY-MM-DD'), relativePath);

              // Push the modified file to the array
              modifiedFiles.push(file);

              // If all files have been processed, replace req.files with modifiedFiles
              if (modifiedFiles.length === req.files.length) {
                  req.files = modifiedFiles;
                  next();
              }
          });
  });
};

module.exports = { upload, uploadMiddleware };
