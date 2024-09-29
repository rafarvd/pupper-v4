const express = require("express");
const cors = require("cors");
const controller = require("./api/controller.js");
const distrosea = require("./api/distrosea.js");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/distro", async (req, res) => {
  let getUrl = false;
  while (!getUrl) {
    getUrl = await distrosea(); // get url ou false
  }
  // get example.png
  res.set("Content-Type", "image/png");
  res.sendFile(`${__dirname}/example.png`);

  // res.json({ url: getUrl });
  // await controller();
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
