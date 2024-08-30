const PreRefinement = require('../models/PreRefinement');

const fetchPreRefinement = async () => {
  const result = await PreRefinement.findOne({});
  if (result) return result;
};

const updatePreRefinement = async (teams) => {
  console.log('updating pre-refinement...');
  await PreRefinement.updateOne({}, { $set: { teams: { ...teams } } }, { upsert: true });
};

module.exports = { fetchPreRefinement, updatePreRefinement };
