//====================================================
// Hangman's Gallows
// MOAP Client V2
//====================================================

const category = document.getElementById("category");
const hint = document.getElementById("hint");
const word = document.getElementById("word");
const attempts = document.getElementById("attempts");
const wrong = document.getElementById("wrong");
const status = document.getElementById("status");
const bar = document.getElementById("bar");
const prisoner = document.getElementById("prisoner");
//====================================================
// Board ID
//====================================================

const params = new URLSearchParams(window.location.search);

const board = params.get("board");

//====================================================

if (!board)
{
    status.innerHTML = "INVALID BOARD";

    throw new Error("Board ID missing");
}

//====================================================

let previousStatus = "";

//====================================================

async function update()
{
    try
    {
        const response =
        await fetch(
            "/state?board=" +
            encodeURIComponent(board),
            {
                cache:"no-store"
            }
        );

        if(!response.ok)
            return;

        const data =
        await response.json();

        draw(data);
    }
    catch(e)
    {
        status.innerHTML =
        "SERVER OFFLINE";
    }
}

//====================================================

function draw(data)
{
    category.textContent =
        data.category || "---";

    hint.textContent =
        data.hint || "---";

    word.textContent =
        data.display || "";
    const keyboard = document.getElementById("keyboard");

keyboard.innerHTML = "";

if(data.canGuess)
{
    data.unusedLetters.forEach(letter =>
    {
        const button =
            document.createElement("button");

        button.className = "letter";

        button.textContent = letter;

        button.onclick = async function()
        {
            await fetch(
                "/guess",
                {
                    method:"POST",

                    headers:
                    {
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify(
                    {
                        board: board,
                        letter: letter
                    })
                }
            );

            update();
        };

        keyboard.appendChild(button);
    });
}

    attempts.textContent =
        data.attempts +
        " / " +
        data.maxAttempts;

    wrong.textContent =
        data.wrong.length ?
        data.wrong.join(" ") :
        "None";

    //------------------------------------------------

    let percent =
        (data.attempts /
        data.maxAttempts) * 100;

    if(percent < 0)
        percent = 0;

    bar.style.width =
        percent + "%";

  prisoner.textContent =
data.prisoner || "UNKNOWN"; 
    //------------------------------------------------

    switch(data.status)
    {
        case "idle":

            status.textContent =
            "AWAITING PRISONER";

            break;

        case "playing":

            status.textContent =
            "TRIAL IN PROGRESS";

            break;

        case "win":

            status.textContent =
            "PRISONER PARDONED";

            break;

        case "lose":

            status.textContent =
            "SENTENCE CARRIED OUT";

            break;

        default:

            status.textContent =
            "";
    }

    //------------------------------------------------

    if(previousStatus != data.status)
    {
        previousStatus =
        data.status;
    }
}

//====================================================

update();

setInterval(
    update,
    1000
);
