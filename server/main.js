let express = require("express");
let app = express();
let state = "---------".split("");

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(express.static("front-end"));

app.get("/gamestate", (req, res) => {
    res.status(200);
    res.json(state);
});

app.get("/move", (req, res) => {
    state[req.query.pos] = req.query.icon;
    res.status(200);
    res.end();
});

app.listen("80", () => {
    console.log("pronto");
});
