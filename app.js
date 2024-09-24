// Purpose: REST API for dictionary
let dictionary = [
  { id: 1, fin: "auto", eng: "car" },
  { id: 2, fin: "talo", eng: "house" },
];
const express = require("express");
const fs = require("fs");

//const bodyParser = require("body-parser");
/* const app = express().use(bodyParser.json()); //vanha tapa - ei enÃ¤Ã¤ voimassa. 
kts. https://devdocs.io/express/ -> req.body*/
var app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

/*CORS isnâ€™t enabled on the server, this is due to security reasons by default,
so no one else but the webserver itself can make requests to the server.*/
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader("Content-type", "application/json");

  // Pass to next layer of middleware
  next();
});

//GET all words
app.get("/words", (req, res) => {
  const data = fs.readFileSync("./sanakirja.txt", {
    encoding: "utf8",
    flag: "r",
  });
  //data:ssa on nyt koko tiedoston sisÃ¤ltÃ¶
  /*tiedoston sisÃ¤ltÃ¶ pitÃ¤Ã¤ pÃ¤tkiÃ¤ ja tehdÃ¤ taulukko*/
  const splitLines = data.split(/\r?\n/);
  /*TÃ¤ssÃ¤ voisi kÃ¤ydÃ¤ silmukassa lÃ¤pi splitLines:ssa jokaisen rivin*/
  splitLines.forEach((line) => {
    const words = line.split(" "); //sanat taulukkoon words
    console.log(words);
    const word = {
      fin: words[0],
      eng: words[1],
    };
    dictionary.push(word);
    console.log(dictionary);
  });

  res.json(dictionary);
});
//GET a word
app.get("/words/:word", (req, res) => {
  const id = String(req.params.word);
  const word = dictionary.find((word) => word.fin === id);
  if (word) {
    res.json({ eng: word.eng });
  } else {
    res.json({ message: "Not found" });
  }
  res.json(word ? word : { message: "Not found" });
});

//ADD a word
app.post("/words", (req, res) => {
  const word = req.body;
  dictionary.push(word);
  fs.appendFileSync("./sanakirja.txt", `${word.fin} ${word.eng}\n`);
  res.json(dictionary);
});

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
