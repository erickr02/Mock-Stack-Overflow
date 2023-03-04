import Model from './model.js';

//store the model in var datamodel for reference
var datamodel = new Model;


var questionsDisplayed;
var homePageDisplayed;
var tagsDisplayed;
var questionPageDisplayed;
var answerQuestionPageDisplayed;

document.getElementById("questionsbutton").addEventListener("click", displayHomePage);
document.getElementById("tagsbutton").addEventListener("click", displayTags);
document.getElementById("searchbarid").addEventListener("keypress", function(event) {
    if(event.key == "Enter")
        searchQ();
});

//window.onload to ensure the website first appears on the home page
window.onload = displayHomePage;

function displayHomePage(){
    clearNewAnswerPage();
    //display questions before returning 
    sortAndDisplayByNewest();

    if(homePageDisplayed)
        return;
    //questions= array of questions in data model
    let questions = datamodel.data.questions;

    let numquestions = datamodel.data.questions.length;

    let newestbutton = document.createElement("button");
    newestbutton.addEventListener("click", sortAndDisplayByNewest);

    let activebutton = document.createElement("button");
    activebutton.addEventListener("click", sortAndDisplayByActive);

    let unansweredbutton = document.createElement("button");
    unansweredbutton.addEventListener("click", sortAndDisplayUnanswered);

    let askquestionbutton = document.createElement("button");
    askquestionbutton.id = "askquestionbutton";

    
    askquestionbutton.innerHTML = "Ask Question";
    askquestionbutton.className = "questionbutton";
    askquestionbutton.id = "askQuestionButton";

    //setup newestbutton
    newestbutton.innerHTML = "Newest"; 

    //setup activebutton
    activebutton.innerHTML = "Active";
    
    //setup unansweredbutton
    unansweredbutton.innerHTML = "Unanswered";
    
    /*check if childelementcount == 3 because if it is not checked, pressing the questions button
    will continue to spawn buttons even when one exists. This might cause problems
    when switching between tags and questions, not sure if childelementcount will reset*/
    if (document.getElementById("questionsdisplay").childElementCount == 3){
        document.getElementById("questionsdisplay").append(askquestionbutton);
    }

    //check if childelementcount == 0 for same reason as above
    if (document.getElementById("sortingbar").childElementCount == 0){
        document.getElementById("sortingbar").append(newestbutton);
        document.getElementById("sortingbar").append(activebutton);
        document.getElementById("sortingbar").append(unansweredbutton);
    }

    //display the title all questions and the number of questions below it
    document.getElementById("questiontitle").innerHTML = "All Questions"
    document.getElementById("numquestions").innerHTML = numquestions + " questions"
    document.getElementById("tagsList").innerHTML = "";
    document.getElementById("questionsdisplay").style.borderBottom = "5px inset gray";
    homePageDisplayed = true;
    questionPageDisplayed = false;
    document.getElementById("askQuestionButton").addEventListener("click", displayQuestionPage);
}   
function displayQuestions(){
    clearQuestions();
    document.getElementById("questionsbutton").style.backgroundColor = "gray";
    document.getElementById("tagsbutton").style.backgroundColor = "";
    document.getElementById("searchbarid").innerHTML = "";
    if(questionsDisplayed)
        return;
    tagsDisplayed = false;
    //store the questions array in questions to make it easier to reference
    let questions = datamodel.data.questions;

    questions.forEach(currquestion => {
        //create new question "box"/container
        let newquestionbox = document.createElement("div");
        newquestionbox.className = "question";
        newquestionbox.addEventListener("click", () =>{
            displayClickedQuestion(currquestion)
        });
        newquestionbox.style.cursor = "pointer";

        //create new questions and views "box"/container
        let answersViewsBox = document.createElement("div");
        answersViewsBox.className = "answersviewsbox"

        //create the questionTitle section
        let questionTitle = document.createElement("div");
        questionTitle.className = "questionTitle";
        questionTitle.innerHTML = currquestion.title;

        //create answers section
        let questionViews = document.createElement("div");
        questionViews.className = "questionViews";
        questionViews.innerHTML = currquestion.views + " views"

        //create num answers section
        let questionNumAnswers = document.createElement("div");
        questionNumAnswers.className = "questionNumAnswers";
        questionNumAnswers.innerHTML = currquestion.ansIds.length + " answers";

        //create asked/date section
        let questionAsker = document.createElement("div");
        questionAsker.className = "questionAsker";
        questionAsker.innerHTML = currquestion.askedBy + " asked " + displayDate(currquestion.askDate);

        let questionTags = document.createElement("div");
        questionTags.className = "questionTags";

        let relevantTags = getTagIndices(currquestion);
        
        relevantTags.forEach(index =>{
            let homePageTagBox = document.createElement("span");
            homePageTagBox.className = "homePageTagBox";
            let currtag = datamodel.data.tags[index - 1];
            homePageTagBox.innerHTML = currtag.name;
            questionTags.append(homePageTagBox);
        })

        

        //add the view count and number of answers to the question box
        answersViewsBox.append(questionViews);
        answersViewsBox.append(questionNumAnswers);

        //add the title, 
        newquestionbox.append(questionTitle);
        newquestionbox.append(questionAsker);
        newquestionbox.append(answersViewsBox);
        newquestionbox.append(questionTags);

        //add questionbox to main body
        document.getElementById("main").append(newquestionbox);
    })
    //set displayed to true so the button does not list the same questions repeatedly
    questionsDisplayed = true;
    questionPageDisplayed = false;
    //For toggling show and hide of tags and questions
    document.getElementById("questionsdisplay").style.display = "flex";
    document.getElementById("main").style.display = "block";
    document.getElementById("tagsdisplay").style.display = "none";
    document.getElementById("tagsList").innerHTML = "";
    document.getElementById("tagsTitle").innerHTML = "";
    document.getElementById("askQuestionPage").style.display = "none";
    document.getElementById("askQuestionPage").innerHTML = "";
    
}
function sortAndDisplayByNewest(){
    clearNewAnswerPage();
    //set to false and clear questions so displayquestions works
    questionsDisplayed = false;
    clearQuestions();

    //sort and display questions
    datamodel.sortByNewest();
    displayQuestions();

}

