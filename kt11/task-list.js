class TaskList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.tasks = [];

        // Добавляем стили и структуру
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'task-list.css');
        this.shadowRoot.appendChild(link);

        this.container = document.createElement('div');

        this.container.innerHTML = `
            <h2>Список задач</h2>
            <form id="task-form">
                <input type="text" id="task-input" placeholder="Новая задача">
                <button type="submit">Добавить</button>
            </form>
            <ul id="task-list"></ul>
        `;

        this.shadowRoot.appendChild(this.container);

        this.form = this.shadowRoot.querySelector('#task-form');
        this.input = this.shadowRoot.querySelector('#task-input');
        this.ul = this.shadowRoot.querySelector('#task-list');

        this.form.addEventListener('submit', e => {
            e.preventDefault();
            const value = this.input.value.trim();
            if (value) {
                this.addTask(value);
                this.input.value = '';
            }
        });
    }

    addTask(text) {
        const task = {id: Date.now(), text, completed: false};
        this.tasks.push(task);
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.render();
        }
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.render();
    }

    render() {
        const fragment = document.createDocumentFragment();
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            const span = document.createElement('span');
            span.textContent = task.text;
            span.style.cursor = 'pointer';
            span.addEventListener('click', () => this.toggleTask(task.id));

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Удалить';
            delBtn.addEventListener('click', () => this.removeTask(task.id));

            li.appendChild(span);
            li.appendChild(delBtn);
            fragment.appendChild(li);
        });

        this.ul.innerHTML = '';
        this.ul.appendChild(fragment);
    }
}

customElements.define('task-list', TaskList);
