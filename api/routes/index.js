const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const placeController = require("../controllers/placeController");
const bookingController = require("../controllers/bookingController");
const OtpController = require("../controllers/otpController");
const Place = require("../models/Place");
const imageDownload = require("image-downloader");
const multer = require("multer");
const mime = require("mime-types");
const uploadToS3 = require("../utils/uploadToS3");

router.use("/user", userController);
router.use("/place", placeController);
router.use("/booking", bookingController);
router.use("/otp", OtpController);

const photosMiddleware = multer({ dest: "/tmp" });

//route to get all places for index page
router.get("/places", async (req, res) => {
  try {
    const allPlaces = await Place.find();
    res.json(allPlaces);
  } catch (err) {
    res.json(err.message);
  }
});

//search result

router.get("/findPlaces/:placeName", async (req, res) => {
  try {
    const { placeName } = req.params;
    const place = await Place.find();
    const searchedPlace = place.filter((atomicPlace) => {
      add = atomicPlace.address.toLowerCase();
      if (add.indexOf(placeName) > -1) {
        return 1;
      }
    });
    res.status(200).json(searchedPlace);
  } catch (err) {
    console.log("err");
  }
});

router.post(
  "/upload",
  photosMiddleware.array("photos", 50),
  async (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname, mimetype } = req.files[i];
      const url = await uploadToS3(path, originalname, mimetype);
      uploadedFiles.push(url);
    }
    res.json(uploadedFiles);
  }
);

router.post("/upload_by_link", async (req, res) => {
  try {
    const { imgLink } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    await imageDownload.image({
      url: imgLink,
      dest: "/tmp/" + newName,
    });
    const url = await uploadToS3(
      "/tmp/" + newName,
      newName,
      mime.lookup("/tmp/" + newName)
    );
    res.json(url);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
