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

    totalRequested: [
      {
        _id: {
          type: String,
        },
        name: {
          type: String,
        },
        amountRequested: {
          type: Number,
        },
        unit: {
          type: [String],
        },
      },
    ],
    balanceAllowable: [
      {
        _id: {
          type: String,
        },
        Value: {
          type: Number,
        },
      },
    ],
    materials: [
      {
        elementName: {
          type: String,
        },
        materialName: {
          type: String,
        },
        materialDetail: {
          type: String,
        },
        materialType: {
          type: String,
        },
        categoryName: {
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
        groupByFirstProp: {
          type: Boolean,
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
            unit: {
              type: [String],
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

async function updateAmountAllowed(schedule) {
  const totalRequested = schedule.totalRequested;
  schedule.application = schedule.application.map((app) => {
    app.items = app.items.map((item) => {
      let amountAllowed = 0;
      schedule.summary.forEach((s) => {
        if (item.item == s._id) {
          totalRequested.forEach((tr) => {
            if (item.item === tr._id) {
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
  await schedule.save();
}

scheduleSchema.post("updateOne", async function (doc, next) {
  if (this._update.$set.summary || this._update.$set.totalRequested) {
    const schedule = await mongoose
      .model("Schedule")
      .findById(this._conditions._id);
    await updateAmountAllowed(schedule);
  }
  next();
});

scheduleSchema.post("findOneAndUpdate", async function (doc, next) {
  if (this._update.$set.summary || this._update.$set.totalRequested) {
    const schedule = await mongoose
      .model("Schedule")
      .findById(this._conditions._id);
    await updateAmountAllowed(schedule);
  }
  next();
});

scheduleSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "scheduleNums",
  start_seq: 100,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
