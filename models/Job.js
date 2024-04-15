const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please, provide company"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please, provide company"],
      maxLength: 100,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["interview", "declined", "pending"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
