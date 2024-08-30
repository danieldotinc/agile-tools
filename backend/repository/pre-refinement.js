const PreRefinement = require('../models/PreRefinement');

const fetchPreRefinement = async () => {
  const result = await PreRefinement.findOne({});
  if (result) return result;
};

const updatePreRefinement = async (preRef) => {
  console.log('updating pre-refinement...');
  await PreRefinement.updateOne({ id: preRef.id }, { $set: { teams: { ...preRef.teams } } }, { upsert: true });
};

module.exports = { fetchPreRefinement, updatePreRefinement };