function sortAndDisplayByActive(){
    clearNewAnswerPage();
    //set to false and clear questions so displayquestions works
    questionsDisplayed = false;
    clearQuestions();

    //sort and display questions
    datamodel.sortByActive();
    displayQuestions();
}


function sortAndDisplayUnanswered(){
    clearNewAnswerPage();
    //set to false and clear questions so displayquestions works
    questionsDisplayed = false;
    clearQuestions();
    
    //sort and display questions
    let unansweredQuestions = datamodel.sortByUnanswered();
    displayUnanswered(unansweredQuestions);
}

//needed to make a new function that takes in a question array for unanswered sorting since unanswered sorting is supposed to only show questions
//with no answers
function displayUnanswered(unansweredQuestions){
    clearNewAnswerPage();
    clearQuestions();
    tagsDisplayed = false;

    if (unansweredQuestions){
        unansweredQuestions.forEach(currquestion =>{
            //create new question "box"/container
            let newquestionbox = document.createElement("div");
            newquestionbox.className = "question";
            newquestionbox.addEventListener("click", ()=>{  
                displayClickedQuestion(currquestion);
            })
            newquestionbox.style.cursor = "pointer";

            //create new questions and views "box"/container
            let answersViewsBox = document.createElement("div");
            answersViewsBox.className = "answersviewsbox"

            //create the questionTitle section
            let questionTitle = document.createElement("div");
            questionTitle.className = "questionTitle";
            questionTitle.innerHTML = currquestion.title;


            //create answers section
            let questionViews = document.createElement("div");
            questionViews.className = "questionViews";
            questionViews.innerHTML = currquestion.views + " views"

            //create num answers section
            let questionNumAnswers = document.createElement("div");
            questionNumAnswers.className = "questionNumAnswers";
            questionNumAnswers.innerHTML = currquestion.ansIds.length + " answers";

            //create asked/date section
            let questionAsker = document.createElement("div");
            questionAsker.className = "questionAsker";
            questionAsker.innerHTML = currquestion.askedBy + " asked " + displayDate(currquestion.askDate);

            let questionTags = document.createElement("div");
            questionTags.className = "questionTags";

            let relevantTags = getTagIndices(currquestion);
        
            relevantTags.forEach(index =>{
                let homePageTagBox = document.createElement("span");
                homePageTagBox.className = "homePageTagBox";
                let currtag = datamodel.data.tags[index - 1];
                homePageTagBox.innerHTML = currtag.name;
                questionTags.append(homePageTagBox);
            })

            //add the view count and number of answers to the question box
            answersViewsBox.append(questionViews);
            answersViewsBox.append(questionNumAnswers);

            //add the title, 
            newquestionbox.append(questionTitle);
            newquestionbox.append(questionAsker);
            newquestionbox.append(answersViewsBox);
            newquestionbox.append(questionTags);

            //add questionbox to main body
            document.getElementById("main").append(newquestionbox);
        })
        questionsDisplayed = true;
        questionPageDisplayed = true;
    }   
    questionsDisplayed = false;
    questionPageDisplayed = false;
    //For toggling show and hide of tags and questions
    document.getElementById("questionsdisplay").style.display = "flex";
    document.getElementById("main").style.display = "block";
    document.getElementById("tagsdisplay").style.display = "none";
    document.getElementById("tagsList").innerHTML = "";
    document.getElementById("tagsTitle").innerHTML = "";
    document.getElementById("askQuestionPage").style.display = "none";
    document.getElementById("askQuestionPage").innerHTML = "";
}
function displayTags(){
    document.getElementById("questionsbutton").style.backgroundColor = "";
    document.getElementById("tagsbutton").style.backgroundColor = "gray";
    clearNewAnswerPage();
    if(tagsDisplayed)
        return;
    tagsDisplayed = true;
    homePageDisplayed = false;
    //make sure to set to false so pressing questions button works
    questionsDisplayed = false;
    questionPageDisplayed = false;
    //Hiding the questions page
    document.getElementById("questionsdisplay").style.display = "none";
    document.getElementById("main").innerHTML = "testing";
    document.getElementById("tagsdisplay").style.display = "block";
    document.getElementById("askQuestionPage").style.display = "none";
    document.getElementById("askQuestionPage").innerHTML = "";
    document.getElementById("tagsList").style.display = "grid";
    //Creating the tags header area
    let tags = datamodel.data.tags;
    let num_tags = tags.length;
    let numTagBox = document.createElement("div");
    numTagBox.innerHTML = num_tags+ " Tags";
    
    let allTags = document.createElement("div").innerHTML = "All Tags";

    let askquestionbutton = document.createElement("button");
    //setup the ask question button    
    askquestionbutton.innerHTML = "Ask Question";
    askquestionbutton.className = "questionbutton";
    askquestionbutton.id = "askQuestionButton";
    askquestionbutton.style.marginTop = "-10px";
    askquestionbutton.addEventListener("click",displayQuestionPage);

    //DOM with the # Tags, All Tags, and question button for the header
    document.getElementById("tagsTitle").append(numTagBox);
    document.getElementById("tagsTitle").append(allTags);
    document.getElementById("tagsTitle").append(askquestionbutton);
    document.getElementById("tagsTitle").style.display = "flex";
    document.getElementById("tagsTitle").style.justifyContent = "space-around";
    document.getElementById("tagsTitle").style.justifyItems = "start";


    let questions = datamodel.data.questions;
    for(let i = 0; i < tags.length; i++){
        //Creating a tag box
        let newtagbox = document.createElement("div");
        newtagbox.className = "tagbox";
        let numT = 0;
        //Go through the list of questions to see if it has the specific tag
        for(let j = 0; j < questions.length; j++) {
            if(questions[j].tagIds.includes(tags[i].tid))
                numT++;
        }
        let tagName = document.createElement("a");
        tagName.setAttribute("href","javascript:void(0)");
        tagName.innerHTML = tags[i].name;
        tagName.id = tags[i].name+"id";
        let linebreak = document.createElement("br");
        let tempNum = document.createElement("div").innerHTML = " "+ numT + " questions";
        
        newtagbox.append(tagName);
        newtagbox.append(linebreak);
        newtagbox.append(tempNum);
        
        document.getElementById("tagsList").append(newtagbox);
    }
    //
    for(let i = 0; i < tags.length;i++) {
        document.getElementById(tags[i].name+"id").addEventListener("click", function(){
            tagsList.style.display = "none";
            var tagid = "";
            for(let j = 0; j < tags.length; j++)
                if(tags[j].name === document.getElementById(this.id).innerHTML)
                    tagid=tags[j].tid;
            questionsDisplayed = true;
            tagsDisplayed = false;
            let questions = datamodel.data.questions;
            let displayTheQuestion = false;
            document.getElementById("main").innerHTML = "";
            let numquestions = datamodel.data.questions.length;
            questions.forEach(currquestion => {
                displayTheQuestion = false;
                for(let i = 0; i < tags.length;i++)
                    if(currquestion.tagIds.includes(tagid)) 
                        displayTheQuestion = true;
                if(displayTheQuestion){
                    //create new question "box"/container
                    let newquestionbox = document.createElement("div");
                    newquestionbox.className = "question";
                    newquestionbox.addEventListener("click", () =>{
                        displayClickedQuestion(currquestion);
                    })
                    newquestionbox.style.cursor = "pointer";
        
                    //create new questions and views "box"/container
                    let answersViewsBox = document.createElement("div");
                    answersViewsBox.className = "answersviewsbox"
        
                    //create the questionTitle section
                    let questionTitle = document.createElement("div");
                    questionTitle.className = "questionTitle";
                    questionTitle.innerHTML = currquestion.title;
        
                    //create answers section
                    let questionViews = document.createElement("div");
                    questionViews.className = "questionViews";
                    questionViews.innerHTML = currquestion.views + " views"
        
                    //create num answers section
                    let questionNumAnswers = document.createElement("div");
                    questionNumAnswers.className = "questionNumAnswers";
                    questionNumAnswers.innerHTML = currquestion.ansIds.length + " answers";
        
                    //create asked/date section
                    let questionAsker = document.createElement("div");
                    questionAsker.className = "questionAsker";
                    questionAsker.innerHTML = currquestion.askedBy + " asked " + displayDate(currquestion.askDate);
        
                    let questionTags = document.createElement("div");
                    questionTags.className = "questionTags";

                    let relevantTags = getTagIndices(currquestion);
        
                    relevantTags.forEach(index =>{
                        let homePageTagBox = document.createElement("span");
                        homePageTagBox.className = "homePageTagBox";
                        let currtag = datamodel.data.tags[index - 1];
                        homePageTagBox.innerHTML = currtag.name;
                        questionTags.append(homePageTagBox);
                    })

                    //add the view count and number of answers to the question box
                    answersViewsBox.append(questionViews);
                    answersViewsBox.append(questionNumAnswers);
        
                    //add the title, 
                    newquestionbox.append(questionTitle);
                    newquestionbox.append(questionAsker);
                    newquestionbox.append(answersViewsBox);
                    newquestionbox.append(questionTags);

                    //add questionbox to main body
                    document.getElementById("main").append(newquestionbox);
                }
                else{
                    numquestions--;
                }
            })
            if(numquestions==1)
                document.getElementById("numquestions").innerHTML = numquestions + " question"
            else
                document.getElementById("numquestions").innerHTML = numquestions + " questions"
            //For toggling show and hide of tags and questions
            document.getElementById("questionsdisplay").style.display = "flex";
            document.getElementById("main").style.display = "block";
            document.getElementById("tagsdisplay").style.display = "none";
            document.getElementById("tagsList").innerHTML = "";
            document.getElementById("tagsTitle").innerHTML = "";
            document.getElementById("askQuestionPage").style.display = "none";
            document.getElementById("askQuestionPage").innerHTML = "";
            document.getElementById("questiontitle").innerHTML = tags[i].name+" questions";
            document.getElementById("tagsbutton").style.backgroundColor = "";
            document.getElementById("questionsbutton").style.backgroundColor = "gray";
        });
    }

}


