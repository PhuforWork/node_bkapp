const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img_mes");
  },
  filename: (req, file, cb) => {
    const fileNameNew = Date.now() + "_" + req.file.originalname;
    cb(null, fileNameNew);
  },
});
const upload1 = multer({ storage });

module.exports = upload1;
