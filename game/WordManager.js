const fs = require("fs");
const path = require("path");

class WordManager {

    constructor() {

        this.categories = {};

        this.load();

    }

    load() {

        const folder = path.join(__dirname, "..", "words");

        console.log("Loading words from:", folder);

        const files = fs.readdirSync(folder);

        for (const file of files) {

            if (!file.endsWith(".json"))
                continue;

            const category = file.replace(".json", "");

            const data = JSON.parse(
                fs.readFileSync(
                    path.join(folder, file),
                    "utf8"
                )
            );

            this.categories[category] = data;

            console.log(
                "Loaded",
                category,
                data.length,
                "words"
            );

        }

    }

    getCategories() {

        return Object.keys(this.categories);

    }

    random(category) {

        const list = this.categories[category];

        if (!list)
            return null;

        return list[
            Math.floor(Math.random() * list.length)
        ];

    }

}

module.exports = WordManager;