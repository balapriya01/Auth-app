const express = require("express");
const app = express();

const userModel = require("./models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = require("path");

//Ejs
app.set("view engine", "ejs");

//Readable format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//To access public files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});


app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hashpassword) => {
      const createdUser = await userModel.create({
        name,
        email,
        password: hashpassword,
      });
      const token = jwt.sign({ email }, "sanasayyed");
      res.cookie("token", token);
      res.render('login');
    });
  });
});


app.get('/login', (req, res) => {
    res.render("login")
})

app.post('/login', async (req, res) => {
    const user = await userModel.findOne({email: req.body.email});
    if(!user) return res.send('Sorry something went wrong');

    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(result) {
            const token = jwt.sign({email: user.email}, "sanasayyed");
            res.cookie("token", token);
            res.render('logout');
        }
        else{
            res.send("Sorry something went wrong")
        }
    } )
})


app.post('/logout', (req, res) => {
  res.cookie('token', "");
  res.redirect('/login')
})

app.get("/find", async (req, res) => {
  const allUsers = await userModel.find();
  res.send(allUsers);
});

app.listen(3000, () => {
  console.log("Listening at PORT 3000");
});
