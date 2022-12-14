const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img_compress");
  },
  filename: (req, file, cb) => {
    const fileNameNew = Date.now() + "_" + file.originalname;
    cb(null, fileNameNew);
  },
});
const upload = multer({ storage });

module.exports = upload;
