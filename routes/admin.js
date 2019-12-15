const express = require("express");
const News = require("../models/news");
const router = express.Router();

// każde połączenie z adminem o dowolnym żądaniu Get, Post, i dla kożdej ścierzki, wywoła tą funkcję
// sprawdza wszystko co idzie na /admin, każde żądania
// będzie chronione sesją
router.all("*", (req, res, next) => {
  // req.session jest globalny przez
  if (!req.session.nameThisSession) {
    res.redirect("login");
    return;
  }
  // żeby wykonały się pozostałe REQ-uesty
  next();
});

/* GET home page. */
router.get("/", (req, res) => {
  News.find({}, (err, data) => {
    res.render("admin/index", { title: "Admin", data });
  });
});

router.get("/news/add", (req, res) => {
  res.render("admin/news-form", { title: "Dodaj news", body: {}, errors: {} });
});

router.post("/news/add", (req, res) => {
  const body = req.body;
  const newsData = new News(body);

  // sprawdza czy przekazane dane są ok
  const errors = newsData.validateSync();

  newsData.save(err => {
    if (err) {
      res.render("admin/news-form", { title: "Dodaj news", errors, body });
      return;
    }
  });
  res.redirect("/admin");
});

router.get("/news/delete/:id", (req, res) => {
  News.findByIdAndDelete(req.params.id, err => {
    res.redirect("/admin");
  });
});
module.exports = router;
