const bcrypt = require("bcryptjs")
const adminsCollection = require("../db").db().collection("admins")
const validator = require("validator")

let Admin = function (data) {
  this.data = data
  this.errors = []
}

Admin.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") this.data.username = ""
  if (typeof this.data.password != "string") this.data.password = ""

  // get rid of any bogus property
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    password: this.data.password,
  }
}

Admin.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    adminsCollection
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

Admin.prototype.register = function () {
  this.cleanUp()
  let salt = bcrypt.genSaltSync(10)
  this.data.password = bcrypt.hashSync(this.data.password, salt)
  adminCollection.insertOne(this.data)
}

module.exports = Admin
