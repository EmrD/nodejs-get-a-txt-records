const express = require("express");
const app = express();
const dns = require("dns");

app.get("/" , (req , res)=> {
  res.sendFile(__dirname + "/index.html");
})

app.get("/api/getdns", async (req, res) => {
  const domain = req.query.url;
  const response = {};

  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.resolve4(domain, (err, addresses) => {
        if (err) reject('A kaydı bulunamadı: ' + err);
        else resolve(addresses);
      });
    });

    const txtRecords = await new Promise((resolve, reject) => {
      dns.resolveTxt(domain, (err, records) => {
        if (err) reject('TXT kaydı bulunamadı: ' + err);
        else resolve(records);
      });
    });

    response.a = addresses;
    response.txt = txtRecords;

    res.json(response); 
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(3001 , () => {console.log("Running on http://localhost:3001")});