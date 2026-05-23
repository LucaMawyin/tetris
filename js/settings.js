
// Default keybinds
const defaultBind = {
    left: "a",
    right: "d",
    down: "s",
    hard: "w",
    clockwise: "arrowup",
    counterClockwise: "arrowdown",
};

let bkgClr = document.getElementById("backgroundColour");

document.addEventListener('DOMContentLoaded',()=>{

    // Forcing user to go through the home screen
    if (!localStorage.getItem('visitedIndex'))
    {
        window.location.href = 'index.html';
        localStorage.setItem('visitedIndex', true);
    }
    else{
        localStorage.removeItem('visitedIndex');
    }

    // Loading up keybinds
    let binds = JSON.parse(localStorage.getItem("binds"));

    document.getElementById("left").value = binds.left;
    document.getElementById("right").value = binds.right;
    document.getElementById("down").value = binds.down;
    document.getElementById("hard").value = binds.hard;
    document.getElementById("clockwise").value = binds.clockwise;
    document.getElementById("counterClockwise").value = binds.counterClockwise;

    let current = null;

    // Loading up background colour
    bkgClr.value = localStorage.getItem("colour");

    bkgClr.addEventListener("input", function() {
        localStorage.setItem("colour", bkgClr.value);
    });

    // Keybind modification
    document.querySelectorAll(".settings input").forEach((input) => {

        // Exits if user tries to bind a different key during binding
        input.addEventListener("focus", function() {

            if (current && current !== this)
            {
                return;
            }

            current = this;
            this.value = "Press a key";

            // Listening for key press
            const listener = (e) => {
                e.preventDefault();
                const pressed = e.key.toLowerCase();

                // Checking if key is already binded
                for (const action in binds) {

                    // Remove key that is already binded
                    if (binds[action] === pressed) {
                        binds[action] = ""; 

                        // Make sure element exists
                        if (document.getElementById(action)) {
                            document.getElementById(action).value = "";
                        }
                    }
                }

                // Bind key
                this.value = pressed;
                binds[this.id] = pressed;
                
                // Save bind to local storage
                localStorage.setItem("binds", JSON.stringify(binds));
                document.removeEventListener("keydown", listener);

                current = null;
            };

            // Only listen for one key press
            this.addEventListener("keydown", listener, { once: true });
        });
    });
});

// Reset settings to default values
function resetSettings(){

    document.getElementById("left").value = defaultBind.left;
    document.getElementById("right").value = defaultBind.right;
    document.getElementById("down").value = defaultBind.down;
    document.getElementById("hard").value = defaultBind.hard;
    document.getElementById("clockwise").value = defaultBind.clockwise;
    document.getElementById("counterClockwise").value = defaultBind.counterClockwise;

    localStorage.setItem("colour", "#000000");
    bkgClr.value = "#000000";
    localStorage.setItem("binds", JSON.stringify(defaultBind));
}

