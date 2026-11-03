const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModal = require("../modals/user.js");

const { StatusCodes } = require("http-status-codes");

const registrationController = async (req, res) => {
  const { userName, email, password, role, status } = req.body;

  console.log(userName, email, password, role, status);

  if (password) {
    var hashPassword = bcrypt.hashSync(password, 10);
  }
  const user = await userModal.create({
    userName,
    email,
    password: hashPassword,
    role,
    status,
  });
  if (user) {
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "user created successfully",
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "user created failed",
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModal.findOne({ email }).select("+password");

  if (user) {
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (isPasswordMatch) {
      const token = jwt.sign(
        {
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.status(StatusCodes.OK).json({
        success: true,
        message: "user login successfully",
        data: {
          user: user,
          token: token,
        },
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid password",
      });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid Credential",
    });
  }
};

const getUserController = async (req, res) => {
  const user = req.user;

  if (user) {
    const userData = await userModal.findOne({ email: user.email });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "user fetched successfully",
      data: {
        user: userData,
      },
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "User not found",
    });
  }
};

module.exports = { registrationController, loginController, getUserController };
