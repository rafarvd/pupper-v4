const express = require("express");
const cors = require("cors");
const controller = require("./api/controller.js");
const distrosea = require("./api/distrosea.js");

const app = express();
const PORT = process.env.PORT || 4000;
const host = process.env.HOST || "localhost";

app.use(cors());
app.use(express.json());

if (process.env.RUN) {
  fetch(`${host}:4000/distro`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.url);
      controller(data.url);
      // res.json(data.url);
    });
}

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/distro", async (req, res) => {
  let getUrl = false;
  while (!getUrl) {
    getUrl = await distrosea();
  }
  res.json({ url: getUrl });
});

app.get("/controller", async (req, res) => {
  fetch(`${host}:4000/distro`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.url);
      controller(data.url);
      // res.json(data.url);
    });
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
