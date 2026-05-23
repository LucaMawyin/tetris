
document.addEventListener('DOMContentLoaded', function() {

    // Forcing user to go through the home screen
    if (!localStorage.getItem('visitedIndex'))
    {
        window.location.href = 'index.html';
        localStorage.setItem('visitedIndex', true);
    }
    else{
        localStorage.removeItem('visitedIndex');
    }

    // Getting values
    let currentStep = 0;
    const steps = document.querySelectorAll('.content');
    const nextBtn = document.querySelectorAll('.nextBtn');
    const backBtn = document.querySelectorAll('.backBtn');

    // Setting each div to invis except for first one
    for (let i = 0; i< steps.length; i++) {
        steps[i].style.display = 'none';
    }
    steps[currentStep].style.display = 'block';

    nextBtn.forEach(btn => {
        btn.addEventListener('click', function(e) {
            nextStep();
        });
    });

    backBtn.forEach(btn => { 
        btn.addEventListener('click', function(e) {
            lastStep();
        });
    });

    function nextStep() {
        steps[currentStep].style.display = 'none';
        currentStep++;
        steps[currentStep].style.display = 'block';
    }
    
    function lastStep() {
        steps[currentStep].style.display = 'none';
        currentStep--;
        steps[currentStep].style.display = 'block';
    }
});

