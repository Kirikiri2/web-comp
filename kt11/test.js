describe('TaskList Component', function() {
    let component;

    beforeEach(function() {
        component = document.createElement('task-list');
        document.body.appendChild(component);
        component.tasks = [];
        component.render();
    });

    afterEach(function() {
        component.remove();
    });

    it('добавляет задачу', function() {
        component.addTask('Тестовая задача');
        assert.equal(component.tasks.length, 1);
        assert.equal(component.tasks[0].text, 'Тестовая задача');
    });

    it('удаляет задачу', function() {
        component.addTask('Задача 1');
        const id = component.tasks[0].id;
        component.removeTask(id);
        assert.equal(component.tasks.length, 0);
    });

    it('отмечает задачу как выполненную', function() {
        component.addTask('Задача 1');
        const id = component.tasks[0].id;
        component.toggleTask(id);
        assert.isTrue(component.tasks[0].completed);
    });

    it('корректно отображает список после изменений', function() {
        component.addTask('Задача 1');
        component.addTask('Задача 2');
        component.toggleTask(component.tasks[0].id);
        const liElements = component.shadowRoot.querySelectorAll('li');
        assert.equal(liElements.length, 2);
        assert.isTrue(liElements[0].classList.contains('completed'));
        assert.isFalse(liElements[1].classList.contains('completed'));
    });
});
