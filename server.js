const express = require("express");
const GameManager = require("./game/GameManager");

const app = express();

const PORT = process.env.PORT || 3000;

const games = new GameManager();

app.use(express.json());
app.use(express.static("Public"));

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

    const category = req.body.category || "animals";

    const prisoner = req.body.prisoner || "Unknown Prisoner";

   games.start(board, category, prisoner);
    const game = games.get(board);

    if(game)
    {
        game.prisoner = prisoner;
    }

    res.json(games.state(board));
});

//----------------------------------------
// Guess
//----------------------------------------

app.post("/guess",(req,res)=>{

    const board = req.body.board;
    const letter = req.body.letter;

    if(!board)
    {
        return res.status(400).json({
            error:"Missing board ID"
        });
    }

    games.guess(board,letter);

    res.json(
        games.state(board)
    );

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
