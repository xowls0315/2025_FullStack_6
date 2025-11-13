const logger = (req, res, next) => {
  console.log(`req.url: ${req.url}`);
  console.log(`req.method: ${req.method}`);
  next();
};

// timeChecker 만들어서 미들웨어로 넣기
const timeChecker = (req, res, next) => {
  console.log(new Date().toLocaleTimeString());
  next();
};

const responseFormatter = (req, res, next) => {
  res.success = (data) => {
    res.json({
      success: true,
      data,
      time: new Date().toLocaleDateString(),
    });
  };

  next();
};

module.exports = { logger, timeChecker, responseFormatter };
