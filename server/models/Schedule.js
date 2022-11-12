const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const scheduleSchema = new mongoose.Schema(
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
                    },
                    materialDescription: {
                        type: String,
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

scheduleSchema.plugin(AutoIncrement, {
    inc_field: "ticket",
    id: "scheduleNums",
    start_seq: 100,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
