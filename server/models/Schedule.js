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

    summary: [
      {
        _id: {
          type: String,
        },
        Value: {
          type: Number,
        },
        name: {
          type: String,
        },
        unit: {
          type: [String],
        },
        details: [
          {
            materialDescription: {
              type: String,
            },
            computedValue: {
              type: Number,
            },
          },
        ],
      },
    ],

    totalRequested: [],
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
        date: {
          type: Date,
        },
        items: [
          {
            item: {
              type: String,
            },
            supplier: {
              type: String,
            },
            amountRequested: {
              type: String,
            },
            amountAllowed: {
              type: String,
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

scheduleSchema.post("updateOne", function (doc, next) {
  // Check if the summary array was updated
  if (this._update.$set.summary) {
    // Retrieve the updated summary array
    const summary = this._update.$set.summary;
    console.log(summary);

    // Find the schedule document
    mongoose
      .model("Schedule")
      .findById(this._conditions._id)
      .then((schedule) => {
        // Recalculate the amountAllowed value for each item in all application objects
        schedule.application = schedule.application.map((app) => {
          app.items = app.items.map((item) => {
            let amountAllowed = 0;
            schedule.summary.forEach((s) => {
              if (item.item == s._id) {
                schedule.totalRequested.forEach((tr) => {
                  if (item.item === tr._id) {
                    console.log(s.Value, tr.amountRequested);
                    amountAllowed = s.Value - Number(tr.amountRequested);
                  }
                });
              }
            });
            return {
              ...item,
              amountAllowed,
            };
          });
          return app;
        });

        // Save the updated schedule document
        schedule.save().then(() => {
          // Call the next function with no arguments
          next();
        });
      });
  } else {
    // Call the next function with no arguments
    next();
  }
});

scheduleSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "scheduleNums",
  start_seq: 100,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
