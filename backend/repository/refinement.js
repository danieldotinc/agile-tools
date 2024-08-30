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

const deleteRefinement = async (id) => {
  console.log('deleting refinement...');
  await Refinement.deleteOne({ id });
};

const updateUsers = async (refinements) => {
  console.log('updating users...');
  for (const refinement of refinements) {
    await Refinement.updateOne({ id: refinement.id }, { $set: { users: [...refinement.users] } }, { upsert: true });
  }
};

module.exports = { updateUsers, deleteRefinement, updateRefinement, fetchRefinements };
