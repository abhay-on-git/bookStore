exports.checkPrice = (req, res, next) => {
    if (req.body.price < 500) {
        return res.status(400).send("Price too low, we do not allow to sell.");
    }
    next();
};

// Ensure it's exported correctly
// module.exports = { checkPrice };
