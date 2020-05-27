exports.homepage = (req, res) => {
  console.log(req.name);

  res.render('index');
};
