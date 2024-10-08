const express = require("express");
const cors = require("cors");
const runner = require("./api/run.js");
const distrosea = require("./api/distrosea.js");
const sleep = require("./api/sleep.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const run = async () => {
  let ver = false;
  while (!ver) {
    ver = await runner();
    await sleep(2);
  }
};

if (process.env.RUN === "true" || process.env.RUN === "1") {
  run();
}

app.get("/", async (req, res) => {
  run();
});

app.get("/run", async (req, res) => {
  run();
});

app.get("/distro", async (req, res) => {
  let getUrl = false;
  while (!getUrl) {
    getUrl = await distrosea();
  }
  res.json({ url: getUrl });
});

app.get("/screen", async (req, res) => {
  try {
    res.set("Content-Type", "image/png");
    res.sendFile(__dirname + "/screenshot.png");
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro" });
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
