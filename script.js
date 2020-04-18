/* 
########################################
Global variable declarations here
########################################
*/

//global answers array
let answerWords = [];
let correctWords = []; //generates new array with correctly guessed words

//global variable for random letters generated
let letters = "";

//Init score
let score = 0;
let gameRunning = false;

//Page elements
const inputEl = $("#search-bar");
const scoreEl = document.querySelector(".score-display");
const timeEl = document.querySelector(".time-display");
const gifBoxContainer = document.querySelector(".gifCardStorageBox");
const startBtn = document.querySelector(".startBtn");
const preGameEl = document.querySelector(".preGame");
const duringGameEl = document.querySelector(".during-game");
const afterGameModal = $(".modal.after-game");
const playAgainBtn = document.querySelector(".play-again-btn");
const endGameBtn = document.querySelector(".end-game-btn");

const clearBtn = document.querySelector("#clear-btn");


const boggleButtons = $(".boggleButton");

//Modal elements
const finalScoreEl = document.querySelector(".final-score");
const wordsGuessedEl = document.querySelector(".words-guessed");
const wordsUnguessedEl = document.querySelector(".words-unguessed");
const percentGuessedEl = document.querySelector(".percentage-words");
const unguessedWordsEl = document.querySelector(".unguessed-words");

/* 
########################################
Function declarations start here
########################################
*/


//Function to query boggle api and then return answer to global answerwords array
//By Ben
const queryBoggleAPI = (letters) => {

    //Set query URL
    let queryURL = `https://codebox-boggle-v1.p.rapidapi.com/${letters}`;

    //Make api call
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            //Auth headers
            "x-rapidapi-host": "codebox-boggle-v1.p.rapidapi.com",
            "x-rapidapi-key": "022db4a757msh43b4c58fa247ec3p1f954ejsn28f1e76c07fb"
        },
        //Function to run on successful response
        success: (response) => {

            //Testing
            // console.log(response);
            //output.innerText = "";

            //For each word in response array convert to lowercase then push to global answer words array
            response.forEach(word => {
                answerWords.push(word.toLowerCase());

                //Testing
                //output.innerText += word.toLowerCase() + "\n";
            });

            //Testing
            // console.log(answerWords);

        },
        //Function to run on error
        error: (xhr, status, error) => {
            // console.log(`status: ${status}, Error: ${error}`);
        }
    });
}

//Timer object
//By Ben F
const timer = {
    //Default start seconds
    startSecs: 180,
    //Tracks the current
    currSecs: 180,
    increment: 1000,
    timerRunning: false,

    //Start timer Fn
    start: function () {
        //set timer running to true
        this.timerRunning = true;

        //interval function to run until finish
        var intervalFn = setInterval(() => {

            //if the timer is running continue
            if (this.timerRunning) {

                //decrement
                this.currSecs -= 1;

                //Display on page
                this.display();

                //if reached 0 stop timer and call endgame fn
                if (this.currSecs <= 0) {
                    this.timerRunning = false;

                    //call end game events after small delay otherwise display isn't updated
                    setTimeout(endGame, 4);
                }
            } else {
                //if timer is not running clears interval
                clearInterval(intervalFn);
            }
        }, this.increment);
    },

    //stop timer function
    stop: function () {
        this.timerRunning = false;
    },

    //reset timer function
    reset: function (seconds = this.startSecs) {
        this.startSecs = seconds;
        this.currSecs = this.startSecs;
        this.display();
    },

    //Fn to display secs to page
    display: function () {
        // console.log(this.currSecs);
        let mins = Math.floor(this.currSecs / 60);
        let secs = this.currSecs % 60;
        secs = secs < 10 ? "0" + secs : secs;
        formattedString = mins + ":" + secs;

        // timeEl.innerText = this.currSecs;
        timeEl.innerText = formattedString;
    }
}

// creating a function for start button and to reveal boggle containers
//By Nima
const startGame = (event) => {
    preGameEl.classList.add("hidden");
    duringGameEl.classList.remove("hidden");
    //Starting page: instruction page to be hidden
    // startpage.classList.add("hidden");
    letters = randomLetterGenerator();
    score = 0;
    scoreEl.innerText = 0;
    gifBoxContainer.innerHTML = "";
    correctWords = [];
    timer.reset();
    queryBoggleAPI(letters);
    BoggleBlocks(letters);
    timer.start();
    gameRunning = true;
};

//Generates letters used in boggle from availble letters
//By Claire
const randomLetterGenerator = () => {
    var boggleCombinations = ["AAEEGN", "ELRTTY", "AOOTTW", "ABBJOO", "EHRTVW", "CIMOTU", "DISTTY", "EIOSST", "DELRVY", "ACHOPS", "HIMNQU", "EEINSU", "EEGHNW", "AFFKPS", "HLNNRZ", "DEILRX"];

    //Choose a random string from the array
    var randomLetters = "";

    //Generate 0 to 16. runs for loop 16 times. 
    for (let i = 0; i < 16; i++) {

        //picks string from 1- 16 (different dice)
        var randomIndex = Math.floor(Math.random() * boggleCombinations.length);

        //pulls out string. set to current string.
        var currentString = boggleCombinations[randomIndex];

        // random letter from string between 0-5. Saved to letter variable 
        var letter = currentString[Math.floor(Math.random() * currentString.length)];
        //console.log(letter);

        //append letter onto random letter string. 
        randomLetters += letter;

        //remove from array
        boggleCombinations.splice(randomIndex, 1)
        //console.log(boggleCombinations)
    };
    // console.log(randomLetters);
    //return the string.
    return randomLetters;
}

