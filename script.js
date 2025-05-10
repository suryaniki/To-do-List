let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';
    li.innerHTML = `
      <span>${task.title} (${task.date})</span>
      <div>
        <button onclick="toggleDone(${index})">✔</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
  updateDashboard();
  renderCalendar();
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById('taskInput').value;
  const date = document.getElementById('taskDate').value;
  if (!title || !date) return;
  tasks.push({ title, date, done: false });
  document.getElementById('taskInput').value = '';
  document.getElementById('taskDate').value = '';
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function updateDashboard() {
  const done = tasks.filter(t => t.done).length;
  const dueToday = tasks.filter(t => t.date === new Date().toISOString().split('T')[0] && !t.done).length;
  document.getElementById('summary').textContent = `${dueToday} due today, ${done} completed.`;
}

function renderCalendar() {
  const calendar = document.getElementById('calendarDays');
  calendar.innerHTML = '';
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const div = document.createElement('div');
    div.textContent = i;

    const dayTasks = tasks.filter(t => t.date === dateStr);
    if (dayTasks.length > 0) {
      div.classList.add('has-task');
      const taskSpan = document.createElement('span');
      taskSpan.className = 'task-title';
      taskSpan.textContent = dayTasks[0].title + (dayTasks.length > 1 ? ' +' : '');
      div.appendChild(taskSpan);
    }

    div.addEventListener('click', () => {
      div.classList.add('clicked');
      setTimeout(() => div.classList.remove('clicked'), 500);
      alert(`Tasks on ${dateStr}:\n${dayTasks.map(t => '- ' + t.title).join('\n') || 'No tasks'}`);
    });

    calendar.appendChild(div);
  }
}

function switchSection(id) {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`nav button[onclick*="${id}"]`).classList.add('active');
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

renderTasks();
