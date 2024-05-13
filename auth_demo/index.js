import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
import morgan from "morgan";
import env from "dotenv";

env.config();
const PORT = process.env.SERVER_PORT;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//create the session

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

// inialize the passport for incoming request and allowing authentication strategy to be applied
app.use(passport.initialize());
//middleware that restore the login state from a session
app.use(passport.session());

//connecting to the database

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error fetching the databse:", err);
  });

//home page
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM users ORDER BY id");
  const users = result.rows;
  res.send(users);
});

//secret page
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.send("You are authenticated user. You can access this secret page");
  } else {
    res.send("You are not authenticated. Please try to login");
  }
});

//register the user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  //   console.log(`username:${name} email: ${email} password: ${password}`);

  // check whether the user is alredy register or not
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.rowCount > 0) {
    res.send("Already registed please try to log in");
  } else {
    //convert the plain password into the hash form
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        res.send("Error in hashing the password", err);
      } else {
        // insert into the databse new user
        const result = await db.query(
          "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
          [name, email, hash]
        );
        res.send(result.rows);
      }
    });
  }
});

// edit the particular user details
app.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  //fetch the data of user through id
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  const user = result.rows[0];
  const newName = name || user.name;
  const newEmail = email || user.email;
  //   console.log(newName, newEmail);
  const response = await db.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [newName, newEmail, id]
  );
  console.log(response.rows[0]);
  res.redirect("/");
});

//delete the particular user details
app.delete("/delete/:id",async(req, res) => {
    const id = req.params.id;
    await db.query("DELETE FROM users WHERE id = $1",[id]);
    res.redirect("/");
})


//login the user
// we have add middleware for incoming login req
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

//authenticate the incoming request
passport.use(
  new Strategy({ usernameField: "email" }, async function verify(
    email,
    password,
    cb
  ) {
    console.log(email);
    console.log(password);

    try {
      //  check whether the user is registerd or not
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (result.rowCount > 0) {
        const user = result.rows[0];
        const storedPassword = user.password;
        bcrypt.compare(password, storedPassword, async (err, done) => {
          if (err) {
            return cb(null);
          } else {
            if (done) {
              //   res.send("Successfully compare the password :)");
              return cb(null, user);
            } else {
              //   res.send("Incorrect password");
              return cb(null, false);
            }
          }
        });
      } else {
        // res.send("Please do register before login.! User not found :(");
        return cb("user not found");
      }
    } catch (error) {
      return cb(error);
    }
  })
);

//store the user data in to the local storage
passport.serializeUser((user, cb) => {
  cb(null, user);
});

//access the user info through that session
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
