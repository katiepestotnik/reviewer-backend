require("dotenv").config();
const { PORT = 3000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//Connect Mongo
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

//MIDDLEWARE
const cors = require("cors");
const morgan = require("morgan");
app.use(express.json());

//MODEL
const ReviewSchema = new mongoose.Schema({
    movieName: String,
    movieImage: String,
    movieReview: String,
})
const Review = mongoose.model("Review", ReviewSchema)

app.get("/", (req, res) => {
    res.send("hello world");
});
//index
app.get("/review", async (req, res) => {
    try {
        res.json(await Review.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});
//new
//delete
app.delete("/review/:id", async (req, res) => {
    try {
      res.json(await Review.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
});
//put
app.put("/review/:id", async (req, res) => {
    try {
      res.json(
        await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
});
//post
app.post("/review", async (req, res) => {
    try {
      res.json(await Review.create(req.body));
    } catch (error) {
      res.status(400).json(error);
    }
});
  
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));