const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/avatar");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = crypto.randomBytes(20).toString("hex");
    cb(null, `${req.body.email}_${uniqueSuffix}${ext}`);
  },
});

const uploadAvatar = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    const extAllowed = [".png", ".jpg", ".jpeg", ".heic"];
    if (!extAllowed.includes(ext)) {
      return callback(new Error("Only support .png, jpg, .jpeg, .heic image"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const storageThumbnail = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/thumbnail");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = crypto.randomBytes(20).toString("hex");
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const uploadThumbnail = multer({
  storage: storageThumbnail,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    const extAllowed = [".png", ".jpg", ".jpeg", ".heic"];
    if (!extAllowed.includes(ext)) {
      return callback(new Error("Only support .png, jpg, .jpeg, .heic image"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    switch(file.fieldname) {
      case "thumbnail":
        cb(null, "src/uploads/thumbnail");
        break;
      case "video":
        cb(null, "src/uploads/video");
        break;
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = crypto.randomBytes(20).toString("hex");
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const uploadVideo = multer({
  storage: storageVideo,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    const extImageAllowed = [".png", ".jpg", ".jpeg", ".heic"];
    const extVideoAllowed = [".mp4"];

    if (file.fieldname == "thumbnail" && !extImageAllowed.includes(ext)){
      return callback(new Error("Thumbnail only support .png, jpg, .jpeg, .heic image"));
    } 

    if (file.fieldname == "video" && !extVideoAllowed.includes(ext)){
      return callback(new Error("Video only support .mp4"));
    } 
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
});

module.exports = { uploadAvatar, uploadThumbnail, uploadVideo };
