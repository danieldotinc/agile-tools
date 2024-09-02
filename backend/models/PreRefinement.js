const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { storySchema } = require('./Story');

const preRefinementSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    teams: {
      type: Map,
      of: [storySchema],
      default: {},
    },
  },
  { minimize: false }
);

const PreRefinement = mongoose.model('PreRefinement', preRefinementSchema);

module.exports = PreRefinement;
