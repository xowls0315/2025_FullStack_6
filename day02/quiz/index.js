// 수료식(2026.01.27) 디데이 프로그램 만들기
const prompt = require("prompt-sync")();

while (true) {
  try {
    console.log("=== 수료식 D-Day 계산기 ===");
    console.log("\n== 수료식 날짜를 입력하세요!! ==");
    const year = prompt("년도 입력: ");
    const month = prompt("월 입력: ");
    const day = prompt("일 입력: ");
    if (isNaN(year) || isNaN(month) || isNaN(day))
      throw new Error("날짜 입력 오류");

    const today = new Date();
    const dischargeDate = new Date(`${year}-${month}-${day}`);

    // 🔢 날짜 차이 계산 (밀리초 → 일 단위로 변환)
    const diffTime = dischargeDate - today;
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (remainingDays > 0) {
      console.log(`수료식까지 D-${remainingDays}일 남았습니다!`);
    } else if (remainingDays === 0) {
      console.log("오늘이 수료식입니다! 🎉 축하합니다!");
    } else {
      console.log(`수료한 지 ${Math.abs(remainingDays)}일이 지났습니다!`);
    }
  } catch (e) {
    console.log(e.message);
  }

  // 다시 입력 여부 묻기
  const retry = prompt("\n다시 입력하시겠습니까? (y/n): ").toLowerCase();

  if (retry !== "y") break;
}

prompt("아무 키 누르면 시스템 종료");
