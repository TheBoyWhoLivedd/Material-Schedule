const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ScheduleTitle: {
      type: String,
      required: true,
      materials: [
        {
          materialName: {
            type: String,
            required: true,
          },
          materialDescription: {
            type: String,
            required: true,
          },
          computedValue: {
            type: Number,
          },
          parameters: [],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});

module.exports = mongoose.model("Note", noteSchema);
