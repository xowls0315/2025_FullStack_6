const fs = require("fs"); // fs는 file-system의 줄임말
const prompt = require("prompt-sync")();

const name = prompt("당신의 이름은 무엇?");
const age = prompt("당신의 나이는 몇살?");

fs.writeFileSync("hello.txt", `이름: ${name}, 나이: ${age}`, "utf-8");
