var express = require("express");
var router = express.Router();

/* GET members listing. */
router.get("/", function (req, res, next) {
  console.log(req.query);
  res.send("respond with a resource");
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  res.send("USER X");
});

router.post("/", (req, res) => {
  console.log(req.body);
  res.send("Got a POST request");
});

module.exports = router;
