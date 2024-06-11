const Refinement = require('../models/Refinement');

const fetchRefinements = async () => {
  const result = await Refinement.find({});
  if (result.length) return result;
  return [];
};

const updateRefinement = async (refinement) => {
  console.log('updating refinement...');
  await Refinement.updateOne({ id: refinement.id }, { $set: { ...refinement } }, { upsert: true });
};

module.exports = { fetchRefinements, updateRefinement };
