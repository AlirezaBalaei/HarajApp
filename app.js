const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const app = express()

let sessionOptions = session({
  secret:
    "this is one of my firt realworld projects named haraj-app ... hope it works perfect :D",
  store: MongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
})

const router = require("./router.js")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("./public"))
app.use(sessionOptions)
app.use(flash())

app.use("/", router)
app.use("/login", router)
app.use("/register", router)
app.use("/active_auction", router)
app.use("/history", router)
app.use("/account", router)
app.use("/administrator", router)

app.set("views", "views")
app.set("view engine", "ejs")

module.exports = app
