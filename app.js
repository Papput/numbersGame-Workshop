"use strict"
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app);
});

/*
*
*Steg 1
* Gissa talet
* sätt ett tal i en variabel. Be användaren gissa talet. Om det är fel, fråga igen. Om det är rätt, visa en alert med ett grattis-meddelande
*Om användaren skriver talet 0 så sak spelet vara slut
* promt
* While()
*
* Steg 1.5
*Berätta för användaren om gissningen är för hög eller låg
* 
*
* Steg 2 
* Slumpa talet så användaren inte gissar rätt varje gång
* Math.random
*
*
* Steg 3
* Spara ner hur många gissningar som krävdes. visa antalet gissningar när användaren gissat rätt
*
* Steg 4 
* Efter man gissat rätt så slumpas ett nytt tal fram och spelet startar igen.
* Spara en "Highscore", dvs hur få gånger som krävts för att gissa rätt.
*
* Om användaren gissar rätt på fler visa 'Tyvärr du gissade rätt efter X antal försök men din HighScore är y'
* 
* Om användaren gissar rätt på färre gånger visa 'Grattis nytt Highscore x!'
*
*/

const popupWrapper = document.querySelector('.popupWrapper');
const CLOSE = document.querySelector('.popupClose');
const BUTTON_GROUP = document.querySelector('.btn-group-lg');
const TABLE = document.querySelector('#highScore');
const NAME_INPUT = document.querySelector('#input_name');

const FORM = document.querySelector('.form_gues');
const GUES = document.querySelector('#gues');
const HIGHSCORE_P = document.querySelector('.highScore p');

let highScore = ''
let currentDifficulty = "easy"
let gameMessage = ''
let number;
let userGues = '';
let tries;
let preFill = '1-10';
let highScoreArray = [];


let lable = document.querySelector('#lable_gues');

let player = {
    name: 'guest',
    tries: ''
}

if(highScoreArray[0]) {
    highScore = highScoreArray[0].tries;
}



// Sets Number to a random number depending on currentDifficulty
const getNumber = () => {
    switch(currentDifficulty) {
        case 'easy':
            number = Math.floor(Math.random() * 10 + 1);
            break;
        
        case 'medium':
            number = Math.floor(Math.random() * 100 + 1);
            break;
        
        case 'hard':
            number = Math.floor(Math.random() * 1000 + 1);
            break;
        
        default:
            number = Math.floor(Math.random() * 10 + 1);
            break;
    }
    console.log(number);
}

// Sets currentDifficulty if no value is given or invalid value, game will be set to easy
const difficulty = (chosenDifficulty) => {
    switch(chosenDifficulty) {
        case 'easy':
            currentDifficulty = 'easy';
            break;
        
        case 'medium':
            currentDifficulty = 'medium';
            break;
        
        case 'hard':
            currentDifficulty = 'hard';
            break;
        
        default:
            currentDifficulty = 'easy';
            break;
    }
}

//Gets currentDifficulty and sets the relevant gameMessage 
const getCurrentGameDiffuculty = () => {
    switch(currentDifficulty) {
        case 'easy':
            gameMessage = 'Gues the number from 1-10';
            preFill = '1-10';
            break;

        case 'medium':
            gameMessage = 'Gues the number from 1-100';
            preFill = '1-100';
            break;

        case 'hard':
            gameMessage = 'Gues the number from 1-1000';
            preFill = '1-1000';
            break;
        
    }
}



const initGame = () => {
    tries = 0;
    userGues = '';
    
    //Gets currentDifficulty and sets the relevant gameMessage 
    getCurrentGameDiffuculty();

    // Sets Number to a random number depending on currentDifficulty
    getNumber();

    renderGame();
    loadHighScores();
    setHighScore();
    saveHighScores();
}

const renderGame = () => {
    lable.textContent = `${gameMessage}`;
    GUES.placeholder = preFill;
    console.log(GUES);
    GUES.value = '';

}

const highScoreAnimation = () => {
    console.log('wopwop');
    const TOP_SCORE = document.querySelector('tbody tr');
    TOP_SCORE.classList.add('newHighScore');
}

const saveHighScores = () => {
    if(window.localStorage){
        let JSONhighScoreArray = JSON.stringify(highScoreArray);
        console.log(JSONhighScoreArray, 'saved');
        localStorage.setItem(`highScore_${currentDifficulty}`, JSONhighScoreArray);
    }
}

