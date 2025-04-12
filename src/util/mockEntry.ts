import { Entry } from "../pages/diary/entry/EntryList";
import { uuidv4 } from "./util";

const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomText = () => {
  const textOptions = ["Dessert", "Exercise", "Ibuprofen", "Coffee"];
  return textOptions[getRandomIntInclusive(0, textOptions.length - 1)];
};

const getRandomSleepText = () => {
  const textOptions = ["Poor", "Terrible", "Okay", "Good", "Great"];
  const text = textOptions[getRandomIntInclusive(0, textOptions.length - 1)];
  return `Sleep (${text})`;
};

const getSleepEnty = (start: Date): Entry => {
  start.setHours(getRandomIntInclusive(22, 23))
  start.setMinutes(getRandomIntInclusive(0, 59))
  const text = getRandomSleepText();

  return {
    startTime: start,
    endTime: start,
    text,
    id: uuidv4(),
  };
};

const getMockEntry = (start: Date): Entry => {
  start.setHours(getRandomIntInclusive(1, 23))
  start.setMinutes(getRandomIntInclusive(0, 59))
  const text = getRandomText();

  return {
    startTime: start,
    endTime: start,
    text,
    id: uuidv4(),
  };
};

export const getMockDayEntries = (
  numberOfDays: number,
  entriesPerDay: number
): Entry[] => {
  const currentDate = new Date();
  const entries: Entry[] = [];
  for (let i = 0; i < numberOfDays; i++) {
    currentDate.setDate(currentDate.getDate() - 1);
    for (let idx = 0; idx <= entriesPerDay; idx++) {
      entries.push(getMockEntry(new Date(currentDate)));
    }
    entries.push(getSleepEnty(new Date(currentDate)));
  }
  return entries;
};
