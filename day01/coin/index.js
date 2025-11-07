const ccxt = require("ccxt");

let current = 0;
const getCoin = async () => {
  const exchange = new ccxt.binance();
  const coin = await exchange.fetchTicker("BTC/USDT");
  console.log(`현재 비트코인 가격: ${coin.last}`);

  if (coin.last > current) console.log("한강뷰 가즈아");
  else console.log("돔황쳐");
  current = coin.last;
};

getCoin();

// 3초마다 비트코인 가격이 나오는 프로그램 만들기
setInterval(() => getCoin(), 3000);
