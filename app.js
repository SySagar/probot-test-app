
const axios = require("axios");
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("pull_request.opened", async (context) => {
 
    const issue=context.payload.issue

    console.log("this is the body"+issue.body)
    var finalResult;
    let errorMsg = "Sorry, I couldn't compile your code. Please check your code and try again."

  const options = {
    method: 'POST',
    url: 'https://online-code-compiler.p.rapidapi.com/v1/',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
    },
    data: {
      language: 'cpp',
      version: 'latest',
      code: `${issue.body}`,
      input: null
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data.output);
    finalResult="output: "+response.data.output;
  } catch (error) {
    console.error(error);
    finalResult=errorMsg;
  }
  

    const issueComment = context.issue({
      body: finalResult,
    });
    return context.octokit.issues.createComment(issueComment);
  });

};
