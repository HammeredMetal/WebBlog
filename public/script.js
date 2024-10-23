// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    const submissions = window.submissions || []; // Ensures submissions is available
    
    // Select the button by ID using submission.title
    submissions.forEach(submission => { 
      const button = document.getElementById("submission.title");
      
      // Attach a click event listener to the button
      if (button) {
        button.addEventListener("click", function() {
        const articleElement = document.getElementById("submission.article");
        });
      };
    });
  });