const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;
const winsize = 10;

let storednums = [];
let prevstate = [];

const links = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand",
};

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxMTM5OTUwLCJpYXQiOjE3MjExMzk2NTAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRlYWMwMDUxLTc0NTQtNDM1ZS04MDRmLWM1NjVlMGUwN2I0OSIsInN1YiI6IjEyNTAwMzAxM0BzYXN0cmEuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJTYXN0cmEiLCJjbGllbnRJRCI6ImRlYWMwMDUxLTc0NTQtNDM1ZS04MDRmLWM1NjVlMGUwN2I0OSIsImNsaWVudFNlY3JldCI6IkNra3hqQndoYWpMT3lUb2siLCJvd25lck5hbWUiOiJBZGl0aHlhcmFqIiwib3duZXJFbWFpbCI6IjEyNTAwMzAxM0BzYXN0cmEuYWMuaW4iLCJyb2xsTm8iOiIxMjUwMDMwMTMifQ.0uFhsJOBAkPabFquwzGP781OjAlvISbagYMDEZy_AQU";

const fetch = async (id) => {
  const curlink = links[id];
  try {
    const resp = await axios.get(curlink, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 500,
    });
    return resp.data.numbers[0];
  } catch (error) {
    console.error("Coudn't fetch!: ", error.message);
    return null;
  }
};

const average = (nums) => {
  if (nums.length == 0) return 0;
  const sum = nums.reduce((ac, num) => ac + num, 0);
  return sum / nums.length;
};

app.get("/numbers/:id", async (req, res) => {
  const { id } = req.params;
  if (!["p", "f", "e", "r"].includes(id)) {
    return res.json({ error: "Invalid ID" });
  }

  const number = await fetch(id);
  if (number != null && !storednums.includes(number)) {
    prevstate = [...storednums];
    if (storednums.length >= winsize) {
      storednums.shift();
    }
    storednums.push(number);
  } else {
    prevstate = [...storednums];
  }

  const avg = average(storednums);
  const curstate = [...storednums];

  res.json({
    windowPrevState: prevstate,
    windowCurrState: curstate,
    numbers: storednums,
    average: avg,
  });
});

app.listen(port, () => {
  console.log("Server's up at port 3000");
});
