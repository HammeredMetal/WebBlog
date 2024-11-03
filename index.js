import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = process.env.PORT || 3000;
const submissions = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Function to render the index page
const renderIndex = (res, options) => {
  res.render ("index.ejs", {
    submissions,
    ...options
  });
};

//Select article from Nav Bar
app.post("/nav", (req, res) => {
  renderIndex(res, { 
    selectedPost: null,
    editPostId: null,
    editTitle: "",
    editArticle: ""
  });
});

//New Post Button
app.post("/newPost", (req,res) => {
res.redirect("/");
});

//Render edit form
app.post("/edit", (req, res) => {
  //on press of edit button, takes id of post to be edited
  const editPostId = parseInt(req.body["editId"], 10);
  const selectedPost = submissions[editPostId];

  renderIndex(res, { 
    editPostId,
    editTitle: selectedPost.title, 
    editArticle: selectedPost.article, 
    selectedPost
  });
});

//Handle post editing
app.post("/editSubmit", (req, res) => {
  const editPostId = parseInt(req.body["editId"], 10);
  const editedTitle = req.body["titleEdit"];
  const editedText = req.body["textEdit"];

  if (editedTitle && editedText) {
    submissions[editPostId] = { ...submissions[editPostId], title: editedTitle, article: editedText};
  } else {
    console.log("Error: Title or text is undefined");
  };

  //res.redirect("/");
  renderIndex(res, { 
    editedTitle: editedTitle, 
    editedText: editedText,
    });
});

//Delete Posts
app.post("/delete", (req, res) => {
  const deletePostId = parseInt(req.body["deleteId"], 10);
  submissions.splice(deletePostId,1);

  //Re-assign IDs after deletion
  submissions.forEach((submission, index) => {
    submission.id = index;
  });

  res.redirect("/");
});

//Submit Posts
app.post("/submit", (req, res) => {
  const { title: blogTitle, text: blogText} = req.body;

  //Saves submitted titles and articles to array
  if (blogTitle && blogText) {
    submissions.push({ 
      id: submissions.length, 
      title: blogTitle, 
      article: blogText });
  } else {
    console.log("You have an error")
  }

  renderIndex(res, { 
    latestSubmission: submissions[submissions.length-1], 
    });
});

//Home Route
app.get("/", (req, res) => {
  //Display submissions
  const postId = parseInt(req.query.id, 10);
  const selectedPost = !isNaN(postId) ? submissions.find(sub => sub.id === postId) : null;

  renderIndex(res, { 
    selectedPost: selectedPost,
    editPostId: null,
    editTitle: "",
    editArticle: ""
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Push To Git 
// 1. git status
// 2. git add .
// 3. or git add filename 
// 4. git commit -m "Your message here"
// 5. git push origin main 