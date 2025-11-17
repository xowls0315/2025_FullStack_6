const { Faker, ko } = require("@faker-js/faker");
const exceljs = require("exceljs");

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const makePerson = () => {
  const randomName = new Faker({ locale: [ko] }).person.fullName();

  const age = getRandomInteger(0, 80);
  const purposeList = ["tourism", "business", "other"];
  const depatureList = ["incheon", "kimpo", "busan", "jeju"];
  const destinationList = ["tokyo", "osaka", "fukuoka", "saporo"];
  const periodOfStay = getRandomInteger(1, 90);

  return {
    name: randomName,
    age: age,
    purpose: purposeList[Math.floor(Math.random() * purposeList.length)],
    depature: depatureList[Math.floor(Math.random() * depatureList.length)],
    destination:
      destinationList[Math.floor(Math.random() * destinationList.length)],
    periodOfStay: periodOfStay,
  };
};

const generateExcel = async () => {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet("students");

  sheet.columns = [
    { header: "Name", key: "name" },
    { header: "Age", key: "age" },
    { header: "Purpose", key: "purpose" },
    { header: "Depature", key: "depature" },
    { header: "Destination", key: "destination" },
    { header: "PeriodOfStay", key: "periodOfStay" },
  ];

  for (let i = 0; i < 100000; i++) {
    sheet.addRow(makePerson());
  }

  await workbook.csv.writeFile("travels.csv");
};

generateExcel();
