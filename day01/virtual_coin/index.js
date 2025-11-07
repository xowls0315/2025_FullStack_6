const ccxt = require("ccxt");
const prompt = require("prompt-sync")();

let buyAmountKRWMan = 0; // 만원 단위 입력 (예: 50 => 50만원)
let buyPrice = 0; // 매수가 (USDT/BTC)
let isBought = false;
let fx = 1400; // KRW per USD (기본값)
let btcQty = 0; // 매수한 BTC 수량
let buyValueKRW = 0; // 매수 금액(원)

// 공용 Binance 인스턴스
const exchange = new ccxt.binance();

// 현재 비트코인 가격 조회 및 손익 출력
const getCoin = async () => {
  try {
    const coin = await exchange.fetchTicker("BTC/USDT");
    const currentPrice = coin.last; // USDT/BTC
    console.log(
      `\n💰 현재 비트코인 가격: ${currentPrice.toLocaleString()} USDT`
    );

    if (isBought) {
      const currentValueUSD = btcQty * currentPrice;
      const currentValueKRW = currentValueUSD * fx;

      const pnlKRW = currentValueKRW - buyValueKRW;
      const pnlRate = (currentValueKRW / buyValueKRW - 1) * 100;

      console.log(
        `구매가 ${buyPrice.toLocaleString()} USDT → 현재가 ${currentPrice.toLocaleString()} USDT`
      );
      console.log(`보유수량: ${btcQty} BTC`);
      console.log(
        `평가금액: ${Math.round(currentValueKRW).toLocaleString("ko-KR")}원`
      );

      const sign = pnlKRW > 0 ? "📈 수익" : pnlKRW < 0 ? "📉 손실" : "😐 보합";
      console.log(
        `${sign}: ${Math.round(pnlKRW).toLocaleString(
          "ko-KR"
        )}원 (${pnlRate.toFixed(2)}%)`
      );
    }
  } catch (err) {
    console.log("❌ 시세 조회 실패:", err.message);
  }
};

(async () => {
  console.log("=== 💸 비트코인 실시간 가격 모니터 (KRW 손익) ===");

  // 1) 구매 금액(만원) 입력
  buyAmountKRWMan = +prompt(
    "비트코인 얼마 구매하실건가요? (10~100만원 사이, 숫자만): "
  );
  if (isNaN(buyAmountKRWMan) || buyAmountKRWMan < 10 || buyAmountKRWMan > 100) {
    console.log("❌ 올바른 금액(10~100만원) 범위로 입력해주세요!");
    process.exit(0);
  }

  // 2) 환율 입력 (빈 입력 시 기본 1400원)
  const fxInput = prompt("현재 원/달러 환율을 입력하세요 (기본 1400): ").trim();
  if (fxInput !== "") {
    const parsedFx = +fxInput;
    if (!isNaN(parsedFx) && parsedFx > 0) fx = parsedFx;
  }
  console.log(`적용 환율: 1 USD = ${fx.toLocaleString("ko-KR")}원`);

  // 현재 시세 (매수 전 확인용)
  const first = await exchange.fetchTicker("BTC/USDT");
  console.log(`현재 비트코인 시세: ${first.last.toLocaleString()} USDT`);
  prompt("구매하시려면 엔터를 눌러주세요! ");

  // 3) 매수 처리
  buyPrice = first.last; // USDT/BTC
  const buyKRW = buyAmountKRWMan * 10000; // 만원 → 원
  const buyUSD = buyKRW / fx; // 원 → USD(≈USDT)
  btcQty = +(buyUSD / buyPrice).toFixed(8); // 소수점 8자리로 보관
  buyValueKRW = buyKRW; // 원화 기준 매수금액

  isBought = true;
  console.log("\n🔥 지금이니~! 비트코인 매수 완료!");
  console.log(`매수가: ${buyPrice.toLocaleString()} USDT`);
  console.log(`매수금액: ${buyValueKRW.toLocaleString("ko-KR")}원`);
  console.log(`매수수량: ${btcQty} BTC`);

  // 3초마다 현재 시세 비교 출력 (원화 손익)
  setInterval(getCoin, 3000);

  // 첫 출력 즉시
  getCoin();
})();
