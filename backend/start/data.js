const { fetchRefinements } = require('../repository');

module.exports = async (connected) => {
  const refinements = await fetchRefinements();
  return { ...connected, data: refinements };
};
