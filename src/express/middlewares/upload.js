'use strict';

const path = require('path');

const multer = require('multer');
const {nanoid} = require('nanoid');

const UPLOAD_DIR = '../upload/img/';
const FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);


const fileFilter = (req, file, cb) => {
  const acceptFile = FILE_TYPES.includes(file.mimetype);
  cb(null, acceptFile);
};

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split('.').pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage, fileFilter});

module.exports = upload;
