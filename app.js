
const express = require("express");
const _ = require('lodash');
const mongoose = require('mongoose');

require('dotenv').config();
const userID = process.env.id_n;
const userPass = process.env.id_pass

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();

app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${userID}:${userPass}@cluster0.4w0cefj.mongodb.net/journalDB`);
}

const journalSchema = new mongoose.Schema({ title: String, content: String });
const Journal = mongoose.model("journal", journalSchema);


app.get("/", (req, res) => {
  Journal.find({}, (err, foundList) => {
    if (!err) res.render("home", { homeStartingContent: homeStartingContent, posts: foundList });
  });
});

app.get("/about", (req, res) => res.render("about", { aboutContent: aboutContent }));

app.get("/contact", (req, res) => res.render("contact", { contactContent: contactContent }));

app.get("/compose", (req, res) => res.render("compose"));

app.get("/posts/:postId", (req, res) => {
  const paramPost = req.params.postId
  Journal.findOne({ _id: paramPost }, (err, results) => {
    if (!err) res.render("post", { posts: results.title, content: results.content, id: results.id });
  });
});

//App Post For Compose, Adds the data to mongodb Server
app.post("/compose", (req, res) => {
  const title = req.body.titleInput;
  const content = req.body.postInput;
  const compose = new Journal({
    title: title,
    content: content
  });
  compose.save((err) => {
    if (!err) {
      res.redirect("/");
    };
  });
});

//app post delete function
app.post("/delete", (req, res) => {
  const deleteSelected = req.body.delete;
  Journal.findByIdAndRemove({ _id: deleteSelected }, (err) => {
    if (!err) {
      console.log("successfully deleted");
      res.redirect("/")
    } else { console.log(err); }
  })
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
