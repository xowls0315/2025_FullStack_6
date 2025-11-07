// 두수의 합,차,곱,나누기 결과 나오는 프로그램 만들기!!
// try-catch문 사용해서 만들기!!
// while 문 사용해서 다시 입력 여부 묻고, 아무키 누르면 시스템 종료도 만들기

const prompt = require("prompt-sync")();

while (true) {
  try {
    const num1 = +prompt("숫자1 입력: ");
    const num2 = +prompt("숫자2 입력: ");

    // 숫자1과 숫자2의 합, 차, 곱, 나누기 결과 나오는 프로그램
    console.log(`두수의 합: ${num1 + num2}`);
    console.log(`두수의 차: ${num1 - num2}`);
    console.log(`두수의 곱: ${num1 * num2}`);
    console.log(`두수의 나눗셈: ${num1 / num2}`);
  } catch (e) {
    console.log(e.message);
  }

  // 다시 입력 여부 묻기
  const retry = prompt("\n다시 입력하시겠습니까? (y/n): ").toLowerCase();

  if (retry !== "y") break;
}

prompt("아무 키 누르면 시스템 종료");
