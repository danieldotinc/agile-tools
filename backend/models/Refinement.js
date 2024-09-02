const mongoose = require('mongoose');
const { storySchema } = require('./Story');

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
      type: [storySchema],
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
