var questions = [];
createQuestions();

function showPage(pageNumber) {
    if (pageNumber === parseInt(pageNumber)) {
        if (pageNumber == 0 || checkPlayerAnswer(pageNumber)) {
            if (!document.getElementById("page-" + pageNumber.toString())) { //only create page if it does not allready exist
                generateQuestionHtml(pageNumber);
            }
            hidePages(pageNumber);
        }
    }
    else {
        if (pageNumber == "init") {
            resetQuiz(pageNumber);
        }
        if (pageNumber == "end") {
            if (checkPlayerAnswer(pageNumber)) {
                finishTest();
                hidePages(pageNumber);
            }
        }
    }
}

function resetQuiz(pageNumber) {
    document.getElementById("solution").innerHTML = "";
    clearPlayerAnswers();
    hidePages(pageNumber);
}

function generateQuestionHtml(currentPageNumber) {
    var question = questions[currentPageNumber];
    var nextPageNumber = parseInt(currentPageNumber) + parseInt(1);
    var previousPageNumber = parseInt(currentPageNumber) - parseInt(1);

    var pagesDiv = document.getElementById("pages");

    //add wrapper DIV
    var pageDiv = document.createElement("div");
    pageDiv.id = "page-" + currentPageNumber.toString();
    pageDiv.className = "questions";
    pageDiv.innerHTML = "Fråga " + nextPageNumber.toString();

    //add question DIV
    var questionDiv = document.createElement("div");
    questionDiv.id = "question" + currentPageNumber;
    questionDiv.innerText = question.question;
    pageDiv.appendChild(questionDiv);


    //add radiobuttons
    var alternatives = question.alternatives;
    var i = 0;
    for (const [key, value] of Object.entries(alternatives)) {
        //key is the letter
        //value is the answer in text

        var radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.id = "rdbtn" + currentPageNumber.toString() + i.toString();
        radioButton.setAttribute("name", "answer" + currentPageNumber);
        radioButton.value = key;

        var radioButtonLabel = document.createElement("label");
        radioButtonLabel.innerText = key + ": " + value;

        pageDiv.appendChild(radioButton);
        pageDiv.appendChild(radioButtonLabel);
        pageDiv.appendChild(document.createElement("br"));

        i++;
    }

    //add buttons
    var buttonDiv = document.createElement("div");
    var buttonNext = document.createElement("button");

    buttonNext.setAttribute("class", "btn btn-primary"); // add class

    var nextBtnValue = questions.length === nextPageNumber
        ? "end"
        : nextPageNumber;
    var nextBtnText = questions.length === nextPageNumber
        ? "FINISH"
        : "NEXT";

    buttonNext.onclick = function () { showPage(nextBtnValue); };
    buttonNext.innerText = nextBtnText;

    var previousBtnValue = currentPageNumber === 0
        ? "init"
        : previousPageNumber;


    var buttonBack = document.createElement("button");
    buttonBack.onclick = function () { showPage(previousBtnValue) }
    buttonBack.innerText = "BACK";

    buttonBack.setAttribute("class", "btn btn-secondary"); // add class

    buttonDiv.appendChild(buttonNext);
    buttonDiv.appendChild(buttonBack);
    pageDiv.appendChild(buttonDiv);


    pagesDiv.appendChild(pageDiv);
}

function clearPlayerAnswers() {
    for (var i = 0; i < questions.length; i++) {
        questions[i].playerAnswer = "";
    }
    var radios = document.getElementsByTagName("input");
    for (var i = 0; i < radios.length; i++) { //Iterates through all the radiobuttons and clear all checked radiobuttons.
        if (radios[i].type === 'radio' && radios[i].checked) {
            radios[i].checked = false;
        }
    }
}

function finishTest() {
    //Check player answer and present how many correct answers the player has (ie: 4/5 correct answers 80%)
    var result = 0;

    for (var i = 0; i < questions.length; i++) {
        if (questions[i].playerAnswer === questions[i].correctAnswer) {
            result++;
        }
    }
    document.getElementById("result").innerText = "Du hade " + result + " rätt av " + questions.length;
}

function checkPlayerAnswer(pageNumber) {
    // checks if player has chosen an answer

    pageNumber = pageNumber === "end" // necessary to check the player answer on the last question
        ? questions.length
        : pageNumber;

    var currentPageNumber = pageNumber - 1;
    var groupName = "answer" + currentPageNumber;

    var radios = document.getElementsByName(groupName);
    var playerAnswer = "";

    for (var i = 0; i < radios.length; i++) { //Iterates through all the radiobuttons to see if the player has chosen one
        if (radios[i].type === 'radio' && radios[i].checked) {
            playerAnswer = radios[i].value;

            questions[currentPageNumber].playerAnswer = playerAnswer; // We want to check the answer for this page, not the next one             
        }
    }

    if ((pageNumber > 0) && (playerAnswer == "")) //if the player hasnt answered, show modal and return false
    {
        var modal = document.getElementById("errorModal");
        modal.style.display = "block";

        return false;
    }
    else {
        return true;
    }
}

function hidePages(pageNumber) {

    var children = document.getElementById("pages").children;
    for (var i = 0; i < children.length; i++) {
        var childId = "#" + children[i].id;
        document.querySelector(childId).style.display = "none";
    }
    var pageId = "#page-" + pageNumber;
    document.querySelector(pageId).style.display = "";

}

function getAnswerTextByLetter(letter, alternatives) {
    for (const [key, value] of Object.entries(alternatives)) {
        //key is the letter
        //value is the answer in text
        if (key === letter) {
            return value;
        }
    }
}

function showSolution() {
    var solutions = "";

    for (i = 0; i < questions.length; i++) {
        var alternatives = questions[i].alternatives;
        var correctAnswer = questions[i].correctAnswer;
        var answertext = getAnswerTextByLetter(correctAnswer, alternatives);
        var playerAnswer = questions[i].playerAnswer;
        var playerAnswerText = "Du svarade " + playerAnswer + ": " + getAnswerTextByLetter(playerAnswer, alternatives);

        var cssClass = correctAnswer === playerAnswer
            ? "greenText"
            : "redText";

        var playerAnswerDiv = "<div class='" + cssClass + "'>" + playerAnswerText + "</div>";

        solutions += "Fråga " + (parseInt(i) + parseInt(1)).toString() + "<br>" + questions[i].question + "<br>" + correctAnswer + ": " + answertext + "<br>" + playerAnswerDiv + "<br>";
    }
    document.getElementById("solution").innerHTML = solutions;
}

function createQuestions() {
    questions = [
        {
            question: "Vilken grupp var först med att besöka Amerika?",
            alternatives: {
                A: "Européer",
                B: "Vikingar",
                C: "Afrikaner",
                D: "Asiater"
            },
            correctAnswer: "D",
            playerAnswer: ""
        },
        {
            question: "Hur stor del av jordens befolkning bor på norra halvklotet?",
            alternatives: {
                A: "30 procent",
                B: "50 procent",
                C: "70 procent",
                D: "90 procent"
            },
            correctAnswer: "D",
            playerAnswer: ""
        },
        {
            question: "Hur många tidszoner finns det i Ryssland?",
            alternatives: {
                A: "3",
                B: "7",
                C: "11",
                D: "22"
            },
            correctAnswer: "C",
            playerAnswer: ""
        }
    ];
}



