module.exports = (server) => {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${process.env.WEBSITE_URI}`);
  });
};
