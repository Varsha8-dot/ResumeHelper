const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Custom storage engine — works on all versions
const cloudinaryStorage = {
  _handleFile(req, file, cb) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resumehelper/resumes',
        resource_type: 'raw',
        allowed_formats: ['pdf', 'docx', 'doc'],
      },
      (error, result) => {
        if (error) return cb(error);
        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
        });
      }
    );
    file.stream.pipe(uploadStream);
  },
  _removeFile(req, file, cb) {
    cloudinary.uploader.destroy(file.filename, { resource_type: 'raw' }, cb);
  },
};

const upload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

module.exports = { cloudinary, upload };
