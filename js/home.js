
// Forcing user to home screen
document.addEventListener('DOMContentLoaded', () => {

    // Default keybinds
    const defaultBind = {
        left: "a",
        right: "d",
        down: "s",
        hard: "w",
        clockwise: "arrowup",
        counterClockwise: "arrowdown",
    };

    // Sets default settings if none exist
    if (!localStorage.getItem('binds')) localStorage.setItem("binds", JSON.stringify(defaultBind));
    if (!localStorage.getItem('colour')) localStorage.setItem("colour", "#000000");

    // Greenlighting user to play game
    localStorage.setItem('visitedIndex',true);

    // Setting default leaderboard
    setLeaderboard();

    // Allow user to press enter to start
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key === 'Enter'){
            play(event);
        }
    });
    
    // Only letting user play game if they enter initials
    const playBtn = document.getElementById('play-btn');
    
    playBtn.addEventListener('click', (event)=>{
        play(event);
    });

});

// Only allow user to enter letters for initials
// Initials can be repeated
function lettersOnly(input) {
    input.value = input.value.replace(/[^a-zA-Z]/g, '');
}

// Start game
function play(event){
    const initials = document.getElementById("player-init");
    const alertMsg = document.getElementById("alert-box");

    // Only allow user to play game if they enter initials
    if (initials.value === ""){
        alertMsg.showModal();
        event.preventDefault();
    }
    else{
        localStorage.setItem("player", initials.value);
        initials.value = "";
        window.location.href = "tetris.html"
    }

    document.querySelector('#alert-box button').addEventListener('click', () =>{
        alertMsg.close();
    });
}

// Set default leaderboard
function setLeaderboard(){

    // Set default high scores and names on load if none exist
    if (!localStorage.getItem('highScores') || !localStorage.getItem('highNames')){
        let defaultScores = [1000,900,800,700,600,500,400,300,200,100];
        let defaultNames = ["","","","","","","","","",""];
        localStorage.setItem('highScores', JSON.stringify(defaultScores));
        localStorage.setItem('highNames', JSON.stringify(defaultNames));
    }
}