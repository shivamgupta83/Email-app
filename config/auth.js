const jwt = require("jsonwebtoken")

exports.Auth= async (req, res, next) => {
    try {
        const header = req.headers["authorization"]

        if (!header) return res.status(400).send({ status: false, msg: "token is not present" })

        jwt.verify(header, "secret-key", function (err, token) {
            if (err) {
                return res.status(401).send({ status: false, msg: "Dost... Token is invalid Or Token has been Expired" })
            }
            else {
                console.log(token)
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