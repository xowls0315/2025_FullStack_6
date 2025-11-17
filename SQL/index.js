const { Faker, ko } = require("@faker-js/faker");
const exceljs = require("exceljs");

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const makePerson = () => {
  const randomName = new Faker({ locale: [ko] }).person.fullName();

  const age = getRandomInteger(20, 40);
  const gender = getRandomInteger(0, 1) == 0 ? "male" : "female";
  const phone = new Faker({ locale: [ko] }).phone.number({
    style: "international",
  });

  return {
    name: randomName,
    age: age,
    gender: gender,
    phone: phone,
  };
};

const generateExcel = async () => {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet("students");

  sheet.columns = [
    { header: "Name", key: "name" },
    { header: "Age", key: "age" },
    { header: "Gender", key: "gender" },
    { header: "Phone", key: "phone" },
  ];

  for (let i = 0; i < 100000; i++) {
    sheet.addRow(makePerson());
  }

  await workbook.csv.writeFile("students.csv");
};

generateExcel();
