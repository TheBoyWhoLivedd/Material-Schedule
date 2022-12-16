const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      // required: true,
    },
    contractor: {
      type: String,
      // required: true,
    },
    funder: {
      type: String,
      // required: true,
    },
    program: {
      type: String,
      // required: true,
    },
    tin: {
      type: Number,
      // required: true,
    },

    summary: [],
    materials: [
      {
        elementName: {
          type: String,
        },
        materialName: {
          type: String,
        },
        materialType: {
          type: String,
        },
        materialDescription: {
          type: String,
        },
        computedValue: {
          type: Number,
        },
        unit: {
          type: String,
        },
        relatedId: {
          type: String,
        },
        parameters: {},
      },
    ],
    application: [
      {
        supplierName: {
          type: String,
        },
        amounts: [
          {
            itemRequested: {
              type: String,
            },
            amountRequested: {
              type: Number,
            },
            amountAllowed: {
              type: Number,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

scheduleSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "scheduleNums",
  start_seq: 100,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
