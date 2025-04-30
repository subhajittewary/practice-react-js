const path = require("path");
const { exec } = require("child_process");
const express = require("express");
const router = express.Router();

const pythonScriptPath = path.resolve(
  __dirname,
  "../pythonScripts/financial_planner.py"
);

router.post("/api/retirement", (req, res) => {
  console.log("req.body");
  const serializedPrompt = JSON.stringify(req.body);

  const command = `python3 "${pythonScriptPath}" '${serializedPrompt}'`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send("Internal Server Error");
    }

    console.log("object:::", stdout);
    res.setHeader("Content-Type", "application/json");
    res.send(stdout);
  });
});

router.post("/api/prompt", (req, res) => {
  res.json({ message: "API prompt received!", req: req.body });
});

router.post("/api/stock", (req, res) => {
  res.json({ message: "API stock received!", req: req.body });
});

module.exports = router;
