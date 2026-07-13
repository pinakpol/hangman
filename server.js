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

app.get("/categories", (req, res) => {

    let game = games.getGame("TEMP");

    res.json(game.words.getCategories());

});


//----------------------------------------
// Start Game
//----------------------------------------

app.post("/start", (req, res) => {

    const board = req.body.board;

    const category = req.body.category || "animals";

    if (!board) {

        return res.status(400).json({

            error: "Missing board ID"

        });

    }

    const ok = games.start(board, category);

    if (!ok) {

        return res.status(400).json({

            error: "Category not found"

        });

    }

    res.json(

        games.state(board)

    );

});


//----------------------------------------
// Guess Letter
//----------------------------------------

app.post("/guess", (req, res) => {

    const board = req.body.board;

    const letter = req.body.letter;

    if (!board) {

        return res.status(400).json({

            error: "Missing board ID"

        });

    }

    games.guess(board, letter);

    res.json(

        games.state(board)

    );

});


//----------------------------------------
// Current State
//----------------------------------------

app.get("/state", (req, res) => {

    const board = req.query.board;

    if (!board) {

        return res.status(400).json({

            error: "Missing board ID"

        });

    }

    res.json(

        games.state(board)

    );

});


//----------------------------------------
// Reset
//----------------------------------------

app.post("/reset", (req, res) => {

    const board = req.body.board;

    if (!board) {

        return res.status(400).json({

            error: "Missing board ID"

        });

    }

    games.reset(board);

    res.json(

        games.state(board)

    );

});

app.post("/boardid", (req, res) => {

    const board = req.body.board;

    if (!board) {
        return res.json({ ok: false });
    }

    games.getGame(board);

    res.json({
        ok: true
    });

});

//----------------------------------------

app.listen(PORT, () => {

    console.log("");

    console.log("====================================");

    console.log(" Second Life Hangman Server");

    console.log(" Running on Port " + PORT);

    console.log("====================================");

});
