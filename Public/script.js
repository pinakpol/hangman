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
const announcement = document.getElementById("announcement");

//====================================================
// Messages
//====================================================

const idleMessages =
[
    "Awaiting the next prisoner.",
    "The gallows stand ready.",
    "The executioner sharpens the axe.",
    "The court awaits its next trial."
];

const playingMessages =
[
    "Reveal every letter to earn mercy.",
    "The jury watches every move.",
    "The kingdom awaits the verdict.",
    "The judge allows one final chance."
];

const winMessages =
[
    "Against all odds, mercy has prevailed.",
    "The prisoner has earned a royal pardon.",
    "The sentence has been overturned.",
    "Justice has shown compassion today."
];

const loseMessages =
[
    "The sentence has been carried out.",
    "The kingdom has witnessed justice.",
    "The gallows claim another soul.",
    "No mercy was granted."
];

//====================================================

let previousStatus = "";
let currentAnnouncement = "";

//====================================================
// Board ID
//====================================================

const params = new URLSearchParams(window.location.search);

const board = params.get("board");

if(!board)
{
    status.textContent = "INVALID BOARD";
    throw new Error("Board ID missing");
}

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
        status.textContent = "SERVER OFFLINE";
    }
}

//====================================================

function draw(data)
{
    category.textContent =
        data.category || "---";

    hint.textContent =
        data.hint || "---";

    prisoner.textContent =
        data.prisoner || "Unknown Prisoner";

    word.textContent =
        data.display || "";

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
        (data.attempts / data.maxAttempts) * 100;

    if(percent < 0)
        percent = 0;

    bar.style.width =
        percent + "%";

    //------------------------------------------------
    // Keyboard
    //------------------------------------------------

    const keyboard =
        document.getElementById("keyboard");

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

    //------------------------------------------------
    // Status
    //------------------------------------------------

    switch(data.status)
    {
        case "idle":

            status.textContent =
                "AWAITING PRISONER";
            status.style.color = "";
status.style.fontWeight = "";
status.style.fontSize = "";

            if(previousStatus != "idle")
            {
                currentAnnouncement =
                    idleMessages[
                        Math.floor(
                            Math.random() *
                            idleMessages.length
                        )
                    ];
            }

            break;

        case "playing":

            status.textContent =
                "TRIAL IN PROGRESS";
            status.style.color = "";
status.style.fontWeight = "";
status.style.fontSize = "";

            if(previousStatus != "playing")
            {
                currentAnnouncement =
                    playingMessages[
                        Math.floor(
                            Math.random() *
                            playingMessages.length
                        )
                    ];
            }

            break;

        case "win":

            status.textContent =
                "PRISONER PARDONED";
            status.style.color = "";
status.style.fontWeight = "";
status.style.fontSize = "";

            if(previousStatus != "win")
            {
                currentAnnouncement =
                    winMessages[
                        Math.floor(
                            Math.random() *
                            winMessages.length
                        )
                    ];
            }

            break;

           case "guilty":

    status.textContent =
        "GUILTY";
            status.style.color = "#8B0000";
status.style.fontWeight = "bold";
status.style.fontSize = "42px";

    if(previousStatus != "guilty")
    {
        currentAnnouncement =
            "The Judge has found the prisoner GUILTY. Execution shall commence.";
    }

    announcement.textContent =
        currentAnnouncement;

    break;

        case "lose":

            status.textContent =
                "SENTENCE CARRIED OUT";
            status.style.color = "";
status.style.fontWeight = "";
status.style.fontSize = "";

            if(previousStatus != "lose")
            {
                currentAnnouncement =
                    loseMessages[
                        Math.floor(
                            Math.random() *
                            loseMessages.length
                        )
                    ];
            }

            break;

        default:

            status.textContent = "";
            currentAnnouncement = "";
    }

    announcement.textContent =
        currentAnnouncement;

    previousStatus =
        data.status;
}

//====================================================

update();

setInterval(
    update,
    1000
);
