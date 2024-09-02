const { Story } = require('../models/Story');

const fetchAllStories = async () => {
  console.log('fetching all stories...');
  const result = await Story.find({}).select('-__v').lean().exec();
  if (result.length) return result;
  return [];
};

const fetchStories = async (refinementId) => {
  console.log('fetching stories for refinement: ', refinementId);
  const result = await Story.find({ refinementId }).select('-__v').lean().exec();
  if (result.length) return result;
  return [];
};

const updateStory = (story) => {
  console.log('updating story: ', story.name);
  return Story.findOneAndUpdate({ id: story.id }, { $set: { ...story } }, { upsert: true, new: true })
    .select('-__v')
    .lean()
    .exec();
};

const deleteStory = async (id) => {
  console.log('deleting story:', id);
  await Story.deleteOne({ id });
};

module.exports = { fetchAllStories, updateStory, fetchStories, deleteStory };
