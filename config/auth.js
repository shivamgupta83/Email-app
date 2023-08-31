const jwt = require("jsonwebtoken")
require("dotenv").config();
exports.Auth= async (req, res, next) => {
    try {
        const header = req.headers["authorization"]

        if (!header) return res.status(400).send({ status: false, msg: "token is not present" })

        jwt.verify(header, process.env.SECRET_KEY, function (err, token) {
            if (err) {
                return res.status(401).send({ status: false, msg: "Token invalid / Token Expired" })
            }
            else {
                req.user = token
                next()
            }
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//auth