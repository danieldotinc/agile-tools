const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const storySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    refinementId: {
      type: String,
      default: '',
    },
    comments: {
      type: [String],
      default: [],
    },
    team: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    assigned: {
      type: String,
      default: '',
    },
    votes: {
      type: Map,
      default: {},
    },
    revealed: {
      type: Boolean,
      default: false,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { minimize: false }
);

const Story = mongoose.model('Story', storySchema);

module.exports = { Story, storySchema };
