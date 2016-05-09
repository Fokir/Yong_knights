(function () {
    var dialog = new _dialog('empty_house');
    var step_1 = new Phrase('Вы', '*тук-тук* Здравствуйте, есть ли здесь кто-то!?');
    var step_2 = step_1.next = new Phrase('Дом', '*Зловещая тишина*');
    var step_3 = step_2.next = new Phrase('Вы', 'Наверное мне стоит идти дальше');
    dialog.start = step_1;
})();