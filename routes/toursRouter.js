const express = require("express");
const {
  getAllTours,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
  aliasTopTours,
} = require("../controllers/toursControllers");

const router = express.Router();

router.route("/top-tours").get(aliasTopTours, getAllTours);

router.route("/").get(getAllTours).post(createNewTour);

router
  .route("/:id")
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

module.exports = router;