const loadHighScores = () => {
    if(currentDifficulty == 'easy') {
        if(window.localStorage.highScoreeasy) {
            let loadedData = JSON.parse(localStorage.getItem(`highScore${currentDifficulty}`));
            highScoreArray = loadedData;
            console.log(loadedData, 'loaded')
        }
    } else if(currentDifficulty == 'medium'){ 
        if(window.localStorage.highScoremedium) {
            let loadedData = JSON.parse(localStorage.getItem(`highScore${currentDifficulty}`));
            highScoreArray = loadedData;
            console.log(loadedData, 'loaded')
        }
    } else if(currentDifficulty == 'hard'){ 
        if(window.localStorage.highScorehard) {
            let loadedData = JSON.parse(localStorage.getItem(`highScore${currentDifficulty}`));
            highScoreArray = loadedData;
            console.log(loadedData, 'loaded')
        }
    }
}

const highLow = (gues) => {

    if(gues > number) {
        gameMessage = `${userGues} is to high!`
    } else if(gues < number) {
        gameMessage = `${userGues} is to low!`
    } else if(gues == number) {
        gameMessage = `${userGues} is correct! WoW GGWP`
        if( highScore > player.tries || !highScore) {
            if(tries == 1) {
                HIGHSCORE_P.textContent = `NEW HIGHSCORE!! 🥳 of ${tries} trie.`
                initGame();
                highScoreAnimation();
            } else {
                HIGHSCORE_P.textContent = `NEW HIGHSCORE!! 🥳 of ${tries} tries.`
                initGame();
                highScoreAnimation();
            }
        } else {
            HIGHSCORE_P.textContent = `It took ${tries} tries.`
            initGame();
        }
    }
}



const setHighScore = () => {
    const HIGH_SCORE_TABLE = document.querySelector('#tableBody');
    
    let highScoreHTML = '';
    //player.high_Score = tries;

    // concat current players score if player have played
    if (player.tries) {
        highScoreArray = highScoreArray.concat([{
            name: player.name,
            tries: player.tries 
        }])
    }
    //sorts highscore by number
    highScoreArray = highScoreArray.sort((a, b) => {
        return a.tries - b.tries;
    })
    highScoreArray.slice(0, 10).forEach((player, index) => {
        index = index + 1;
        highScoreHTML += `<tr>
                <th scope="row">${index}</th>
                <td>${player.tries}</td>
                <td>${player.name}</td>
            </tr>`
        
    }); 

    console.log(highScoreArray);
    if(highScoreArray.length > 0) {
        highScore = highScoreArray[0].tries;
    }
    //clears highscores before setting
    HIGH_SCORE_TABLE.innerHTML = '';
    //sets highscore
    HIGH_SCORE_TABLE.innerHTML = highScoreHTML;
}


CLOSE.addEventListener('click', (e) => {
    e.stopPropagation();
    if(NAME_INPUT.value) {
        player.name = NAME_INPUT.value;
    }
    popupWrapper.style.display = 'none';
    FORM.style.display = 'block';
    TABLE.style.display = 'block';
    console.log('close event');
    initGame();
}, false);

popupWrapper.addEventListener('click', (e) => {
    if(e.target.id == 'input_name') {
        e.stopPropagation();
        console.log('name field clicked');
        return;
    }
    // if(NAME_INPUT.value) {
    //     player.name = NAME_INPUT.value;
    // }
    // popupWrapper.style.display = 'none';
    // FORM.style.display = 'block';
    // TABLE.style.display = 'block';
    
    // initGame();
}, false);

document.querySelector('#form_name').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('submit stoped');
}, false)

BUTTON_GROUP.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(NAME_INPUT.value) {
        player.name = NAME_INPUT.value;
    }
    popupWrapper.style.display = 'none';
    FORM.style.display = 'block';
    TABLE.style.display = 'block';
    //asks the user to chose a difficulty, if no or inalid difficulty is chosen game will be set to easy
    difficulty(e.target.textContent.toLowerCase());
    console.log('Button event');
    initGame();

}, false);


FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    userGues = GUES.value;
    tries++;
    player.tries = tries;
    HIGHSCORE_P.textContent = '';

    highLow(userGues);

    renderGame();
}, false);


let nameString = 'Gunnar';

console.log(nameString.prototype);