//iterate through child nodes of "main" and remove all children
//this is done to clear the questions off the page and input the newly sorted questions
function clearQuestions(){
    while(document.getElementById("main").firstChild){
        document.getElementById("main").removeChild(document.getElementById("main").firstChild);
    }
}

//ask Question Page
function displayQuestionPage() {
    document.getElementById("tagsbutton").style.backgroundColor = "";
    document.getElementById("questionsbutton").style.backgroundColor = "";
    if(questionPageDisplayed)
        return;
    questionPageDisplayed = true;
    tagsDisplayed = false;
    homePageDisplayed = false;
    questionsDisplayed = false;
    document.getElementById("questionsdisplay").style.display = "none";
    document.getElementById("main").innerHTML = "testing";
    document.getElementById("tagsdisplay").style.display = "none";
    document.getElementById("tagsList").innerHTML = "";
    document.getElementById("tagsTitle").innerHTML = "";
    document.getElementById("askQuestionPage").style.display = "block";

    //element that will contain all the separate containers inside the ask question page
    let askQuestion = document.getElementById("askQuestionPage");

    //Title box
    let titlebox = document.createElement("div"); //outer container for title
    titlebox.id = "titleboxid";
    let title = document.createElement("div");
    let charLimit = document.createElement("div");
    let titleInput = document.createElement("input");
    title.innerHTML = "Question Title*";
    title.id = "questiontitleid";
    charLimit.innerHTML = "Limit title to 100 characters or less";
    charLimit.style.fontStyle = "italic";
    charLimit.style.fontSize = "15px";
    titleInput.placeholder = "Enter title";
    titleInput.className = "askQuestionTextBox";
    titleInput.id = "titleInputId"; // TITLE TEXT ID TO GRAB FOR QUESTION MAKING
    titleInput.name = "titleInputName";
    titlebox.append(title);
    titlebox.append(charLimit);
    titlebox.append(titleInput);
    titlebox.style.marginBottom = "20px";

    //Question text box
    let qTextbox = document.createElement("div");//outer container for question text
    qTextbox.id = "qtextboxid";
    let qTextTitle = document.createElement("div");
    let qTextSub = document.createElement("div");
    let qTextInput = document.createElement("textarea");
    qTextTitle.innerHTML = "Question Text*";
    qTextSub.innerHTML = "Add details";
    qTextSub.style.fontStyle = "italic";
    qTextSub.style.fontSize = "15px";
    qTextInput.placeholder = "Add text";
    qTextInput.className = "askQuestionTextBox";
    qTextInput.style.height = "20%";
    qTextInput.style.resize = "none";
    qTextInput.id = "qTextInputId"; // TEXT ID TO GRAB FOR QUESTION MAKING
    qTextbox.append(qTextTitle);
    qTextbox.append(qTextSub);
    qTextbox.append(qTextInput);
    qTextbox.style.marginBottom = "20px";
    

    //Question tag box
    let qtagbox = document.createElement("div");//outer container for tag text
    qtagbox.id = "qtagboxid";
    let qtagTitle = document.createElement("div");
    let qtagSub = document.createElement("div");
    let qtagInput = document.createElement("input");
    qtagTitle.innerHTML = "Tags*";
    qtagSub.innerHTML = "Add keywords separated by whitespace";
    qtagSub.style.fontStyle = "italic";
    qtagSub.style.fontSize = "15px";
    qtagInput.placeholder = "Add tags";
    qtagInput.className = "askQuestionTextBox";
    qtagInput.id = "qTagInputId"; // TAG ID TO GRAB FOR QUESTION MAKING
    qtagbox.append(qtagTitle);
    qtagbox.append(qtagSub);
    qtagbox.append(qtagInput);
    qtagbox.style.marginBottom = "20px";

    let usernamebox = document.createElement("div");//outer container for username
    usernamebox.id = "usernameboxid"
    let qUserTitle = document.createElement("div");
    let qUserInput = document.createElement("input");
    qUserTitle.innerHTML = "Username*";
    qUserInput.placeholder = "Enter username";
    qUserInput.className = "askQuestionTextBox";
    qUserInput.id = "qUserInputId"// USERNAME ID TO GRAB FOR QUESTION MAKING
    usernamebox.append(qUserTitle);
    usernamebox.append(qUserInput);

    askQuestion.append(titlebox);
    askQuestion.append(qTextbox);
    askQuestion.append(qtagbox);
    askQuestion.append(usernamebox);

    let miscContainer = document.createElement("div");//container for button and the red warning text
    miscContainer.className = "miscContainer";
    let postquestionbutton = document.createElement("button");
    let redText = document.createElement("div");
    //setup the ask question button
    postquestionbutton.innerHTML = "Post Question";
    postquestionbutton.className = "questionbutton";
    postquestionbutton.id = "PostQuestionButton";
    postquestionbutton.style.marginTop = "-10px";
    postquestionbutton.style.marginBottom = "30px";

    redText.innerHTML = "* indicates mandatory fields";
    redText.style.color = "red";
    miscContainer.append(postquestionbutton);
    miscContainer.append(redText);
    askQuestion.append(miscContainer);

    //empty title
        let error1 = document.createElement("div");
        error1.id = "error1"
        error1.className = "errorMsg";
        error1.innerHTML = "*must have some sort of title";
        titlebox.append(error1);
        error1.style.display = "none";
    // if it is over 100 characters
        let error2 = document.createElement("div");
        error2.id = "error2"
        error2.className = "errorMsg";
        error2.innerHTML = "*title must be less than 100 characters";
        titlebox.append(error2);
        error2.style.display = "none";
    //if the question text box is empty
        let error3 = document.createElement("div");
        error3.id = "error3"
        error3.className = "errorMsg";
        error3.innerHTML = "*describe the problem you are having";
        qTextbox.append(error3);
        error3.style.display = "none";
    //if the tag box is empty
        let error4 = document.createElement("div");
        error4.id = "error4"
        error4.className = "errorMsg";
        error4.innerHTML = "*add some keywords for extra specificity";
        qtagbox.append(error4);
        error4.style.display = "none";
    //if the username is empty
        let error5 = document.createElement("div");
        error5.id = "error5"
        error5.className = "errorMsg";
        error5.innerHTML = "*what is your username?";
        usernamebox.append(error5);
        error5.style.display = "none";

    //When they hit the post button, will have to get value from each box
    document.getElementById("PostQuestionButton").addEventListener("click", makeQuestion);
}
function makeQuestion() {
    //titleInputId
    //qTextInputId
    //qTagInputId
    //qUserInputId

    var titleinputid = document.getElementById("titleInputId");
    var titleinput = titleinputid.value;
    titleinput = titleinput.trim();
    var qtextinputid = document.getElementById("qTextInputId");
    var qtextinput = qtextinputid.value;
    qtextinput = qtextinput.trim();
    var qtaginputid = document.getElementById("qTagInputId");
    var qtaginput = qtaginputid.value;
    qtaginput = qtaginput.trim();
    var quserinputid = document.getElementById("qUserInputId");
    var quserinput = quserinputid.value;
    qtaginput = qtaginput.trim();

    if(titleinput==""){
        document.getElementById("error1").style.display = "block";
        return;
    }else{document.getElementById("error1").style.display = "none";}
        
    if(titleinput.length > 100){
        document.getElementById("error2").style.display = "block";
        return;
    }else{document.getElementById("error2").style.display = "none";}
        
    if(qtextinput=="") {
        document.getElementById("error3").style.display = "block";
        return;
    }else{document.getElementById("error3").style.display = "none";}
        
    if(qtaginput=="") {
        document.getElementById("error4").style.display = "block";
        return;
    }else{document.getElementById("error4").style.display = "none";}
    if(quserinput=="") {
        document.getElementById("error5").style.display = "block";
        return;
    }else{document.getElementById("error5").style.display = "none";}
    
    datamodel.addQuestion(titleinput,qtextinput,qtaginput,quserinput);
    displayHomePage();
}

