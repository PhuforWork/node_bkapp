const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"/"+"./var/www/src_be_booking/node_bkapp/public/images");
  },
  filename: (req, file, cb) => {
    const fileNameNew = Date.now() + "_" + file.originalname;
    cb(null, fileNameNew);
  },
});
const upload = multer({storage});

module.exports = upload;
