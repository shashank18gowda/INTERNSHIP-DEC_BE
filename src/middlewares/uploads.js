import multer from "multer";

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );

    cb(null, uniqueSuffix + ext);
  },
});

const limit = 2 * 1024 * 1024; //2mb validation

const fileFilter = (req, file, cb) => {
  if (
    !file.mimetype.includes("jpeg") &&
    !file.mimetype.includes("jpg") &&
    !file.mimetype.includes("png")
  ) {
    return cb(
      null,
      false,
      new Error("Only image with JPEG,PNG,JPG formats allowed")
    );
  }
  cb(null, true);
};

const image = multer({
  storage: storage,
  limit: limit,
  fileFilter: fileFilter,
});

export default image;
