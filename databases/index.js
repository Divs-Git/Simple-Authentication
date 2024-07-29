const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPassword = "123456";

mongoose.connect(
  "mongodb+srv://divyansh06:divyansh06@cluster0.kyg7gmn.mongodb.net/"
);

const User = mongoose.model("User", {
  name: String,
  username: String,
  pasword: String,
});

const app = express();
app.use(express.json());

async function userExists(username) {
  // should check in the database
  const userFound = await User.findOne({ username });
  return userFound;
}

app.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;

    const userFound = await userExists(username);
    if (userFound) {
      return res.status(400).json({
        msg: "Username already exist",
      });
    }

    const user = new User({
      name,
      username,
      password,
    });

    user.save();
    return res.status(200).json({
      msg: "User created",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});

app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, "shhhhh");
  return res.json({
    token,
  });
});

app.get("/users", async function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    // return a list of users other than this username from the database
    const users = await User.find({ username: { $ne: username } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000);
