const Schedule = require("../models/Schedule");
const User = require("../models/User");

// @desc Get all schedules
// @route GET /schedules
// @access Private
const getAllSchedules = async (req, res) => {
  // Get all notes from MongoDB
  const schedules = await Schedule.find().lean();

  // If no notes
  if (!schedules?.length) {
    return res.status(400).json({ message: "No schedules found" });
  }

  // Add username to each schedule before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const schedulesWithUser = await Promise.all(
    schedules.map(async (schedule) => {
      const user = await User.findById(schedule.user).lean().exec();
      return { ...schedule, username: user.username };
    })
  );

  res.json(schedulesWithUser);
};

// @desc Create new schedule
// @route POST /schedules
// @access Private
const createNewSchedule = async (req, res) => {
  const { user, title, description } = req.body;
  console.log(title);
  // Confirm data
  if (!user || !title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Schedule.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Schedule title" });
  }

  // Create and store the new user
  const schedule = await Schedule.create({ user, title });

  if (schedule) {
    // Created
    return res.status(201).json({ message: "New schedule created" });
  } else {
    return res.status(400).json({ message: "Invalid schedule data received" });
  }
};

// @desc Update a schedule
// @route PATCH /schedules
// @access Private
const updateSchedule = async (req, res) => {
  const { id, user, title } = req.body;

  // Confirm data
  if (!id || !user || !title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm schedule exists to update
  const schedule = await Schedule.findById(id).exec();

  if (!schedule) {
    return res.status(400).json({ message: "Schedule not found" });
  }

  // Check for duplicate title
  const duplicate = await Schedule.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Schedule title" });
  }

  schedule.user = user;
  schedule.title = title;

  const updatedSchedule = await schedule.save();

  res.json(`'${updatedSchedule.title}' updated`);
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteSchedule = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Schedule ID required" });
  }

  // Confirm note exists to delete
  const schedule = await Note.findById(id).exec();

  if (!schedule) {
    return res.status(400).json({ message: "Schedule not found" });
  }

  const result = await schedule.deleteOne();

  const reply = `Schedule '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllSchedules,
  createNewSchedule,
  updateSchedule,
  deleteSchedule,
};
