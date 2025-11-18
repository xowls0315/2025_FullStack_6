const { Faker, ko } = require("@faker-js/faker");
const exceljs = require("exceljs");
const Chance = require("chance");
const chance = new Chance();

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const makePerson = () => {
  const randomName = new Faker({ locale: [ko] }).person.fullName();
  const grade = chance.weighted([1, 2, 3, 4, 5, 6], [30, 30, 20, 10, 5, 5]);
  const department_id = getRandomInteger(1, 8);

  return {
    name: randomName,
    grade,
    department_id,
  };
};

const generateExcel = async () => {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet("mzoffice");

  sheet.columns = [
    { header: "Name", key: "name" },
    { header: "Grade", key: "grade" },
    { header: "Department_id", key: "department_id" },
  ];

  for (let i = 0; i < 30000; i++) {
    sheet.addRow(makePerson());
  }

  await workbook.csv.writeFile("students.csv");
};

generateExcel();
