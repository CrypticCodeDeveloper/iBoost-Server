
const renderIndex = (req, res) => {

    const user = req.user

  res.render('index', {
    username: user.username,
  });
}



module.exports = {
    renderIndex
}