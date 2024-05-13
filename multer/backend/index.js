const express = require("express");
const app = express();
app.use(express.json());
const PORT = 5000;
const cors = require("cors");
const db = require("./db");
const upload = require("./config/multerconfig");

// Serve static files from the 'public' directory
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
});

app.get("/abc", async (req, res) => {
  const response = await db.query("SELECT * FROM users");
  const users = response.rows;
  //   console.log(users);
  res.json(users);
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
