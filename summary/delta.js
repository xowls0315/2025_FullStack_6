const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/pizzas", async (req, res) => {
  const pizzas = await prisma.pizza.findMany();
  res.json(pizzas);
});

app.get("/ingredients", async (req, res) => {
  const ingredients = await prisma.ingredients.findMany();
  res.json(ingredients);
});

app.listen(3000, () => {
  console.log("서버 시즌4 시작~!");
});
