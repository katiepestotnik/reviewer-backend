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
    movieRating: Number
})
const Review = mongoose.model("Review", ReviewSchema)

app.get("/", (req, res) => {
    res.send("hello world");
});
app.get("/review/seed", (req, res) => {
  // array of starter reviews
  const startReviews = [
    { movieName: "Pan's Labyrinth", movieImage: "https://upload.wikimedia.org/wikipedia/en/6/67/Pan%27s_Labyrinth.jpg", movieReview: "Magical", movieRating: 5 },
    { movieName: "Blade Runner", movieImage: "https://miro.medium.com/max/1400/1*4KkBJLj0-_nGCblVAzlA2A.jpeg", movieReview: "One of my favorites.", movieRating: 5 },
    { movieName: "The Humans", movieImage: "https://www.sho.com/site/image-bin/images/0_0_3493874/0_0_3493874_00h_1280x640.jpg", movieReview: "Utterly Boring, turned it off after 20 minutes.", movieRating: 1 }

  ]
  // Delete all reviews
  Review.deleteMany({}, (err, data) => {
    Review.create(startReviews,(err, data) => {
        res.json(data);
      }
    );
  });
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
//show
app.get("/review/:id", async (req, res) => {
  try {
      res.json(await Review.findById(req.params.id));
  } catch (error) {
      res.status(400).json(error);
  }
});
  
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));