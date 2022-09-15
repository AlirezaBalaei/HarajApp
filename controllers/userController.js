const User = require("../models/User.js")

exports.login = function (req, res) {
  let user = new User(req.body)
  user
    .login()
    .then(function (result) {
      req.session.user = { username: user.data.username }
      req.session.save(function () {
        res.redirect("/")
      })
    })
    .catch(function (err) {
      req.flash("errors", err)
      req.session.save(function () {
        res.redirect("/login")
      })
    })
}

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/")
  })
}

exports.active_auction = function (req, res) {
  if (req.session.user) {
    res.render("active_auction", { username: req.session.user.username })
  } else {
    res.redirect("/")
  }
}

exports.history = function (req, res) {
  if (req.session.user) {
    res.render("history", { username: req.session.user.username })
  } else {
    res.redirect("/")
  }
}

exports.account = function (req, res) {
  if (req.session.user) {
    res.render("account", { username: req.session.user.username })
  } else {
    res.redirect("/")
  }
}

exports.register = function (req, res) {
  let user = new User(req.body)
  user
    .register()
    .then(() => {
      req.session.user = { username: user.data.username }
      req.session.save(function () {
        res.redirect("/")
      })
    })
    .catch((regErrors) => {
      regErrors.forEach(function (error) {
        req.flash("regErrors", error)
      })
      req.session.save(function () {
        res.redirect("/register")
      })
    })
}

exports.homePage = function (req, res) {
  if (req.session.user) {
    res.render("home-user", { username: req.session.user.username })
  } else {
    res.render("home-guest")
  }
}

exports.loginPage = function (req, res) {
  if (req.session.user) {
    res.send("Page Not Found!")
  } else {
    res.render("login", { errors: req.flash("errors") })
  }
}

exports.registerPage = function (req, res) {
  if (req.session.user) {
    res.send("Page Not Found!")
  } else {
    res.render("register", { regErrors: req.flash("regErrors") })
  }
}
