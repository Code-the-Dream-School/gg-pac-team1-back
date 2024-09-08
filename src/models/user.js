const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); //para generar token resetpassword, security credit cars

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please insert name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please insert email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please insert valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please insert password"],
    minlength: 6,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 15,
    match: [/^\+?[0-9\s\-()]+$/, "Please insert a valid phone number"],
  },
  address: {
    type: String,
  },
  /* creditCards: [
    {
      number: {
        type: String,
        required: true,
      },

      expirationDate: {
        type: Date,
        required: true,
      },
      cvv: {
        type: String,
        required: true,
      },
    },
  ],*/
  // En lugar de guardar datos sensibles de tarjeta, se guarda un token de tarjeta
  paymentMethods: [
    {
      stripePaymentMethodId: {
        type: String,
        required: true,
        unique: true,
      },
    },
  ],
  resetPasswordToken: String, // Token restablecer password
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
/*<---------- IF We using JWTs in this project--------->>>> */
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

// Genera un token resetpassword
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashear el token y establecer resetPasswordToken y resetPasswordExpire
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; //1h

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
