const Game = require("./Game");

class GameManager
{
    constructor()
    {
        this.games = {};

        this.TIMEOUT = 60 * 60 * 1000; // 1 hour

        setInterval(
            () => this.cleanup(),
            60000
        );
    }

    //------------------------------------------------

    getGame(boardID)
    {
        if(!this.games[boardID])
        {
            this.games[boardID] =
            {
                game : new Game(),

                lastAccess :
                Date.now()
            };
        }

        this.games[boardID].lastAccess =
            Date.now();

        return this.games[boardID].game;
    }

    //------------------------------------------------

   start(boardID, category, prisoner, difficulty)
{
    const game = this.getGame(boardID);

    const ok = game.start(
    category,
    difficulty
);

    if(ok)
    {
        game.prisoner = prisoner || "Unknown Prisoner";
    }

    return ok;
}

    //------------------------------------------------

    guess(boardID,letter)
    {
        this.getGame(boardID)
            .guess(letter);
    }

    //------------------------------------------------

    state(boardID)
    {
        return this.getGame(boardID)
            .state();
    }

    //------------------------------------------------

    reset(boardID)
    {
        this.getGame(boardID)
            .reset();
    }

    //------------------------------------------------

    cleanup()
    {
        let now = Date.now();

        for(const id in this.games)
        {
            if(
                now -
                this.games[id].lastAccess >
                this.TIMEOUT
            )
            {
                delete this.games[id];

                console.log(
                    "Removed inactive board:",
                    id
                );
            }
        }
    }
}

module.exports = GameManager;
