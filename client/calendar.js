const logout = document.querySelector('div#logout');
const calendarMain = document.querySelector('#calendar-main');
const yearTxt = document.querySelector('#calendar-year');
const monthDown = document.querySelector('#month-down');
const monthUp = document.querySelector('#month-up');
const yearDown = document.querySelector('#year-down');
const yearUp = document.querySelector('#year-up');

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
let server = `http://localhost:3000`;
let accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
  location.href = './login.html';
}
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
const getTasks = async (auth, year, month) => {
  return fetch(`${server}/monthTask/${year}/${month}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    cache: 'default',
  }).then((res) => res.json());
};
const createTask = async (auth, body) => {
  return fetch(`${server}/addTask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'default',
  }).then((res) => res.json());
};

const loadCalendar = async (year, month) => {
  yearTxt.innerHTML = `${monthNames[month]} ${year}`;
  const daysInMonth = [
    31,
    febDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  const startsIn = new Date(year, month, 1).getDay();
  const monthTasks = await getTasks(accessToken, year, month + 1);
  if (monthTasks.msg == 'unauthorized') location.href = './login.html';

  for (i = 1; i < startsIn; i++) {
    const elem = createTag(
      'div',
      `calendar-dayTEST`,
      `calendar_block off_block`,
      calendarMain
    );
  }
  for (i = 1; i <= daysInMonth[month]; i++) {
    let day = i;
    //Day box
    const elem = createTag(
      'div',
      `calendar-day${i}`,
      `calendar_block on_block`,
      calendarMain
    );
    //Day box number
    const txtElem = createTag('span', `txt-day${i}`, `txt_day`, elem);
    txtElem.innerHTML = `${i}`;
    //Day box tasks
    const tasksDiv = createTag('div', `task${i}`, `tasks`, elem);
    const taskP = createTag('p', `taskp${i}`, 'task', tasksDiv);

    //Gets tasks for the day
    let dayTask = monthTasks.filter((obj) => obj.day == i);
    let taskAmount = dayTask.length;
    taskP.innerHTML = `${taskAmount} tasks`;
    switch (taskAmount) {
      case 0:
        break;
      case 1:
        tasksDiv.style.boxShadow = 'inset 0 0 6vmin 0.2vmin rgb(0, 255, 0)';
        break;
      case 2:
        tasksDiv.style.boxShadow = 'inset 0 0 6vmin 0.2vmin rgb(255, 255, 0)';
        break;
      case 3:
        tasksDiv.style.boxShadow = 'inset 0 0 6vmin 0.2vmin rgb(255, 100, 0)';
        break;
      default:
        tasksDiv.style.boxShadow = 'inset 0 0 6vmin 0.2vmin rgb(255, 0, 0)';
        break;
    }
    elem.addEventListener('click', () => {
      let overlay = createTag(
        'div',
        'overlay',
        'overlay',
        document.querySelector('main')
      );

      let popup = createTag('div', 'main-popup', 'main_popup', overlay);
      let popTitle = createTag('div', 'popup-title', 'popup_title', popup);
      let popTitleSpan = createTag(
        'span',
        'popup-title-span',
        'popup_title_span',
        popTitle
      );
      popTitleSpan.innerHTML = `${day}/${month + 1}`;
      let popTasks = createTag('div', 'popup-tasks', 'popup_tasks', popup);

      let popAdd = createTag('div', 'popup-add', 'popup_add', popup);
      let popButton = createTag('button', 'newTask', 'newTask', popAdd);
      popButton.innerHTML = `+`;
      let popAddTxt = createTag('span', 'newTask', 'newTask', popAdd);
      popAddTxt.innerHTML = `New Task`;

      dayTask.forEach((el) => {
        let popTask = createTag('div', 'popup-task', 'popup_task', popTasks);
        let popTaskTxt = createTag(
          'span',
          'popup-task-txt',
          'popup_task_txt',
          popTask
        );
        let popTaskTime = createTag(
          'span',
          'popup-task-time',
          'popup_task_time',
          popTask
        );
        let hour = Math.floor(el.time / 60).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
        });
        let minute = (el.time % 60).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
        });
        popTaskTxt.innerHTML = `${el.description}`;
        popTaskTime.innerHTML = `${hour}:${minute}`;
      });
      overlay.addEventListener('click', (data) => {
        if (data.target.id == 'overlay') {
          overlay.remove();
        }
      });
      popButton.addEventListener('click', () => {
        let overlay2 = createTag(
          'div',
          'overlay-2',
          'overlay',
          document.querySelector('main')
        );
        let newPopup = createTag('div', 'new-popup', 'new_popup', overlay2);
        let taskInfo = createTag('div', 'task-info', 'task_info', newPopup);
        let taskDesc = createTag(
          'textarea',
          'task-description',
          'task_description',
          taskInfo
        );
        taskDesc.placeholder = 'Add a description';
        taskDesc.cols = 30;
        taskDesc.rows = 10;
        let taskTime = createTag('input', 'task-time', 'task_time', taskInfo);
        taskTime.type = 'time';
        let createTaskBtn = createTag(
          'input',
          'create-task',
          'create_task',
          newPopup
        );
        createTaskBtn.type = 'button';
        createTaskBtn.value = 'Create Task';

        createTaskBtn.addEventListener('click', async () => {
          let timeInput = taskTime.value.split(':');
          let timeInMinute = 0;
          let desc = 'Scheduled task';
          if (timeInput[0] != '')
            timeInMinute = Number(timeInput[0]) * 60 + Number(timeInput[1]);
          if (taskDesc.value != 0) desc = taskDesc.value;
          let body = {
            description: `${desc}`,
            date: {
              year: year,
              month: month + 1,
              day: day,
              time: timeInMinute,
            },
          };

          let res = await createTask(accessToken, body);
          console.log(res.msg);
          calendarMain.innerHTML = '';
          loadCalendar(year, month);
          overlay2.remove();
          overlay.remove();
        });
        overlay2.addEventListener('click', (data) => {
          if (data.target.id == 'overlay-2') {
            overlay2.remove();
          }
        });
      });
    });
  }
  const endsIn = 7 - (calendarMain.childElementCount % 7);
  if (endsIn != 7) {
    for (i = 0; i < endsIn; i++) {
      const elem = createTag(
        'div',
        `calendar-dayTEST`,
        `calendar_block off_block`,
        calendarMain
      );
    }
  }
};
loadCalendar(currentYear, currentMonth);
logout.addEventListener('click', () => {
  localStorage.removeItem('accessToken');
  location.href = './login.html';
});
monthDown.addEventListener('click', () => {
  yearTxt.innerHTML = '';
  calendarMain.innerHTML = '';
  if (currentMonth > 0) {
    currentMonth--;
  } else {
    currentYear--;
    currentMonth = 11;
  }
  loadCalendar(currentYear, currentMonth);
});
monthUp.addEventListener('click', () => {
  yearTxt.innerHTML = '';
  calendarMain.innerHTML = '';
  if (currentMonth < 11) {
    currentMonth++;
  } else {
    currentYear++;
    currentMonth = 0;
  }
  loadCalendar(currentYear, currentMonth);
});
yearDown.addEventListener('click', () => {
  yearTxt.innerHTML = '';
  calendarMain.innerHTML = '';
  if (currentYear > 1970) {
    currentYear--;
  }
  loadCalendar(currentYear, currentMonth);
});
yearUp.addEventListener('click', () => {
  yearTxt.innerHTML = '';
  calendarMain.innerHTML = '';
  currentYear++;
  loadCalendar(currentYear, currentMonth);
});
