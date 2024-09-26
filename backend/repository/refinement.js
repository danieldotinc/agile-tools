const Refinement = require('../models/Refinement');

const fetchRefinements = async () => {
  const result = await Refinement.find({}).select('-__v').lean().exec();
  if (result.length) return result;
  return [];
};

const updateRefinement = async (refinement) => {
  await Refinement.updateOne({ id: refinement.id }, { $set: { ...refinement } }, { upsert: true });
};

const deleteRefinement = async (id) => {
  await Refinement.deleteOne({ id });
};

const updateUsers = async (refinements) => {
  for (const refinement of refinements) {
    await Refinement.updateOne({ id: refinement.id }, { $set: { users: [...refinement.users] } }, { upsert: true });
  }
};

module.exports = { updateUsers, deleteRefinement, updateRefinement, fetchRefinements };