//function to display question when clicking on it
function displayClickedQuestion(question){
    //set all bools to false 
    questionsDisplayed = false;
    homePageDisplayed = false;
    tagsDisplayed = false;
    questionPageDisplayed = false;
    answerQuestionPageDisplayed = false;
    //get rid of dashed border to give more space for question metadata
    document.getElementById("questionsdisplay").style.borderBottom = "0px";
    //clear home page to get rid of buttons and other text
    clearHomePage();
    clearQuestions();

    //increase num views when question is clicked
    datamodel.incrementViews(question);

    //setup question container/box
    let questionContainer = document.createElement("div");
    questionContainer.className = "questionContainer";

    //setup answers text
    let numAnswers = document.createElement("div");
    numAnswers.className = "numAnswers";
    numAnswers.innerHTML = question.ansIds.length + " answers";
    
    //setup view count text
    let numViews = document.createElement("div");
    numViews.className = "numViews";
    numViews.innerHTML = question.views + " views";

    //setup question title text
    let questionTitle = document.createElement("div");
    questionTitle.className = "questionTitleAnswerPage";
    questionTitle.innerHTML = question.title;

    //setup question text box
    let questionText = document.createElement("div");
    questionText.className = "questionTextBox";
    questionText.innerHTML = question.text;

    //setup name text
    let nameBox = document.createElement("div");
    nameBox.className = "nameBox";
    nameBox.innerHTML = question.askedBy;

    //setup date text
    let dateBox = document.createElement("div");
    dateBox.className = "dateBox";
    dateBox.innerHTML = "asked on " + displayDate(question.askDate);

    //append all to question container
    questionContainer.append(numAnswers);
    questionContainer.append(numViews);
    questionContainer.append(questionTitle);
    questionContainer.append(questionText);
    questionContainer.append(nameBox);
    questionContainer.append(dateBox);

    //append question container to main
    document.getElementById("main").append(questionContainer);

    //relevant answers = the ansIds that correspond to current question
    let relevantAnswersIds = question.ansIds;
    let relevantAnswers = new Array();
    //allanswers = all answers in data model
    let allAnswers = datamodel.data.answers;

    //iterate over relevant answers
    relevantAnswersIds.forEach(relevantAnswerId =>{
        //iterate over all answers
        allAnswers.forEach(answer =>{
            //if current answerid is one of the relevant ids, push it to answer array
            if (relevantAnswerId === answer.aid){
                relevantAnswers.push(answer);
            }
        })
    })
    relevantAnswers.sort(function(a,b){
        return (b.ansDate - a.ansDate);
    })
    relevantAnswers.forEach(answer =>{
        displayAnswer(answer);
    })
    //once all answers are displayed, create the Answer Question button and append it to the last child of main so it shows up on bottom
    let answerQuestionButton = document.createElement("button");
    answerQuestionButton.addEventListener("click", () =>{
        answerQuestion(question);
    })
    answerQuestionButton.innerHTML = "Answer Question";
    answerQuestionButton.className = "answerQuestionButton";
    let childrenOfMain = document.getElementById("main").childNodes;
    childrenOfMain[childrenOfMain.length - 1].appendChild(answerQuestionButton);
}

