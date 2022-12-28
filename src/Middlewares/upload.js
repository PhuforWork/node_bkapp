const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(cb);
    cb(null, "./public/img");
  },
  filename: (req, file, cb) => {
    const fileNameNew = Date.now() + "_" + file.originalname;
    cb(null, fileNameNew);
  },
});
const upload = multer({ storage });

module.exports = upload;
