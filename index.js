const express = require("express");
const cors = require("cors");
const controller = require("./api/controller.js");
const distrosea = require("./api/distrosea.js");

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";

app.use(cors());
app.use(express.json());

if (process.env.RUN === 1) {
  fetch(`${HOST}:${PORT}/distro`)
    .then((response) => response.json())
    .then((data) => {
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

// app.get("/controller", async (req, res) => {
//   fetch(`${host}:4000/distro`)
//     .then((response) => response.json())
//     .then((data) => {
//       controller(data.url);
//       // get screenshot.png
//       res.set("Content-Type", "image/png");
//       res.sendFile(__dirname + "/screenshot.png");
//     });
// });

app.get("/controller", async (req, res) => {
  try {
    let control = false;
    while (!control) {
      const response = await fetch(`${HOST}:${PORT}/distro`);
      const data = await response.json();
      control = await controller(data.url);
      console.log(control ? true : false);
    }
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro" });
  }
});

app.get("/screen", async (req, res) => {
  try {
    res.set("Content-Type", "image/png");
    res.sendFile(__dirname + "/screenshot.png");
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
