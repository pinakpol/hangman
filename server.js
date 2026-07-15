const express = require("express");
const db = require("./database");
const GameManager = require("./game/GameManager");
const WordManager = require("./game/WordManager");

const app = express();

const PORT = process.env.PORT || 3000;

const games = new GameManager();
const words = new WordManager();

app.use(express.json());
app.use(express.static("Public"));

function SaveGame(state)
{
    db.run(
        `
        INSERT INTO halloffame
        (
            player,
            difficulty,
            category,
            word,
            result,
            wrong
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
        `,
        [
            state.prisoner,
            state.difficulty,
            state.category,
            state.word,
            state.status,
            state.wrongLetters.length
        ]
    );
}

//----------------------------------------
// Categories
//----------------------------------------

app.get("/categories",(req,res)=>{

    let game = games.getGame("TEMP");

    res.json(game.words.getCategories());

});

//----------------------------------------
// Start
//----------------------------------------

app.post("/start", (req, res) =>
{
    const board = req.body.board;

    const prisoner =
        req.body.prisoner || "Unknown Prisoner";

    const difficulty =
        req.body.difficulty || "easy";

    const category =
        words.randomCategory();

    games.start(
        board,
        category,
        prisoner,
        difficulty
    );

    res.json(
        games.state(board)
    );
});

//----------------------------------------
// Guess
//----------------------------------------

app.post("/guess", (req, res) =>
{
    const board = req.body.board;

    const letter = req.body.letter;

    const game =
        games.getGame(board);

    if(!game)
    {
        return res.status(404).json(
        {
            error:"Game not found"
        });
    }

    if(game.status != "playing")
    {
        return res.json(
            game.state()
        );
    }

    game.guess(letter);

    const state =
        game.state();

    //------------------------------------
    // Guilty → Lose
    //------------------------------------

   if(state.status == "guilty")
{
    setTimeout(function()
    {
        if(game.status == "guilty")
        {
            game.status = "lose";

            if(!game.saved)
            {
                SaveGame(game.state());

                game.saved = true;
            }
        }
    },2000);
}

    //------------------------------------
    // Auto reset after execution
    //------------------------------------

   if(state.status == "win")
{
    if(!game.saved)
    {
        SaveGame(game.state());

        game.saved = true;
    }

    setTimeout(function()
    {
        game.reset();
    },10000);
}

    if(state.status == "lose")
    {
        setTimeout(function()
        {
            game.reset();
        },10000);
    }

    res.json(state);
});

//----------------------------------------
// State
//----------------------------------------

app.get("/state",(req,res)=>{

    const board = req.query.board;

    if(!board)
    {
        return res.status(400).json({
            error:"Missing board ID"
        });
    }

    res.json(
        games.state(board)
    );

});

//----------------------------------------
// Letters (LSL Friendly)
//----------------------------------------

app.get("/letters",(req,res)=>{

    const board = req.query.board;

    if(!board)
    {
        return res.send("");
    }

    const state =
        games.state(board);

    res.send(
        state.unusedLetters.join("")
    );

});

//----------------------------------------
// Status (LSL Friendly)
//----------------------------------------

app.get("/status",(req,res)=>{

    const board = req.query.board;

    if(!board)
    {
        return res.send("idle");
    }

    const state =
        games.state(board);

    res.send(
        state.status
    );

});

//----------------------------------------
// Reset
//----------------------------------------

app.post("/reset",(req,res)=>{

    const board = req.body.board;

    if(!board)
    {
        return res.status(400).json({
            error:"Missing board ID"
        });
    }

    games.reset(board);

    res.json(
        games.state(board)
    );

});

//----------------------------------------

app.listen(PORT,()=>{

    console.log("");
    console.log("==================================");
    console.log(" Hangman's Gallows Server");
    console.log(" Port : " + PORT);
    console.log("==================================");

});
