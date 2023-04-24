import mongoose from "mongoose";
const note = mongoose.Schema({
  addedby: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: [true, "Please provide user"],
  },
  title: {
    type: String,
    required: [true, "Please provide title"],
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
});
export default mongoose.model("Notes", note);
