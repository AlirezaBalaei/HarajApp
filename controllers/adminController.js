const Admin = require("../models/Admin.js")
const bcrypt = require("bcryptjs")
const adminCollection = require("../db").db().collection("admins")

exports.login = function (req, res) {
  let admin = new Admin(req.body)
  admin
    .login()
    .then(function (result) {
      req.session.user = { username: user.data.username }
      req.session.save(function () {
        res.redirect("/administrator_panel")
      })
    })
    .catch(function (err) {
      req.flash("errors", err)
      req.session.save(function () {
        res.redirect("/administrator")
      })
    })
}

exports.panel = function (req, res) {
  if (req.session.user) {
    res.render("admin_panel", { username: req.session.user.username })
  } else {
    res.render("admin")
  }
}

// how to register new admin:
// 1# uncomment two blew lines inside of router
//    router.get("/createadminpage", adminController.createAdminPage)
//    router.post("/createadmin", adminController.createAdmin)
// 2# then register a new admin in http://hostdomain/createadminpage
// 3# recomment step 2#
exports.createAdmin = function (req, res) {
  let salt = bcrypt.genSaltSync(10)
  req.body.password = bcrypt.hashSync(req.body.password, salt)
  let obj = { username: req.body.username, password: req.body.password }
  adminCollection
    .insertOne(obj)
    .then(res.send("Success! You created a new admin."))
    .catch(res.send("Oops there was an error!"))
}

exports.createAdminPage = function (req, res) {
  res.render("createadminpage")
}
