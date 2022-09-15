const bcrypt = require("bcryptjs")
const usersCollection = require("../db").db().collection("users")
const validator = require("validator")

let User = function (data) {
  this.data = data
  this.errors = []
}
User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") this.data.username = ""
  if (typeof this.data.email != "string") this.data.email = ""
  if (typeof this.data.password != "string") this.data.password = ""

  // get rid of any bogus property
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  }
}

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.username == "") {
      this.errors.push("باید یک نام کاربری انتخاب کنید.")
    }
    if (
      this.data.username != "" &&
      !validator.isAlphanumeric(this.data.username, "en-US")
    ) {
      this.errors.push("نام کاربری فقط می تواند دارای حروف و اعداد باشد.")
    }
    if (!validator.isEmail(this.data.email)) {
      this.errors.push("باید یک ایمیل انتخاب کنید.")
    }
    if (this.data.password == "") {
      this.errors.push("باید یک کلمه عبور انتخاب کنید.")
    }
    if (this.data.password.length > 0 && this.data.password.length < 8) {
      this.errors.push("کلمه عبور باید حداقل 8 کاراکتر داشته باشد.")
    }
    if (this.data.password.length > 50) {
      this.errors.push("کلمه عبور نمی تواند بیش از ۵۰ کاراکتر باشد.")
    }
    if (this.data.username.length > 0 && this.data.username.length < 3) {
      this.errors.push("نام کاربری باید حداقل ۳ کاراکتر داشته باشد.")
    }
    if (this.data.username.length > 30) {
      this.errors.push("نام کاربری نمی تواند بیش از ۳۰ کاراکتر داشته باشد.")
    }

    // if user name is valid check to see if it's already taken
    if (
      this.data.username.length > 2 &&
      this.data.username.length < 31 &&
      validator.isAlphanumeric(this.data.username, "en-US")
    ) {
      let usernameExists = await usersCollection.findOne({
        username: this.data.username,
      })
      if (usernameExists)
        this.errors.push(
          "این نام کاربری قبلا انتخاب شده، یک نام کاربری دیگر انتخاب کنید."
        )
    }

    // if email is valid check to see if it's already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({
        email: this.data.email,
      })
      if (emailExists) this.errors.push("قبلا با این ایمیل ثبت نام کرده‌اید.")
    }
    resolve()
  })
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    usersCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          resolve("You Logged in . . .")
        } else {
          reject("  نام‌کاربری / کلمه‌ی عبور   اشتباه است.")
        }
      })
      .catch(function () {
        reject("try again later")
      })
  })
}

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // step #1: Validate user data
    this.cleanUp()
    await this.validate()
    // step #2: Only if there are no validation Errors
    // then save the user in an data base
    if (!this.errors.length) {
      let salt = bcrypt.genSaltSync(10)
      this.data.password = bcrypt.hashSync(this.data.password, salt)
      await usersCollection.insertOne(this.data)
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

module.exports = User
