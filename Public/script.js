//====================================================
// Hangman's Gallows
// MOAP Client V1
//====================================================

const category = document.getElementById("category");
const hint = document.getElementById("hint");
const word = document.getElementById("word");
const attempts = document.getElementById("attempts");
const wrong = document.getElementById("wrong");
const status = document.getElementById("status");
const bar = document.getElementById("bar");

//----------------------------------------
// Get Board UUID from URL
//----------------------------------------

const params = new URLSearchParams(window.location.search);

let board = params.get("board");

//----------------------------------------

if (!board)
{
    status.innerHTML = "NO BOARD ID";

    throw "Missing board ID";
}

//----------------------------------------

async function update()
{
    try
    {
        const r =
        await fetch(
            "/state?board=" +
            encodeURIComponent(board)
        );

        if (!r.ok)
            return;

        const data =
        await r.json();

        draw(data);
    }
    catch(e)
    {
        status.innerHTML = "SERVER OFFLINE";
    }
}


//----------------------------------------

function draw(data)
{
    category.innerHTML =
        data.category || "---";

    hint.innerHTML =
        data.hint || "---";

    word.innerHTML =
        data.display || "";

    wrong.innerHTML =
        data.wrong.join(" ");

    attempts.innerHTML =
        data.attempts +
        " / " +
        data.maxAttempts;

    let percent =
        (data.attempts /
        data.maxAttempts) * 100;

    bar.style.width =
        percent + "%";

    switch(data.status)
    {
        case "idle":
            status.innerHTML =
            "AWAITING PRISONER";
            break;

        case "playing":
            status.innerHTML =
            "TRIAL IN PROGRESS";
            break;

        case "win":
            status.innerHTML =
            "PRISONER PARDONED";
            break;

        case "lose":
            status.innerHTML =
            "SENTENCE CARRIED OUT";
            break;

        default:
            status.innerHTML = "";
    }
}


//----------------------------------------

update();

setInterval(
    update,
    1000
);
