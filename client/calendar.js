const calendarMain = document.querySelector("#calendar-main");
const yearTxt = document.querySelector("#calendar-year");
const yearDown = document.querySelector("#year-down")
const yearUp = document.querySelector("#year-up")
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const d = new Date();
let currentYear = d.getFullYear();
let currentMonth = d.getMonth();

// currentYear = 2020
// currentMonth = 1

// Constructors
const isLeapYear = (year) =>
  (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
const febDays = (year) => (isLeapYear(year) ? 29 : 28);
const createTag = (type, id, className, parentNode) => {
  let newTag = document.createElement(`${type}`);
  newTag.setAttribute('id', `${id}`);
  newTag.setAttribute('class', `${className}`);
  parentNode.appendChild(newTag);

  return newTag;
};
const loadCalendar = (year, month) =>{
  yearTxt.innerHTML = `${monthNames[month]} ${year}`;
  const daysInMonth = [31, febDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const startsIn = new Date(year, month, 1).getDay()
  for (i = 1; i < startsIn; i++) {
    const elem = createTag(
      'div',
      `calendar-dayTEST`,
      `calendar_block off_block`,
      calendarMain
    );
  }
  for (i = 1; i <= daysInMonth[month]; i++) {
    const elem = createTag(
      'div',
      `calendar-day${i}`,
      `calendar_block on_block`,
      calendarMain
    );
    elem.innerHTML = `${i}`;
  }
  const endsIn = (7-(calendarMain.childElementCount % 7))
  if (endsIn != 7){
  for (i = 0; i < endsIn; i++) {
    const elem = createTag(
      'div',
      `calendar-dayTEST`,
      `calendar_block off_block`,
      calendarMain
    );
  }}
}

loadCalendar(currentYear, currentMonth)
yearDown.addEventListener("click", ()=>{
  yearTxt.innerHTML = ""
  calendarMain.innerHTML = ""
  if (currentMonth>0) {
    currentMonth--
  } else {
    currentYear-- 
    currentMonth = 11
  }
  loadCalendar(currentYear, currentMonth)
})
yearUp.addEventListener("click", ()=>{
  yearTxt.innerHTML = ""
  calendarMain.innerHTML = ""
  if (currentMonth<11) {
    currentMonth++
  } else {
    currentYear++
    currentMonth = 0
  }
  loadCalendar(currentYear, currentMonth)
})