var mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    userinfo: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

userSchema.pre("save",async function(req,res,next){
    const unhashedPassword = this.password
    const hashedPassword = await bcrypt.hash(unhashedPassword,12)
    this.password = hashedPassword
    next()
})

module.exports = mongoose.model("User", userSchema);
