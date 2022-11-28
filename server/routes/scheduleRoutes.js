const express = require("express");
const router = express.Router();
const schedulesController = require("../controllers/schedulesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(schedulesController.getAllSchedules)
  .post(schedulesController.createNewSchedule)

  .patch(schedulesController.updateSchedule)
  .delete(schedulesController.deleteSchedule);

module.exports = router;
