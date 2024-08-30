const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const preStorySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    comments: {
      type: [String],
      default: [],
    },
    team: {
      type: String,
    },
    link: {
      type: String,
    },
    assigned: {
      type: String,
    },
  },
  { minimize: false }
);

const preRefinementSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    teams: {
      type: Map,
      of: [preStorySchema],
      default: {},
    },
  },
  { minimize: false }
);

const PreRefinement = mongoose.model('PreRefinement', preRefinementSchema);

module.exports = PreRefinement;
