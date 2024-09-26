const { Story } = require('../models/Story');

const fetchAllStories = async () => {
  const result = await Story.find({}).select('-__v').lean().exec();
  if (result.length) return result;
  return [];
};

const fetchStories = async (refinementId) => {
  const result = await Story.find({ refinementId }).select('-__v').lean().exec();
  if (result.length) return result;
  return [];
};

const updateStory = (story) => {
  return Story.findOneAndUpdate({ id: story.id }, { $set: { ...story } }, { upsert: true, new: true })
    .select('-__v')
    .lean()
    .exec();
};

const deleteStory = async (id) => {
  await Story.deleteOne({ id });
};

module.exports = { fetchAllStories, updateStory, fetchStories, deleteStory };