function clearHomePage(){
    while(document.getElementById("sortingbar").firstChild){
        document.getElementById("sortingbar").removeChild(document.getElementById("sortingbar").firstChild);
    }
    document.getElementById("numquestions").innerHTML = "";
    document.getElementById("questiontitle").innerHTML = "";
}

//takes in an int from getMonth() method in date object and returns corresponding month name
function getMonth(monthNum){
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return month[monthNum];
}
//getMinutes() method in date object returns a single int like (6)
//this method makes it so no matter what the minutes returned are two digits (06 for example)
function formatMinutes(minutes){
    if (minutes < 10)
        return "0"+minutes;
    else
        return minutes;
}

function displayAnswer(answer){
    //setup answer container/box
    let answerBox = document.createElement("div");
    answerBox.className = "answer";

    //setup answer text box
    let answerText = document.createElement("div");
    answerText.className = "answerText";
    answerText.innerHTML = answer.text;

    //setup answer poster
    let answerPoster = document.createElement("div");
    answerPoster.className = "answerPoster";
    answerPoster.innerHTML = answer.ansBy;

    //setup date text
    let answerDate = document.createElement("div");
    answerDate.className = "answerDate";
    answerDate.innerHTML = "answered " + displayDate(answer.ansDate);

    answerBox.append(answerText);
    answerBox.append(answerDate);
    answerBox.append(answerPoster);

    document.getElementById("main").append(answerBox);
    
}

