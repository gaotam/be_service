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

module.exports = { uploadAvatar };
