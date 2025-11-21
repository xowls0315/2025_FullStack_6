const name = document.querySelector("#name");
const ingredients = document.querySelector("#ingredients");
const kcal = document.querySelector("#kcal");
const button = document.querySelector("#button");
const menu = document.querySelector("#menu");

button.addEventListener("click", async () => {
  const nameValue = name.value;
  const ingValue = ingredients.value.split(",");
  const kcalValue = kcal.value;

  const result = await fetch("http://localhost:3000/pizza", {
    method: "post",
    body: JSON.stringify({
      name: nameValue,
      ingredients: ingValue,
      kcal: kcalValue,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const msg = await result.json();

  alert(msg.msg);

  menu.innerHTML = "";
  getPizza();

  // 입력값 초기화
  name.value = "";
  ingredients.value = "";
  kcal.value = "";
});

const getPizza = async () => {
  const res = await fetch("http://localhost:3000/pizza");
  const data = await res.json();
  data.forEach((v) => {
    const div = document.createElement("div");
    div.innerText = v.name;
    menu.appendChild(div);
  });
};

getPizza();
