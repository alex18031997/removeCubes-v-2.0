let points = document.querySelector('.points span'); // получаем данные из points
let getTime = document.querySelector('.time span'); // получаем кол. сек.
let countPoints = 0; // переменная которая будет счетчиком pints
let leftTime = 0; // переменная которая будет счетчиком time
let modal = document.querySelector('.modal'); // получаем модальное окно
let localObj = []; // пустой объект куда будет передаваться данные для local storage

// функция которая возвращат случайное число в заданом диапазоне
let getRandomNum = (a, b, ) => {
    let rand = a + Math.random() * (b + 1 - a);
    return Math.floor(rand);
}
// присваиваемый каждому кубику случайный цвет
let setRandomColor = () => {
    countPoints = 0;
    points.innerHTML = countPoints;
    leftTime = 0;
    getTime.innerHTML = leftTime;
    let col = document.querySelectorAll('.random');
    for(let item of col) {
        item.style.background = `rgb(${getRandomNum(0, 255)} ${getRandomNum(0, 255)} ${getRandomNum(0, 255)})`;
    }
}
setRandomColor(); // сразу же вызываем функцию

// добавляем событие клик для кубиков которое удаляет кубик и добавляет очки

let row = document.querySelector('.row');
row.addEventListener('click', closeCube);
function closeCube(e) {
    if(e.target.className !== 'col-md-2 blackWhite' && e.target.className !== 'row' && e.target.getAttribute('data') < 3 && start.classList[1] === 'hide'){
        e.target.classList.add('hide');
        countPoints = countPoints + +e.target.getAttribute('data');
        points.innerHTML = countPoints;
        for(let i = 0; i < getRandomNum(0,3); i++) {
            createElem()
        }
    } else if(start.classList[1] !== 'hide'){
        alert('Для начала/продолжения игры нажмите кнопку "Старт"')
    }
}

// добавляем событие даблклик для больших кубиков которое удаляет кубик и добавляет очки

row.addEventListener('dblclick', closeBigCube);
function closeBigCube(e){
    if(e.target.className !== 'col-md-2 blackWhite' && e.target.className !== 'row' && e.target.getAttribute('data') >= 3 && start.classList[1] === 'hide'){
        e.target.classList.add('hide');
        countPoints = countPoints + +e.target.getAttribute('data');
        points.innerHTML = countPoints;
        for(let i = 0; i < getRandomNum(0,3); i++) {
            createElem()
        }
    } else if(start.classList[1] !== 'hide'){
        alert('Для начала/продолжения игры нажмите кнопку "Старт"')
    }
}

// создаем случайное количество новых элементов

let createElem = () => {
    let elem = document.createElement('div');
    let md = getRandomNum(1,3);
    elem.className = `col-md-${md}`;
    elem.classList.add('random');
    elem.setAttribute('data', md)
    elem.style.background = `rgb(${md} ${getRandomNum(0, 255)} ${getRandomNum(0, 255)})`;
    row.prepend(elem)
}

// функция timer добавляет +1 к leftTime

let interVal; // объявляем переменную для хранения в ней setInterval
let timer = () => {
    getTime.innerHTML = leftTime++;
    if(leftTime === 60) {
        showModal();
    }
}

// показываем модальное окно

let showModal = () => {
    document.querySelector('.result p').innerHTML = countPoints;
    modal.style.display = 'flex';
    clearInterval(interVal);
}

// программируем кнопки "старт" и "пауза"

let pause = document.querySelector('.pause');
let start = document.querySelector('.start');

let changePauseOnStart = () => {
    pause.classList.remove('btn');
    pause.classList.add('hide');
    start.classList.remove('hide');
    start.classList.add('btn');
}

start.addEventListener('click', () => {
    if(leftTime === 0){
        leftTime++
        getTime.innerHTML = leftTime++
    }
    interVal = setInterval(timer, 1000); // запускаем setInterval для с интервалом 1 сек, счетчика секунл
    start.classList.remove('btn');
    start.classList.add('hide');
    pause.classList.remove('hide');
    pause.classList.add('btn');

})

pause.addEventListener('click', () => {
    clearInterval(interVal); // останавливаем setInterval
    changePauseOnStart();
})

// программируем кнопку "новая игра"

document.querySelector('.newGame').addEventListener('click', () => {
    clearInterval(interVal);
    setRandomColor();
    changePauseOnStart();
});

// программируем клавиши модального окна "Сохранить и "Отмена"

document.querySelector('.resCnc').addEventListener('click', () => {
    clearInterval(interVal);
    setRandomColor();
    changePauseOnStart();
    modal.style.display = 'none'
});

//функция которая добавляет данные в localStorage

let setToLS = () => {
    let myInput = document.querySelector('.myInput');
    let b = {
        name: myInput.value,
        result: countPoints
    }
    localObj.push(b);
    localStorage.setItem('result', JSON.stringify(localObj));
    modal.style.display = 'none'
    myInput.value = '';
}

// функция получает данные с input и сетит их в localStorage

document.querySelector('.resSave').addEventListener('click', () => {
    let myInput = document.querySelector('.myInput');
    if(myInput.value.length < 3) {
        document.querySelector('.checkLength').classList.remove('hide');
    }
    else if(localStorage.length === 0 && myInput.value.length >= 3) {
        setToLS();
        setRandomColor();
        changePauseOnStart();
        checkLS();


    } else {
        localObj = JSON.parse(localStorage.getItem('result'));
        setToLS();
        setRandomColor();
        changePauseOnStart();
        checkLS();
    }
})

// сохраняем данные в докал local storage

let tableResult = document.querySelector('.table-result p');
let clearBtn = document.querySelector('.clearBtn');

// функция которая проверяет localStorage и отрисовует таблицы поля с результатами

let checkLS = () => {
    if(localStorage.length === 0) {
        tableResult.innerHTML = 'Здесь пока нет записей'
    } else {
        let out = '';
        document.querySelector('.table-result').style.display = 'block';
        let obj = JSON.parse(localStorage.getItem('result'));
        let objSort = obj.sort(function (a, b) {
            if (a.result < b.result) {
                return 1;
            }
            if (a.result > b.result) {
                return -1;
            }
            return 0;
        });

        for(let item in objSort){
                out += `<p>Место: ${+item + 1}, Имя: ${objSort[item].name}, Результат: ${objSort[item].result}</p>`;
            }
        tableResult.innerHTML = out;
        clearBtn.style.display = 'block';
        }
}

// кнопка очистки таблицы с результатами

clearBtn.addEventListener('click', () => {
    localStorage.clear();
    document.querySelector('.table-result').style.display = 'flex';
    clearBtn.style.display = 'none';
    localObj = [];
    checkLS();
})
checkLS();









