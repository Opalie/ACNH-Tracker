const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// connect to db
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE,
});

//login -> doesn't work yet

//async= server waits for the action to be done when we use a 'wait' before reading the next line of code
exports.login = async(req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: "Please provide an email and password"
            })
        }

        db.query('SELECT * FROM user WHERE user_email = ?', [email], async(error, results) => {
            console.log(results);
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: "Email or Password is incorrect"
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id: user_id })
            }

        })

    } catch (error) {
        console.log(error);
    }
}

// register

exports.register = (req, res) => {
    console.log(req.body);

    // const username = req.body.username;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordRepeat = req.body.passwordRepeat;
    // same line as const under

    const { username, email, password, passwordRepeat } = req.body;

    // user cannot use same email thanks to the WHERE user_email = ?
    // results comes up as an array
    db.query('SELECT user_email FROM user WHERE user_email = ?', [email], async(error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            // renders register page
            return res.render('register', {
                message: "This email is already taken."
            })
        } else if (password !== passwordRepeat) {
            return res.render('register', {
                message: "Passwords do not match."
            });
        }

        // Encrypt password /!\ bcrypt.hash(NAMETOHASH, TIMESTOHASH)
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO user SET ?', { user_name: username, user_email: email, user_password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: "User registered."
                });
            }
        })

    });
}