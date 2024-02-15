exports.getAllUsers = (req, res) => {
  res.send("Sent all Users");
};

exports.createNewUser = (req, res) => {
  res.send("New User created");
};

exports.getUserById = (req, res) => {
  res.send(`Received user with id ${req.params.id}`);
};

exports.updateUserById = (req, res) => {
  res.send(`Updated user with id ${req.params.id}`);
};

exports.deleteUserById = (req, res) => {
  res.send(`Deleted user with id ${req.params.id}`);
};
