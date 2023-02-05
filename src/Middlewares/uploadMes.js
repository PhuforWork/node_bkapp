const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, "./public/img_mes");
    }else{
      cb(null, "./public/file_mes");
    }
  },
  filename: (req, file, cb) => {
    const fileNameNew = Date.now() + "_" + file.originalname;
    cb(null, fileNameNew);
  },
});
const upload1 = multer({ storage });

module.exports = upload1;