function answerQuestion(question){
    document.getElementById("tagsbutton").style.backgroundColor = "";
    document.getElementById("questionsbutton").style.backgroundColor = "";
    if (answerQuestionPageDisplayed)
        return;

    homePageDisplayed = false;
    tagsDisplayed = false;
    questionsDisplayed = false;
    questionPageDisplayed = false;
    clearHomePage();
    clearQuestions();
    clearAskQuestionButton();

    //Username title
    let usernameTitle = document.createElement("div");
    usernameTitle.innerHTML = "Username*";
    usernameTitle.className = "userNameTitleAnswerPage";

    //Username input box
    let inputAnswerUsername = document.createElement("input");
    inputAnswerUsername.className = "answersUserNameInputBox";
    inputAnswerUsername.placeholder = "Enter Username";
    inputAnswerUsername.id = "answererUsername";

    //Answer text box
    let answerTextBox = document.createElement("div");
    answerTextBox.id = "answerTextBox";
    let aTextTitle = document.createElement("div");
    let aTextInput = document.createElement("textarea");
    aTextTitle.innerHTML = "Answer Text*";
    aTextTitle.className = "aTextTitle";
    aTextInput.placeholder = "Add text";
    aTextInput.className = "answerTextBox";
    aTextInput.id = "aTextInput";
    answerTextBox.append(aTextTitle);
    answerTextBox.append(aTextInput);

    //empty username error
    let errorUserName = document.createElement("div");
    errorUserName.id = "errorUserName";
    errorUserName.className = "userNameError";
    errorUserName.innerHTML = "*what is your username?"
    usernameTitle.append(errorUserName);
    errorUserName.style.display = "none";

    //empty answer text error
    let emptyAnswerError = document.createElement("div");
    emptyAnswerError.id = "emptyAnswerError";
    emptyAnswerError.className = "answerTextError";
    emptyAnswerError.innerHTML = "*please input your answer";
    usernameTitle.append(emptyAnswerError);
    emptyAnswerError.style.display = "none";


    //Answer Question Button
    let answerQuestionButton = document.createElement("button");
    answerQuestionButton.className = "postAnswerButton";
    answerQuestionButton.innerHTML = "Post Answer";

    answerQuestionButton.addEventListener("click", () =>{
        makeAnswer(question);
    });

    //Mandatory field text
    let mandatoryText = document.createElement("div");
    mandatoryText.className = "mandatoryText";
    mandatoryText.innerHTML = "* indicates mandatory fields";


    document.getElementById("answerQuestionPage").append(usernameTitle);
    document.getElementById("answerQuestionPage").append(inputAnswerUsername);
    document.getElementById("answerQuestionPage").append(answerTextBox);
    document.getElementById("answerQuestionPage").append(answerQuestionButton);
    document.getElementById("answerQuestionPage").append(mandatoryText);

    answerQuestionPageDisplayed = true;
}

