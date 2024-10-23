import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = process.env.PORT || 3000;
const submissions = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Select article from Nav Bar
// ***SOME OF THIS DOES NOT SEEM TO BE USED ***
app.post("/nav", (req, res) => {
  const navSelection = req.body["selectedNav"];
  const artSelection = "link to Article"    

 console.log(`Item selected from Navbar: ${navSelection}`)
 console.log(`Item selected from Navbar: ${artSelection}`)

 res.render("index.ejs", { 
  navSelection: navSelection, 
  submissions: submissions, 
  artSelection: artSelection,
  selectedPost: null,
  editPostId: null,
  editTitle: "",
  editArticle: ""
});
});

//Render edit form
app.post("/edit", (req, res) => {
  //on press of edit button, takes id of post to be edited
  const editPostId = parseInt(req.body["editId"], 10);

  //converts id to title and article
  const editTitle = submissions[editPostId].title
  const editArticle = submissions[editPostId].article

  console.log(`Article to be edited is: ${editTitle}`)

   res.render("index.ejs", { 
    editPostId: editPostId, 
    editTitle: editTitle, 
    editArticle: editArticle, 
    submissions: submissions,
    selectedPost: submissions[editPostId]
  });
});

//Handle post editing
app.post("/editSubmit", (req, res) => {
  const editPostId = parseInt(req.body["editId"], 10);
  const editedTitle = req.body["titleEdit"];
  const editedText = req.body["textEdit"];

  if (editedTitle && editedText) {
    submissions[editPostId].title = editedTitle;
    submissions[editPostId].article = editedText;
  } else {
    console.log("Error: Title or text is undefined");
  };

  console.log("Items to be edited");
  console.log("Edited Title: ", editedTitle);
  console.log("Edited Article: ", editedText);

  res.redirect("/");
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

  console.log(`Deleted ID: ${deletePostId}`);
  console.log(submissions);
});

//Submit Posts
app.post("/submit", (req, res) => {
  const blogTitle = req.body["title"];
  const blogText = req.body["text"];

  //Saves submitted titles and articles to array
  if (blogTitle && blogText) {
    submissions.push({ 
      id: submissions.length, 
      title: blogTitle, 
      article: blogText });
    console.log("New post submitted: ")
    console.log(submissions)
  } else {
    console.log("You have an error")
  }

  res.render("index.ejs", { 
    latestSubmission: submissions[submissions.length-1], 
    submissions: submissions});
  //res.redirect("/");
  //redirects back to home page after submitting
});

app.get("/", (req, res) => {
  //Display submissions
  const postId = parseInt(req.query.id, 10);
  const selectedPost = !isNaN(postId) ? submissions.find(sub => sub.id === postId) : null;

  console.log(`Selected from Nav Bar: postId = ${postId}, selectedPost = ${selectedPost}`)
  console.log(selectedPost)

  res.render("index.ejs", { 
    submissions: submissions, 
    selectedPost: selectedPost,
    editPostId: null,
    editTitle: "",
    editArticle: ""
  });
});




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



//***KNOWN ISSUES***
//When an entry is deleted, the next entry created may cause 
//a double up of ID
//Try putting a check on the post submission to test if an id 
//alreday exists. 