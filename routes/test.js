const router = require("express").Router();

router.route("/").get((req, res) => {
    res.status(200).json({"message": "api working correctly. Enjoy :) "})
});

module.exports = router;

