const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

//Disk Storage (we set the file name and path to store the images)
const storage = multer.diskStorage({
  //set the path
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  //set the random name
  filename: function (req, file, cb) {
    crypto.randomBytes(10, (err, name) => {
      const fn = name.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({ storage: storage });

//export the uplaod variable
module.exports = upload;
