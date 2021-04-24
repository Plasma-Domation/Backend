const OTP = require('../models/otpModel');

const RequireLogin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      res.status(401).send('Unauthenticated');
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send('Unauthenticated');
  }
};

const DestroySession = async (req, res, next) => {
  if (req.session) {
    await req.session.destroy();
    next();
  } else {
    next();
  }
};

const verifyotp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const obj = await OTP.findOne({ email });
    if (!obj) {
      return res.status(400).send('otp unverifed');
    } else {
      if (obj.otp != otp) {
        return res.status(400).send('otp unverifed');
      } else {
        obj.delete();
        next();
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

module.exports = { RequireLogin, verifyotp, DestroySession };
