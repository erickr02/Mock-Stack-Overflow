export default class Model {
  constructor() {
    this.data = {
      questions: [
                  {
                    qid: 'q1',
                    title: 'Programmatically navigate using React router',
                    text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
                    tagIds: ['t1', 't2'],
                    askedBy : 'JoJi John',
                    askDate: new Date('December 17, 2020 03:24:00'),
                    ansIds: ['a1', 'a2'],
                    views: 10,
                  },
                  {
                    qid: 'q2',
                    title: 'android studio save string shared preference, start activity and load the saved string',
                    text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
                    tagIds: ['t3', 't4', 't2'],
                    askedBy : 'saltyPeter',
                    askDate: new Date('January 01, 2022 21:06:12'),
                    ansIds: ['a3', 'a4', 'a5'],
                    views: 121,
                  },
                ],
      tags: [
        {
          tid: 't1',
          name: 'react',
        },
        {
          tid: 't2',
          name: 'javascript',
        },
        {
          tid: 't3',
          name: 'android-studio',
        },
        {
          tid: 't4',
          name: 'shared-preferences',
        }
      ],

      answers: [
        {
          aid: 'a1',
          text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
          ansBy: 'hamkalo',
          ansDate: new Date('March 02, 2022 15:30:00'),
        },
        {
          aid: 'a2',
          text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
          ansBy: 'azad',
          ansDate: new Date('January 31, 2022 15:30:00'),
        },
        {
          aid: 'a3',
          text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
          ansBy: 'abaya',
          ansDate: new Date('April 21, 2022 15:25:22'),
        },
        {
          aid: 'a4',
          text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
          ansBy: 'alia',
          ansDate: new Date('December 02, 2022 02:20:59'),
        },
        {
          aid: 'a5',
          text: 'I just found all the above examples just too confusing, so I wrote my own. ',
          ansBy: 'sana',
          ansDate: new Date('December 31, 2022 20:20:59'),
        }
      ]
    };
  }

  //take each question, compare time asked and put most recently asked in front
  //this should be default when the website is loaded
  sortByNewest(){
    this.data.questions.sort(function(a,b){
      return (b.askDate - a.askDate)});
  }

  
  //take each question, get its array of answers, use pop to get last ansId bc it should be most recent
  //use getTime and subtract them to put most recently answered in front
  sortByActive(){
    //store questions and answers in variables to use in for loop
    let questions = this.data.questions;
    let answers = this.data.answers;

    questions.sort(function(a,b){
      if (a.ansIds.length > 0 && b.ansIds.length > 0){
        //store most recent answer id
        let aid1 = a.ansIds.slice(-1);
        let aid2 = b.ansIds.slice(-1);

        //aid1 is an array whose only element is the ansId, so index 0 to get the id
        //split the id at "a" char, this results in an array consisting of "" and a number
        //index 1 in order to access the number, this number is the answer number
        //subtract by one in order to get index of question in the answers array
        let index1 = aid1[0].split("a")[1] - 1;
        let index2 = aid2[0].split("a")[1] - 1;

        //access the answer using the index above and get the answer date
        let date1 = answers[index1].ansDate;
        let date2 = answers[index2].ansDate;

        return date2.getTime() - date1.getTime();
      }
      //handle the case where a question has no answers, using the case above would cause aid1 to be undefined leading to function not working
      else if (a.ansIds.length == 0){
        return 1;
      }
      else if (b.ansIds.length == 0){
        return -1;
      }
      else{
        return 0;
      }

    });
  }

  //take each question and compare its ansId's array length to get num answers, smallest num answers will be first
  sortByUnanswered(){
    let unansweredQuestions = this.data.questions.filter(this.checkEmpty);
    return unansweredQuestions;
  }

  checkEmpty(question){
    return question.ansIds.length == 0;
  }
  //takes what the user puts in the search bar and searches all questions for it
  searchQuestions(searchQuery) {
    let allQuestions = this.data.questions;
    const searchQuerySplit = searchQuery.split(" ");
  }

  //add question to question array when new question is asked
  addQuestion(title, text, tags, username){
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    typeof(this.data.questions);
    var questionId = "q"+ (this.data.questions.length + 1);
    var titleId = title;
    var textId = text;
    var user = username;
    var date = new Date();
    var dateString = month[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    
    // Update tags if there are new tags and put them inside of the data model
    var tagsId = tags.split(" ");//tags from the text box
    tagsId = tagsId.map(tag => tag.toLowerCase());
    var tidarr = []; //final array after processing
    
    var containedKeys = []; //will be array with all the current tag names
    for (let i = 0; i < this.data.tags.length; i++){
      containedKeys[i] = this.data.tags[i]["name"];
    }
    for (let i = 0; i < tagsId.length; i++){
      if(!containedKeys.includes(tagsId[i]))//if one of our tags is not inside the list of current ones, put it in the list.
        this.data.tags.push({"tid":"t"+(this.data.tags.length+1),"name":tagsId[i]});
    }
    for(let i = 0; i < this.data.tags.length;i++) {
      if(tagsId.includes(this.data.tags[i].name))
        tidarr.push(this.data.tags[i].tid);
    }
    this.data.questions.push({'qid':questionId,'title':titleId,'text':textId,
    'tagIds':tidarr,'askedBy':user,'askDate':new Date(dateString),'ansIds':[],'views':0});

  }

  //get all questions in this.data
  getAllQuestions(){
    return this.data.questions;
  }
  
  //increase num views when question is clicked
  incrementViews(question){
    question.views++;
  }

  //function that returns all of a specific question's answers
  getAllAnswers(question){
    return question.answers;
  }

  subtractDates(date1, date2){
    var difference = Math.abs(date1 - date2);
    return difference;
  }

  sortAnswersByNewest(){
    this.data.answers.sort(function(a,b) {
      return (b.ansDate - a.ansDate);
    })
  }
  addAnswer(question, answerText, answeredBy, dateString){
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var answerId = "a" + (this.data.answers.length + 1);
    var textId = answerText;
    var userId = answeredBy;
    question.ansIds.push(answerId);

    this.data.answers.push({'aid': answerId, 'text': textId, 'ansBy': userId, 'ansDate': new Date()});
  }
  getTag(index){
    return this.data.tags[index].name;
  }
  // add methods to query, insert, and update the model here. E.g.,
  // getAllQstns() {
  //   return this.data.questions;
  // }
}
