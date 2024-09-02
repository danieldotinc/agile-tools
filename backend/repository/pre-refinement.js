const PreRefinement = require('../models/PreRefinement');

const fetchPreRefinement = async () => {
  const result = await PreRefinement.findOne({}).select('-__v').lean().exec();
  if (result) return result;
};

const updatePreRefinement = async (preRef) => {
  await PreRefinement.updateOne({ id: preRef.id }, { $set: { teams: { ...preRef.teams } } }, { upsert: true });
};

module.exports = { fetchPreRefinement, updatePreRefinement };
