const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController.js")
const adminController = require("./controllers/adminController.js")

router.get("/", userController.homePage)
router.get("/login", userController.loginPage)
router.get("/register", userController.registerPage)
router.get("/active_auction", userController.active_auction)
router.get("/history", userController.history)
router.get("/account", userController.account)

router.get("/administrator", adminController.panel)

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/logout", userController.logout)

// router.get("/createadminpage", adminController.createAdminPage)
// router.post("/createadmin", adminController.createAdmin)

module.exports = router
