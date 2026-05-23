

document.addEventListener('DOMContentLoaded', () => {

    // Forcing user to go through the home screen
    if (!localStorage.getItem('visitedIndex'))
    {
        window.location.href = 'index.html';
        localStorage.setItem('visitedIndex', true);
    }
    else{
        localStorage.removeItem('visitedIndex');
    }
    
    let highScores = JSON.parse(localStorage.getItem('highScores'));
    let highNames = JSON.parse(localStorage.getItem('highNames'));

    const scoreList = document.querySelectorAll('#high-scores span');

    for (let i = 0; i < highScores.length; i++)
    {
        scoreList[i].textContent = String((i+1)) + ". "+ highNames[i] +": "+ highScores[i];
    }
});


