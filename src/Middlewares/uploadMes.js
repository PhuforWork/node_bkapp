const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img_mes");
  },
  filename: (req, file, cb) => {
    console.log("1",req);
    console.log("2",file);
    const fileNameNew = Date.now() + "_" + req.file.originalname;
    cb(null, fileNameNew);
  },
});
const upload1 = multer({ storage });

module.exports = upload1;
