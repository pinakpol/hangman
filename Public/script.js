//====================================================
// Second Life Hangman
// Execution Notice
// public/script.js
//====================================================

const params = new URLSearchParams(window.location.search);

const BOARD = params.get("board");

//----------------------------------------------------
// Elements
//----------------------------------------------------

const category = document.getElementById("category");
const hint = document.getElementById("hint");
const word = document.getElementById("word");
const wrong = document.getElementById("wrong");
const attempts = document.getElementById("attempts");
const status = document.getElementById("status");
const progress = document.getElementById("progress");
const boardID = document.getElementById("boardID");

//----------------------------------------------------

boardID.textContent =
    "Board : " + (BOARD || "Unknown");

//----------------------------------------------------

function updateProgress(remaining, maximum)
{
    let percent = (remaining / maximum) * 100;

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    progress.style.width = percent + "%";
}

//----------------------------------------------------

async function loadState()
{
    if (!BOARD)
        return;

    try
    {
        const response = await fetch(

            "/state?board=" + encodeURIComponent(BOARD),

            {
                cache: "no-store"
            }

        );

        if (!response.ok)
            return;

        const data = await response.json();

        //--------------------------------------------

        category.textContent =
            data.category || "—";

        hint.textContent =
            data.hint || "—";

        word.textContent =
            data.display || "";

        attempts.textContent =
            data.attempts;

        //--------------------------------------------

        if (data.wrong.length)
            wrong.textContent =
                data.wrong.join(" ");
        else
            wrong.textContent = "None";

        //--------------------------------------------

        updateProgress(
            data.attempts,
            data.maxAttempts
        );

        //--------------------------------------------

        status.className = "";

        switch (data.status)
        {

            case "idle":

                status.textContent =
                    "Awaiting Prisoner";

                break;

            case "playing":

                status.textContent =
                    "Sentence Pending";

                status.classList.add("playing");

                break;

            case "win":

                status.textContent =
                    "Royal Pardon Granted";

                status.classList.add("win");

                break;

            case "lose":

                status.textContent =
                    "Sentence Carried Out";

                status.classList.add("lose");

                break;

        }

    }
    catch (err)
    {
        console.log(err);
    }

}

//----------------------------------------------------

loadState();

setInterval(loadState, 1000);