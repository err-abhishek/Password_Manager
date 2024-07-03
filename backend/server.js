const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyparser.json());
app.use(cors());

const mongoUri = "mongodb://localhost:27017/passwords";
mongoose.connect(mongoUri);

const passwordSchema = new mongoose.Schema({
  site: String,
  username: String,
  password: String,
});

const Password = mongoose.model("Password", passwordSchema);

app.get("/passwords", async (req, res) => {
  try {
    const passwords = await Password.find();
    res.send(passwords);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching passwords." });
  }
});

app.post("/passwords", async (req, res) => {
  try {
    const password = new Password(req.body);
    await password.save();
    res.send(password);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while saving the password." });
  }
});

app.delete("/passwords/:id", async (req, res) => {
  try {
    await Password.findByIdAndDelete(req.params.id);
    res.send({ message: "Password deleted" });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while deleting the password." });
  }
});

app.put("/passwords/:id", async (req, res) => {
  try {
    const updatedPassword = await Password.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send(updatedPassword);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while updating the password." });
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
