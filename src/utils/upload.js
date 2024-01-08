const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = crypto.randomBytes(20).toString("hex");
    cb(null, `${req.body.phone}_${uniqueSuffix}${ext}`);
  },
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = crypto.randomBytes(20).toString("hex");
    cb(null, `${req.user.phone}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
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

const updateFace = multer({
  storage: storage1,
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

const storageFace = multer.memoryStorage();
const uploadFace = multer({
  storage: storageFace,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    const extAllowed = [".png", ".jpg"];
    if (!extAllowed.includes(ext)) {
      return callback(new Error("Only support png and jpg image"));
    }
    callback(null, true);
  },
});

module.exports = { upload, uploadFace, updateFace };
