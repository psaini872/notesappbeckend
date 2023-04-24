import Notes from "../models/notes.js";

const postNote = async (req, res) => {
  req.body.addedby = req.user._id;
  const newNote = await Notes.create(req.body);
  res.status(200).json(newNote);
};

const getNotes = async (req, res) => {
  // Pagination
  const page = req.query.page * 1;
  const limit = 5;
  var skip = (page - 1) * limit;

  const nnotes = await Notes.countDocuments({ addedby: req.user._id });

  if (skip >= nnotes) {
    skip = skip - limit;
  }
  const usernote = await Notes.find({ addedby: req.user._id })
    .limit(limit)
    .skip(skip)
    .exec();
  res.status(200).json(usernote);
};

const deleteNote = async (req, res) => {
  await Notes.deleteOne({ _id: req.params.id });
  res.status(200).json({ data: "success" });
};

export { postNote, getNotes, deleteNote };
