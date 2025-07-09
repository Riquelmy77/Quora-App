window.onload = function() {
  
  const agendaTabBtn = document.getElementById('agendaTabBtn');
  const tasksTabBtn = document.getElementById('tasksTabBtn');
  const agendaPanel = document.getElementById('agendaPanel');
  const tasksPanel = document.getElementById('tasksPanel');

  agendaTabBtn.onclick = () => {
    agendaTabBtn.classList.add('active');
    tasksTabBtn.classList.remove('active');
    agendaPanel.style.display = '';
    tasksPanel.style.display = 'none';
  };
  tasksTabBtn.onclick = () => {
    tasksTabBtn.classList.add('active');
    agendaTabBtn.classList.remove('active');
    agendaPanel.style.display = 'none';
    tasksPanel.style.display = '';
  };

  const monthYear = document.getElementById('monthYear');
  const calendarDays = document.getElementById('calendarDays');
  const selectedDateTitle = document.getElementById('selectedDateTitle');
  const eventsList = document.getElementById('eventsList');
  const eventInput = document.getElementById('eventInput');
  const addEventBtn = document.getElementById('addEventBtn');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const notesInput = document.getElementById('notesInput');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const notesList = document.getElementById('notesList');

  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const tasksList = document.getElementById('tasksList');
  
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate = new Date(currentYear, currentMonth, today.getDate());

  function renderTasks() {
    tasksList.innerHTML = '';
    getTasks((tasks) => {
      if (tasks.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma tarefa adicionada.';
        li.style.opacity = '0.6';
        tasksList.appendChild(li);
      } else {
        tasks.forEach((task) => {
          const li = document.createElement('li');
          li.className = task.done ? 'task-completed' : '';
          li.textContent = task.text;

          const actions = document.createElement('span');
          actions.className = 'task-actions';

          const doneBtn = document.createElement('button');
          doneBtn.textContent = task.done ? '↩️' : '✔️';
          doneBtn.title = task.done ? 'Desfazer' : 'Concluir';
          doneBtn.onclick = () => {
            updateTask(task._id, { done: !task.done }, renderTasks);
          };
          actions.appendChild(doneBtn);

          const delBtn = document.createElement('button');
          delBtn.textContent = '🗑️';
          delBtn.title = 'Remover';
          delBtn.onclick = () => {
            removeTask(task._id, renderTasks);
          };
          actions.appendChild(delBtn);

          li.appendChild(actions);
          tasksList.appendChild(li);
        });
      }
    });
  }

  addTaskBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (!text) return;
    saveTask({ text, done: false }, renderTasks);
    taskInput.value = '';
  };
  taskInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addTaskBtn.onclick();
  });

  function getDateKey(date) {
    return `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`;
  }

  function getEventsForDate(date, callback) {
    const key = getDateKey(date);
    eventsDB.findOne({ key }, (err, doc) => {
      callback(doc ? doc.events : []);
    });
  }

  function saveEventsForDate(date, events) {
    const key = getDateKey(date);
    eventsDB.update({ key }, { key, events }, { upsert: true });
  }

  function getNotesForDate(date, callback) {
    const key = getDateKey(date);
    notesDB.findOne({ key }, (err, doc) => {
      callback(doc ? doc.notes : []);
    });
  }

  function saveNotesForDate(date, notes) {
    const key = getDateKey(date);
    notesDB.update({ key }, { key, notes }, { upsert: true });
  }

  function renderAgenda() {
    selectedDateTitle.textContent = `Compromissos de ${selectedDate.getDate()} de ${getMonthName(selectedDate.getMonth())}`;
    eventsList.innerHTML = '';
    getEventsForDate(selectedDate, (events) => {
      if (events.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhum compromisso para este dia.';
        li.style.opacity = '0.6';
        eventsList.appendChild(li);
      } else {
        events.forEach((event, idx) => {
          const li = document.createElement('li');
          li.textContent = event;
          const delBtn = document.createElement('button');
          delBtn.textContent = '🗑️';
          delBtn.className = 'event-delete';
          delBtn.onclick = () => {
            events.splice(idx, 1);
            saveEventsForDate(selectedDate, events);
            renderAgenda();
          };
          li.appendChild(delBtn);
          eventsList.appendChild(li);
        });
      }
    });
  }

  addEventBtn.onclick = () => {
    getEventsForDate(selectedDate, (events) => {
      const eventText = eventInput.value.trim();
      if (!eventText) return;
      events.push(eventText);
      saveEventsForDate(selectedDate, events);
      eventInput.value = '';
      renderAgenda();
    });
  };
  eventInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addEventBtn.onclick();
  });

  function renderNotes() {
    notesInput.value = '';
    notesList.innerHTML = '';
    getNotesForDate(selectedDate, (notes) => {
      if (notes.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma nota para este dia.';
        li.style.opacity = '0.6';
        notesList.appendChild(li);
      } else {
        notes.forEach((note, idx) => {
          const li = document.createElement('li');
          li.textContent = note;
          const delBtn = document.createElement('button');
          delBtn.textContent = '🗑️';
          delBtn.className = 'event-delete';
          delBtn.onclick = () => {
            notes.splice(idx, 1);
            saveNotesForDate(selectedDate, notes);
            renderNotes();
          };
          li.appendChild(delBtn);
          notesList.appendChild(li);
        });
      }
    });
  }

  saveNoteBtn.onclick = () => {
    getNotesForDate(selectedDate, (notes) => {
      const noteText = notesInput.value.trim();
      if (!noteText) return;
      notes.push(noteText);
      saveNotesForDate(selectedDate, notes);
      notesInput.value = '';
      saveNoteBtn.textContent = "Salvo!";
      setTimeout(() => saveNoteBtn.textContent = "Salvar Nota", 1000);
      renderNotes();
    });
  };

  notesInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            saveNoteBtn.onclick();
        } 
  });

  function renderCalendar(month, year) {
    monthYear.textContent = `${getMonthName(month)} ${year}`;
    calendarDays.innerHTML = '';
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('li');
      empty.textContent = '';
      empty.style.background = 'transparent';
      empty.style.cursor = 'default';
      calendarDays.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const li = document.createElement('li');
      li.textContent = d;
      if (
        d === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear()
      ) {
        li.classList.add('selected');
      }
      li.onclick = () => {
        selectedDate = new Date(year, month, d);
        renderCalendar(month, year);
        renderAgenda();
        renderNotes();
      };
      calendarDays.appendChild(li);
    }
  }

  function getMonthName(month) {
    const months = [
      'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
    ];
    return months[month];
  }

  prevMonthBtn.onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    selectedDate = new Date(currentYear, currentMonth, 1);
    renderCalendar(currentMonth, currentYear);
    renderAgenda();
    renderNotes();
  };

  nextMonthBtn.onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    selectedDate = new Date(currentYear, currentMonth, 1);
    renderCalendar(currentMonth, currentYear);
    renderAgenda();
    renderNotes();
  };

  renderTasks();
  renderCalendar(currentMonth, currentYear);
  renderAgenda();
  renderNotes();
};

const { eventsDB, notesDB, tasksDB } = require('./db.js');

function getTasks(callback) {
  tasksDB.find({}, (err, docs) => {
    callback(docs || []);
  });
}

function saveTask(task, callback) {
  tasksDB.insert(task, callback);
}

function updateTask(id, update, callback) {
  tasksDB.update({ _id: id }, { $set: update }, {}, callback);
}

function removeTask(id, callback) {
  tasksDB.remove({ _id: id }, {}, callback);
}