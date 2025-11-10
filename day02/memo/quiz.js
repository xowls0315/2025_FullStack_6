const fs = require("fs");
const prompt = require("prompt-sync")();

// dairy_2025. 11. 10. 오전 10:51:46.txt로(현재시간) 파일 이름이 나오도록 해야함
// 프롬프트 오늘 일기 쓰세요: 오늘 붕어빵사옴 ㅅㄱ

// 📅 현재 날짜와 시간 구하기
const dateStr = new Date()
  .toLocaleString("ko-KR", {
    year: "numeric", // 연도: 2025
    month: "2-digit", // 월: 01~12 (두 자리 0패딩)
    day: "2-digit", // 일: 01~31 (두 자리 0패딩)
    hour: "numeric", // 시: 1~12 (hour12: true 이므로 12시간제)
    minute: "numeric", // 분: 0~59 (필요 시 한 자리)
    second: "numeric", // 초: 0~59 (필요 시 한 자리)
    hour12: true, // 12시간제 사용(오전/오후 붙음)
  })
  .replaceAll(" ", "");

const diary = prompt("오늘 일기 쓰세요: ");

fs.writeFileSync(
  `diary_${dateStr}.txt`.replace(/[\\/:*?"<>|]/g, "_"),
  diary,
  "utf-8"
);
