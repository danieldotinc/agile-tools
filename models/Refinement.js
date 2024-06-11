const mongoose = require('mongoose');

const refinementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    users: {
      type: [
        {
          id: { type: String, required: true },
          username: { type: String, required: true },
        },
      ],
      default: [],
    },
    stories: {
      type: [
        {
          link: { type: String },
          votes: { type: Object, default: {} },
          name: { type: String, required: true },
          revealed: { type: Boolean, default: false },
          result: { type: Number, default: null },
        },
      ],
      default: [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  { minimize: false }
);

const RefinementModel = mongoose.model('Refinement', refinementSchema);

module.exports = RefinementModel;
