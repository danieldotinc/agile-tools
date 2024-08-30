const { fetchRefinements } = require('../repository/refinement');
const { fetchPreRefinement } = require('../repository/pre-refinement');

module.exports = async (connected) => {
  const refinements = await fetchRefinements();
  const preRefinement = await fetchPreRefinement();
  return { ...connected, data: { refinements, preRefinement } };
};
