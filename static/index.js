var cells = document.querySelectorAll(".cell");
var statusText = document.querySelector("#statusText");
var restartBtn = document.querySelector("#restartBtn");
var playerXInput = document.getElementById("playerx")
var playerOInput =document.getElementById("playerO")
var submitBtn = document.getElementById("sumbitButton")
var resetname = document.getElementById("ResetButton")
let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winnerboxes')
var playerxname = " Player X"
var playerOName = "Player O"
playersarray = []
var selectedplayer = playerxname
var url = "/wins/update"
fetch('../scores.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
var winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame(); //Starts Game

function initializeGame(){ //Goes through and updates each click/looks for winner
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${playerxname}'s turn`;
    running = true;
}
function cellClicked(){
    var cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}
function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}
function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    selectedplayer = (selectedplayer == playerxname) ? playerOName : playerxname;
    statusText.textContent = `${selectedplayer}'s turn`;
}
function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        var condition = winConditions[i];
        var cellA = options[condition[0]];
        var cellB = options[condition[1]];
        var cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            condition.forEach(index => {
                cells[index].style.backgroundColor = winnerIndicator;}); //Changes background color win won 
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${selectedplayer} wins!`;

        if (currentPlayer === "X"){
                console.log("array before",playersarray)
                // Get the index of the name in the bigArray and directly update the score
                const index = playersarray.findIndex(item => item[0] === playerxname);
                // Directly increment the score at the found index without checking its validity
                playersarray[index][1]++;
                console.log(playersarray[index][1])
                fetch(url, {
                    method: "POST",
                    body: JSON.stringify({
                      name: playersarray[index][0],
                      wins: playersarray[index][1]
                    }),
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }).then(response => {
                    if (response.ok) {
                        console.log("Score added successfully!");
                        // After POST, call fetch to get updated data
                        return fetch("/leaderboard");
                    } else {
                        throw new Error("Failed to add score.");
                    }
                })
                
                
            
        }else{
                // Get the index of the name in the bigArray and directly update the score
                const index = playersarray.findIndex(item => item[0] === playerOName);
            
                // Directly increment the score at the found index without checking its validity
                playersarray[index][1]++;
                fetch(url, {
                    method: "POST",
                    body: JSON.stringify({
                        name: playersarray[index][0],
                        wins: playersarray[index][1]
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (res) {
                    var leaderboardTemplate = Handlebars.templates.leaderboard
                    var leaderboardupdate = leaderboardTemplate({
                        name: playersarray[index][0],
                        wins: playersarray[index][1]
                    }) 
                }
            )

        running = false;
    }}
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}
function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${selectedplayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.backgroundColor = ""; 
    });
    running = true;
}
// Grabs value of Name X
playerXInput.addEventListener('change', function () { 
    playerxname = playerXInput.value
    selectedplayer = playerxname
    if (!playersarray.some(item => item[0] === playerxname)) {
        // If the name doesn't exist, add it to the big array with score 0
       playersarray.push([playerxname, 0]);
    restartGame()
        // Check if the name already exists in bigArray

}})
// Grabs value of Name O
playerOInput.addEventListener('change', function () {
    playerOName = playerOInput.value
    
        // Check if the name already exists in bigArray
        if (!playersarray.some(item => item[0] === playerOName)) {
            // If the name doesn't exist, add it to the big array with score 0
            playersarray.push([playerOName, 0]);
       
}})
// Checks if both names are filled in
submitBtn.addEventListener('click', function () {
    if (playerxname === "" || playerOname === "") {
        alert("Both player names must be filled out!");
}})
// Resets names when clicked
resetname.addEventListener("click",function(){
    playerxname = ""
    playerOName = ""
    playerXInput.value = "";
    playerOInput.value = "";
})

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode')
    console.log("hihi")
}