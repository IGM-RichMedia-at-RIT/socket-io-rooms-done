const hostIndex = (req, res) => {
  res.render('index');

  //Database Request
  //Add that to page with render
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  notFound,
};