function clearAskQuestionButton(){
    if (document.getElementById("askQuestionButton")){
        document.getElementById("questionsdisplay").removeChild(document.getElementById("askQuestionButton"));
    }
}

function clearNewAnswerPage(){
    answerQuestionPageDisplayed = false;
    while(document.getElementById("answerQuestionPage").firstChild){
        document.getElementById("answerQuestionPage").removeChild(document.getElementById("answerQuestionPage").firstChild);
    }
}
function makeAnswer(question){
    var answerUserId = document.getElementById("answererUsername");
    var answerTextId = document.getElementById("aTextInput");
    var answerUser = answerUserId.value;
    var answerText = answerTextId.value;
    console.log(answerUser);
    console.log(answerText);
    if (answerUser == ""){
        document.getElementById("errorUserName").style.display = "block";
        return;
    }
    else{
        document.getElementById("errorUserName").style.display = "none";
    }

    if (answerText == ""){
        document.getElementById("emptyAnswerError").style.display = "block";
        return;
    }
    else{
        document.getElementById("emptyAnswerError").style.display = "none";
    }

    datamodel.addAnswer(question, answerText, answerUser);
    clearNewAnswerPage();
    displayClickedQuestion(question);
}

function displayDate(date){
    let currDate = new Date();
    let stringDate = "";

    //check if year nums are equal
    if (date.getFullYear() == currDate.getFullYear()){
        //check if day nums are equal
        if (date.getDate() == currDate.getDate()){
            //check if posted in same minute, if yes display num seconds since post
            if (date.getMinutes() == currDate.getMinutes()){
                let secondsElapsed = currDate.getSeconds() - date.getSeconds();
                stringDate = stringDate + secondsElapsed + " seconds ago";
                return stringDate;
            }
            //if not posted in same minute, check if posted in same hour, if it was, display num minutes since post
            else if (date.getHours() == currDate.getHours()){
                let minutesElapsed = currDate.getMinutes() - date.getMinutes();
                if (minutesElapsed > 0){
                    stringDate = stringDate + minutesElapsed + " minutes ago";
                }
                else{
                    stringDate = stringDate + minutesElapsed + " minute ago";
                }
                return stringDate;
            }
            //if not posted in same hour, display hours since last post, prior if statements already checked if posted on same day and year so no need to check anything here
            else{
                let hoursElapsed = currDate.getHours() - date.getHours();
                stringDate = stringDate + hoursElapsed + " hours ago";
                return stringDate;
            }
        }
        //if days are not equal, display <Month><day> at <hh:min>
        else{
            stringDate = stringDate + getMonth(date.getMonth()) + " " + date.getDate() + " at " + date.getHours() + ":" + date.getMinutes();
            return stringDate;
        }   
    }
    //if years are not equal, display <Month><Day>, <Year> at <hh:min>
    else{
        stringDate = stringDate + getMonth(date.getMonth()) + " " + date.getDate() + ", " + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
        return stringDate;
    }
    
}

