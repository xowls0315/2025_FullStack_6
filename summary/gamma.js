const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const pizza = [
  {
    id: 0,
    name: "포테이토 피자",
    ingredients: ["감자", "치즈", "빵", "토마토소스"],
    kcal: 800,
  },
  {
    id: 1,
    name: "콤비네이션 피자",
    ingredients: ["파프리카", "치즈", "빵", "토마토소스", "올리브", "페퍼로니"],
    kcal: 900,
  },
  {
    id: 2,
    name: "페퍼로니 피자",
    ingredients: ["페퍼로니", "치즈", "빵", "토마토소스"],
    kcal: 600,
  },
];

app.get("/pizza", (req, res) => {
  res.json(pizza);
});

app.post("/pizza", (req, res) => {
  const { name, ingredients, kcal } = req.body;

  pizza.push({ id: pizza.length, name, ingredients, kcal });

  res.json({ msg: `${name}가 추가되었습니다!` });
});

app.delete("/pizza/:id", (req, res) => {
  const { id } = req.params;
  const targetIndex = pizza.findIndex((v) => v.id == id);

  if (targetIndex === -1) {
    return res.status(404).json({ msg: `${id}번 피자를 찾을 수 없습니다.` });
  }

  pizza.splice(targetIndex, 1);

  res.json({ msg: `${id}번 피자가 삭제되었습니다!` });
});

app.put("/pizza/:id", (req, res) => {
  const { id } = req.params;
  const targetIndex = pizza.findIndex((v) => v.id == id);

  if (targetIndex === -1) {
    return res.status(404).json({ msg: `${id}번 피자를 찾을 수 없습니다.` });
  }

  const { name, ingredients, kcal } = req.body;

  pizza[targetIndex].name = name || pizza[targetIndex].name;
  pizza[targetIndex].ingredients =
    ingredients || pizza[targetIndex].ingredients;
  pizza[targetIndex].kcal = kcal || pizza[targetIndex].kcal;

  return res.json(`id ${pizza[targetIndex].id}번 피자가 수정되었습니다.`);
});

app.listen(3000, () => {
  console.log("서버 시즌3 시작~!");
});
