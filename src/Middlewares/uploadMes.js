const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("req",req);
    console.log("file",file);
    cb(null, "./public/img_mes");
  },
  filename: (req, file, cb) => {
    const fileNameNew = Date.now() + "_" + file.originalname;
    cb(null, fileNameNew);
  },
});
const upload1 = multer({ storage });

module.exports = upload1;
