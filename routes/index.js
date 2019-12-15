const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Logowanie" });
});

//-----------------------------------------
const login = `admin`;
const password = `123`;
// na tą ścierzkę została wysłana odpowiedź

router.post("/login", (req, res) => {
  const body = req.body;
  // req.body ->  {login: 'mój login ',password: 'lubie cebule' }
  if (login === body.login && password === body.password) {
    //...
    // jak się zalogował to przyznaje mu sesje
    req.session.nameThisSession = 1;
    //...

    res.redirect("/admin");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
