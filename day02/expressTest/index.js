const express = require("express");
const fs = require("fs");
const app = express();

// "/happy"
app.get("/happy", (req, res) => {
  res.send("Happy, Express!");
});

// "/ping"
app.get("/ping", (req, res) => {
  res.send("Pong, Express!");
});

app.get("/arombake", (req, res) => {
  res.json({ name: "아롬베이크", type: "빵집", rate: 4.7 });
});

// "/bake" bake.txt에 있는 빵 리스트를 배열 형태로 돌려주기
// 반대로 메모장에 있는 내용 가져와야함
// 그 문자열을 배열로 만들어서
// res.josn에 넣으면됨
app.get("/bake", (req, res) => {
  try {
    const data = fs.readFileSync("bake.txt", "utf-8");

    // 📋 줄 단위로 나누기 (각 줄: "이름: 모찌빵, 가격: 12000")
    const lines = data
      .split("\n") // 줄 단위 분리
      .map((line) => line.trim()) // 공백 제거
      .filter((line) => line !== ""); // 빈 줄 제거

    // 🧩 각 줄을 객체로 변환
    const bakeList = lines.map((line) => {
      // "이름: 모찌빵, 가격: 12000"
      const parts = line.split(",").map((p) => p.trim());
      const name = parts[0].split(":")[1].trim();
      const price = Number(parts[1].split(":")[1].trim());
      return { name, price };
    });

    // 🎯 결과 반환
    res.json(bakeList);
    console.log(bakeList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "파일을 읽는 중 오류가 발생했습니다." });
  }
});

app.listen(3000, () => {
  console.log("실행~!");
});
