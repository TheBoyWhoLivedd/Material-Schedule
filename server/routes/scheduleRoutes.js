const express = require("express");
const router = express.Router();
const schedulesController = require("../controllers/schedulesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(schedulesController.getAllSchedules)
  .post(schedulesController.createNewSchedule);

router
  .route("/:scheduleId")
  .patch(schedulesController.updateSchedule)
  .get(schedulesController.getScheduleDetails)
  .delete(schedulesController.deleteSchedule);

// Materials routes
router
  .route("/:scheduleId/materials")
  .post(schedulesController.addScheduleMaterial);
router
  .route("/:scheduleId/materials/:materialId")
  .delete(schedulesController.deleteScheduleMaterial)
  .patch(schedulesController.updateScheduleMaterial);
module.exports = router;

//summary route
router.route("/:scheduleId/summary").get(schedulesController.getSummary);
//Deduction routes
router
  .route("/:scheduleId/application")
  .post(schedulesController.postApplication);
