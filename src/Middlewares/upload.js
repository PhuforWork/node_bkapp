const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,"./public/images"));
  },
  filename: (req, file, cb) => {
    const fileNameNew = Date.now() + "_" + path.extname(file.originalname);
    cb(null, fileNameNew);
  },
});
const upload = multer({ storage });

module.exports = upload;
