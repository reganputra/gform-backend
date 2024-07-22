import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import emailExists from "../libraries/emailExists.js";
import isEmailValid from "../libraries/isEmailValid.js";

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

const generateRefreshToken = async (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

class AuthController {
  async register(req, res) {
    try {
      // Validate the required fields
      if (!req.body.fullname) {
        throw { code: 400, message: "FULLNAME_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_REQUIRED" };
      }
      if (req.body.password.length < 6) {
        throw { code: 400, message: "PASSWORD_MINIMUM_6_CHARACTER" };
      }
      if(!isEmailValid(req.body.email)){ throw{ code: 400, message: "Invalid_Email"}}

      // Check if the email already exists
      const isEmailExists = await emailExists(req.body.email);
      if (isEmailExists) {
        throw { code: 409, message: "EMAIL_ALREADY_EXISTS" };
      }

      // Hashing password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });

      if (!user) {
        throw { code: 500, message: "USER_REGISTER_FAILED" };
      }

      // Return success response
      return res
        .status(200)
        .json({ status: true, message: "USER_REGISTER_SUCCESS", user });
    } catch (error) {
      // Handle errors
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_REQUIRED" };
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 500, message: "USER_NOT_FOUND" };
      }

      const isPasswordValid = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw { code: 400, message: "INVALID_PASSWORD" };
      }

      let payload = { id: user._id };

      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "USER_LOGIN_SUCCESS",
        fullname: user.fullname,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw { code: 400, message: "Refresh token is required" };
      }

      const verify = await jwt.verify(
        req.body.refreshToken,
        env.JWT_REFRESH_TOKEN_SECRET
      );

      let payload = { id: verify.id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "Refresh token is success",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error.message == "jwt expired") {
        error.message = "refresh token is expired";
      } else if (
        error.message == "invalid signature" ||
        error.message == "jwt malformed" ||
        error.message == "jwt must be provided" ||
        error.message == "invalid token"
      ) {
        error.message = "invalid refresh token";
      }
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new AuthController();
