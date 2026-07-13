const express = require("express");

const Game = require("./game/Game");

const app = express();

const game = new Game();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static("public"));

app.get("/categories", (req, res) => {

    res.json(

        game.words.getCategories()

    );

});

app.post("/start", (req, res) => {

    let category = req.body.category || "animals";

    if (!game.start(category)) {

        return res.status(400).json({

            error: "Category not found"

        });

    }

    res.json(

        game.state()

    );

});

app.post("/guess", (req, res) => {

    game.guess(

        req.body.letter

    );

    res.json(

        game.state()

    );

});

app.get("/state", (req, res) => {

    res.json(

        game.state()

    );

});

app.post("/reset", (req, res) => {

    game.reset();

    res.json(

        game.state()

    );

});

app.listen(PORT, () => {

    console.log("");

    console.log("===================================");

    console.log(" Hangman Server Running");

    console.log(" http://localhost:" + PORT);

    console.log("===================================");

});