function getTagIndices(question){
    let tagIndices = new Array();
    question.tagIds.forEach(tagId =>{
        if (tagId){
            let index = parseInt(tagId.substring(1));
            tagIndices.push(index);
        }
    })
    return tagIndices;
}

//Very similar to displayQuestions(), but has like a filter on it
function searchQ() {
    var searchText = document.getElementById("searchbarid").value;
    if(searchText == "")
        return;
    var possibleStrings = searchText.replaceAll(/\[([^\][]*)]/g, "").replaceAll(/[0-9.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .trim().split(" ").map(string => string.toLowerCase());

    var possibleTags = searchText.match(/\[([^\][]*)]/g);
    var possibleTagIds = [];
    if(possibleTags != null) {
        possibleTags = possibleTags.map(tag => tag.substring(1,tag.length-1).toLowerCase());
        for(let i = 0; i < datamodel.data.tags.length;i++)
            if(possibleTags.includes(datamodel.data.tags[i].name))
                possibleTagIds.push(datamodel.data.tags[i].tid);
    }

    questionsDisplayed = true;
    tagsDisplayed = false;
    let questions = datamodel.data.questions;
    let displayTheQuestion = false;

    document.getElementById("main").innerHTML = "";
    let numquestions = datamodel.data.questions.length;
    questions.forEach(currquestion => {
        displayTheQuestion = false;
        for(let i = 0; i < possibleStrings.length;i++) {//Check if any of the possible strings were in the text/title
            if(possibleStrings[i] !== "" && (currquestion.text.includes(possibleStrings[i]) || currquestion.title.includes(possibleStrings[i])))
                displayTheQuestion = true;
        }
        for(let i = 0; i < possibleTagIds.length;i++){//check if any of the tags are included
            if(currquestion.tagIds.includes(possibleTagIds[i])) 
                displayTheQuestion = true;
        }
        if(displayTheQuestion){
            //create new question "box"/container
            let newquestionbox = document.createElement("div");
            newquestionbox.className = "question";
            newquestionbox.addEventListener("click", () =>{
                displayClickedQuestion(currquestion);
            })
            newquestionbox.style.cursor = "pointer";

            //create new questions and views "box"/container
            let answersViewsBox = document.createElement("div");
            answersViewsBox.className = "answersviewsbox"

            //create the questionTitle section
            let questionTitle = document.createElement("div");
            questionTitle.className = "questionTitle";
            questionTitle.innerHTML = currquestion.title;

            //create answers section
            let questionViews = document.createElement("div");
            questionViews.className = "questionViews";
            questionViews.innerHTML = currquestion.views + " views"

            //create num answers section
            let questionNumAnswers = document.createElement("div");
            questionNumAnswers.className = "questionNumAnswers";
            questionNumAnswers.innerHTML = currquestion.ansIds.length + " answers";

            //create asked/date section
            let questionAsker = document.createElement("div");
            questionAsker.className = "questionAsker";
            questionAsker.innerHTML = currquestion.askedBy + " asked " + displayDate(currquestion.askDate);

            let questionTags = document.createElement("div");
            questionTags.className = "questionTags";

            let relevantTags = getTagIndices(currquestion);
        
            relevantTags.forEach(index =>{
                let homePageTagBox = document.createElement("span");
                homePageTagBox.className = "homePageTagBox";
                let currtag = datamodel.data.tags[index - 1];
                homePageTagBox.innerHTML = currtag.name;
                questionTags.append(homePageTagBox);
            })

            //add the view count and number of answers to the question box
            answersViewsBox.append(questionViews);
            answersViewsBox.append(questionNumAnswers);

            //add the title, 
            newquestionbox.append(questionTitle);
            newquestionbox.append(questionAsker);
            newquestionbox.append(answersViewsBox);
            newquestionbox.append(questionTags);

            //add questionbox to main body
            document.getElementById("main").append(newquestionbox);
        }
        else{
            numquestions--;
        }
    })
    if(numquestions==1)
        document.getElementById("numquestions").innerHTML = numquestions + " question"
    else
        document.getElementById("numquestions").innerHTML = numquestions + " questions"
    //For toggling show and hide of tags and questions
    document.getElementById("questionsdisplay").style.display = "flex";
    document.getElementById("main").style.display = "block";
    document.getElementById("tagsdisplay").style.display = "none";
    document.getElementById("tagsList").innerHTML = "";
    document.getElementById("tagsTitle").innerHTML = "";
    document.getElementById("askQuestionPage").style.display = "none";
    document.getElementById("askQuestionPage").innerHTML = "";
}