//Function that fills page elements with letters passed into it
//By Claire
const BoggleBlocks = (letters) => {

    for (let i = 0; i < 16; i++) {
        let boggleCube = document.getElementById(`boggleBox${i}`);
        // console.log(boggleCube);

        let letter = letters[i];

        if (letter == "Q") {
            letter = "QU";
        }
        // console.log(letter);
        boggleCube.innerText = letter;
    }
}



//End the Game function
//By Ben F
const endGame = () => {
    timer.stop();
    gameRunning = false;

    //Fill modal elements
    finalScoreEl.innerText = score;
    wordsGuessedEl.innerText = correctWords.length;
    wordsUnguessedEl.innerText = answerWords.length;
    percentGuessedEl.innerText = Math.round((correctWords.length / (answerWords.length + correctWords.length)) * 100) + "%";

    unguessedWordsEl.innerHTML = "";
    answerWords.forEach(word => {
        unguessedWordsEl.innerHTML += `<p>${word.toUpperCase()}</p>`
    })

    afterGameModal.modal({
        onHide: () => {
            duringGameEl.classList.add("hidden");
            preGameEl.classList.remove("hidden");
        }
    }).modal("show");
}

//Function to remove guessed words from available words
//By Ben C
//Creates new array with correctly guessed words removed - also creates a new array of corect words
function remove(enteredWord) {
    let index = answerWords.indexOf(enteredWord);
    // console.log(index);
    if (index !== -1) {
        answerWords.splice(index, 1);
        correctWords.push(enteredWord);
    }
}

//Input Validator
//By Ben C
const validateInput = (event) => {

    if (!gameRunning) {
        return;
    }
    // console.log("Test");
    let enteredWord = inputEl.val().toLowerCase();

    // console.log("before", answerWords.length);

    if (answerWords.includes(enteredWord)) {
        remove(enteredWord);

        // console.log("after", answerWords.length);
        // console.log(enteredWord);
        inputEl.val("");
        createCard(enteredWord);

        //Increase score
        let wordScore = 0;
        let wordlength = enteredWord.length;

        if (wordlength < 3) {
            wordScore = 0;
        } else if (wordlength < 4) { // 3
            wordScore = 1;
        } else if (wordlength < 5) { // 4
            wordScore = 2;
        } else if (wordlength < 6) { // 5
            wordScore = 3;
        } else if (wordlength < 7) { // 6
            wordScore = 4;
        } else if (wordlength < 8) { // 7
            wordScore = 5;
        } else {
            wordScore = 6;
        }
        score += wordScore;
        scoreEl.innerText = score;
    }
}


//Create cards with Gifs and word in them
//By Ben F and Claire
const createCard = (word) => {

    //note that the variable (and the output from the boggle is called "word")
    var queryURL = `https://api.giphy.com/v1/gifs/search?q=${word}&limit=1&rating=g&api_key=kqQyG8Y7gjqsyjEcFmZd3qBhbj2KBn5i`;

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {
            // console.log(response);

            let gifURL = response.data[0].images.original.url ? response.data[0].images.original.url : "https://media3.giphy.com/media/xNBcChLQt7s9a/giphy.gif?cid=ecf05e47dded58718835a05dcae59e8c6c0ac476f4903097&rid=giphy.gif";
            let wordTitle = word.toUpperCase();

            let cardHTML = `
                <div class="six wide mobile five wide tablet four wide computer column">
                <div class="ui fluid card gifCard">
                                                <div >
                                                <img class="ui image"
                                                src="${gifURL}">
                                                </div>
                                                <div class="content">
                                                    <h3 class="header">${wordTitle}</h3>
                                                </div>
                                                </div>
                                        </div>
                                        `

            let currentHTML = gifBoxContainer.innerHTML;
            let newHtml = cardHTML + currentHTML;

            gifBoxContainer.innerHTML = newHtml;

        });
    // console.log(word);
    // console.log("Create card for word " + word);
}

//Function to run when play again btn clicked
//By Ben F
const playAgain = (event) => {
    afterGameModal.modal("hide");
    duringGameEl.classList.add("hidden");
    preGameEl.classList.remove("hidden");
}

//Function to print out all available words for testing, only meant to be typed into console
//By Ben F
const godMode = () => {
    console.table(answerWords);
}





/* 
########################################
Code to run on page load
########################################
*/



/* 
########################################
Event Listeners here
########################################
*/
inputEl.on("keyup", validateInput);

startBtn.addEventListener("click", startGame);

playAgainBtn.addEventListener("click", playAgain);

endGameBtn.addEventListener("click", endGame);

boggleButtons.on("click", function() {
    let clickedLetter = $(this).text();

    inputEl.val(inputEl.val() + clickedLetter);
    validateInput();
});

clearBtn.addEventListener("click", () => {
    inputEl.val("");
})