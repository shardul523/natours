const { catchAsync } = require("../utils");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        message: "Deletion successful",
      },
    });
  });
