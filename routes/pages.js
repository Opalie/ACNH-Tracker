const express = require("express");
const router = express.Router();

router.get('/', (request, res) => {
    res.render('index');
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;