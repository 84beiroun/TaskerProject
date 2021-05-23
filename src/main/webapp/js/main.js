document.addEventListener('DOMContentLoaded', () => {
    const preloaderAll = document.querySelectorAll('.card__preloader');

    for (let index = 0; index < preloaderAll.length; index++) {
        const preloader = preloaderAll[index];
        preloader.remove();
    }

    const updateData = () => {
        return document.querySelectorAll('.card')
    }


 loadAllCards();
    function restoringCards(cardId, title, desc, cardBirth){

        const oldCardModel =
            `<li class = "grid__item">
				<button class="card" data-graph-path="first" data-graph-speed="500">
					<span class="card__id visually-hidden">${cardId}</span>
					<h3 class="card__title">${title}</h3>
					<p class="card__descr">${desc}</p>
					<time class="card__birth">${cardBirth}</time>           
				</button>
			</li>`;

        const grid = document.querySelector('.grid__list');
        grid.insertAdjacentHTML('afterbegin', oldCardModel);


    }

    function loadAllCards(){
        let request=new XMLHttpRequest();
        var obj;
        request.open("GET", "OnLoadServlet" , false);
        request.onload = function (){
            if (request.readyState === request.DONE) {
                if (request.status === 200) {
                    let str = request.responseText;
                    str = str.replace(/\\/g, '');
                    str = str.replace('{"obj":"', '')
                    str = str.substring(0, str.length - 2);
                    obj = parseJson(str);
                    console.log(obj);
                    for (var i = 0; i < obj.length; i++){
                        restoringCards(obj[i].id, obj[i].title, obj[i].desc, obj[i].date);
                    }

                }
            }
        }
        request.send();
    }


    // ФУНКЦИЯ ПОПОЛЕНЕНИЯ ОТКРЫТОЙ КАРТОЧКИ КОНТЕНТОМ ИЗ НАЖАТОЙ КАРТОЧКИ

    const fillOpenedCard = (card) => {
        if (card) {
            let cardTitle = card.querySelector('.card__title').innerHTML,
                cardDescr = card.querySelector('.card__descr').innerHTML,
                cardBirth = card.querySelector('.card__birth').innerHTML,
                cardID = card.querySelector('.card__id').innerHTML;

            console.log('cardTitle: ' + cardTitle);
            console.log('cardDescr: ' + cardDescr);
            console.log('cardBirth: ' + cardBirth);
            console.log('cardID: ' + cardID);

            openedCardTitle.value = cardTitle;
            openedCardDescr.value = cardDescr;
            openedCardBirth.textContent = cardBirth;
            openedCardID.textContent = cardID;
        }
    }



    let cardAll = updateData();

    let openedCardTitle = document.querySelector('.opened-card__title'),
        openedCardDescr = document.querySelector('.opened-card__descr'),
        openedCardBirth = document.querySelector('.opened-card__birth'),
        openedCardID = document.querySelector('.opened-card__id'),
        openedCard = document.querySelector('.opened-card');

    for (let index = 0; index < cardAll.length; index++) {
        const card = cardAll[index];

        card.addEventListener('click', () => {
            fillOpenedCard(card)
        });
    }

    let mo = new MutationObserver(() => {
        let cardAll = updateData();

        for (let index = 0; index < cardAll.length; index++) {
            const card = cardAll[index];

            console.log(cardAll);

            card.addEventListener('click', () => {
                fillOpenedCard(card)
            });
        }
    });

    // ДОБАВЛЕНИЕ КАРТОЧКИ

    const addCard = () => {

		mo.observe(document.querySelector('.grid__list'), {
		    childList: true,
		});

        console.log('Adding a new task... ');


        // ПОЛУЧЕНИЕ ЛОКАЛЬНОЙ ДАТЫ

        let nowDate = new Date();
        let nowDay = nowDate.getDate();
        let nowMonth = nowDate.getMonth() + 1;
        let nowYear = nowDate.getFullYear();
        let cardBirth = `${nowDay}.${(nowMonth < 10) ? "0" + nowMonth : nowMonth }.${nowYear}`;

        // ГЕНЕРАТОР ID

        getGeneratedID = () => {
            let min = 1000,
                max = 9999;
            const cardIDAll = document.querySelectorAll('.card__id');

            min = Math.ceil(min);
            max = Math.floor(max);
            generatedID = Math.floor(Math.random() * (max - min + 1)) + min;

            for (let index = 0; index < cardIDAll.length; index++) {
                const cardID = cardIDAll[index];

                if (generatedID !== cardID) break;
            }

            return generatedID;
        }

        let newID = getGeneratedID();

        const cardModel =
            `<li class = "grid__item">
				<button class="card _adding" data-graph-path="first" data-graph-speed="500">
					<span class="card__id visually-hidden">${newID}</span>
					<h3 class="card__title"></h3>
					<p class="card__descr"></p>
					<time class="card__birth">${cardBirth}</time>
				</button>
			</li>`;

        const grid = document.querySelector('.grid__list');
        grid.insertAdjacentHTML('afterbegin', cardModel);

        setTimeout(() => {
            const card = document.querySelector('.card');
            card.classList.remove('_adding');
        }, 10);

        openedCardID.textContent = newID;
        openedCardBirth.textContent = cardBirth;
        editOpenedCard();
        modal.open('first');
    }

    const btnAdd = document.querySelector('.header__add');

    btnAdd.addEventListener('click', addCard);

    // УДАЛЕНИЕ КАРТОЧКИ

    const deleteCard = (id) => {

        if (id) {

			mo.observe(document.querySelector('.grid__list'), {
			    childList: true,
			});

			let request=new XMLHttpRequest();
            request.open("POST", "CardRemoveServlet" , true);
            request.send(id);

            console.log('Deleting card...');

            cardAll = updateData();

            for (let index = 0; index < cardAll.length; index++) {
                const card = cardAll[index];
                let cardID = card.querySelector('.card__id');

                if (cardID.innerHTML === id) {
                    let gridItem = card.closest('.grid__item');
                    card.classList.add('_deleting');
					modal.close();
                    setTimeout(() => {
                        gridItem.remove();
                    }, 300);
                }
            }
        }
    }

    // ОЧИСТКА ПОЛЕЙ 

    const clearOpenedCard = () => {

        console.log('Clearing opened-card...');

        openedCardTitle.value = null;
        openedCardDescr.value = null;
        openedCardBirth.textContent = null;
        openedCardID.textContent = null;

    }

    // РЕДАКТИРОВАНИЕ ПОЛЕЙ

    const editOpenedCard = () => {

        console.log('Editing task...');

        openedCard.classList.add('_editing');
        openedCardTitle.removeAttribute('disabled');
        openedCardDescr.removeAttribute('disabled');
    }

    // СОХРАНЕНИЕ  

    const saveOpenedCard = (id) => {

        if (id) {
            console.log('Saving of task...');

            cardAll = updateData();

            let newCardTitle = openedCardTitle.value,
                newCardDescr = openedCardDescr.value;

            if (newCardTitle === '' && newCardDescr === '') deleteCard(id)
            else {
                for (let index = 0; index < cardAll.length; index++) {
                    let card = cardAll[index],
                        cardTitle = card.querySelector('.card__title'),
                        cardDescr = card.querySelector('.card__descr'),
                        cardID = card.querySelector('.card__id'),
						cardDate = card.querySelector('.card__birth');

                    if (id === cardID.innerHTML) {
                        cardTitle.textContent = newCardTitle;
                        cardDescr.textContent = newCardDescr;
						let cardToSave = {
                            id: cardID.textContent,
                            title: cardTitle.textContent,
                            desc: cardDescr.textContent,
                            date: cardDate.textContent
                        };
						  let request=new XMLHttpRequest();
                        request.open("POST", "CardSaveServlet" , true);
                        request.send(JSON.stringify(cardToSave));
                    }
                }
            }

            openedCard.classList.remove('_editing');
            openedCardTitle.setAttribute('disabled', '');
            openedCardDescr.setAttribute('disabled', '');

			mo.disconnect();
        }
    }

    // ИНИЦИАЛИЗЦАЯ МОДАЛЬНОГО ОКНА

    const modal = new GraphModal({
        isOpen: () => {
            const btnEdit = document.querySelector('.opened-card__edit'),
                btnDelete = document.querySelector('.opened-card__delete'),
                btnSave = document.querySelector('.opened-card__save');

            btnEdit.addEventListener('click', editOpenedCard);
            btnDelete.addEventListener('click', () => {
                deleteCard(openedCardID.innerHTML)
            });
            btnSave.addEventListener('click', () => {
                saveOpenedCard(openedCardID.innerHTML)
            });
        },
        isClose: () => {

            // TIMEOUT ЧТОБЫ КРАСОТУ НЕ ИСПОРИТЬ ПРИ ЗАКРЫТИИ

            setTimeout(() => {
                saveOpenedCard(openedCardID.innerHTML);
                clearOpenedCard();
            }, 500);
        }
    });

    // СКРЫВАЕТ ШАПКУ ПРИ СКРОЛЛЕ ВНИЗ

    const header = document.querySelector('.header'),
        headerShell = document.querySelector('.header-shell');

    let headerHeight = header.offsetHeight,
        lastScrollValue = 0;

    headerShell.style.setProperty('--header-height', `${headerHeight}px`);

    const ro = new ResizeObserver(entries => {
        let headerHeight = header.offsetHeight;
        headerShell.style.setProperty('--header-height', `${headerHeight}px`);
    });

    ro.observe(header);

    window.addEventListener('scroll', (e) => {

        let scrollDistance = window.scrollY;

        if (scrollDistance === 0) header.classList.remove('_hidden');

        (scrollDistance > lastScrollValue) ? header.classList.add('_hidden'): header.classList.remove('_hidden');

        lastScrollValue = scrollDistance;
    });

function parseJson(data) {
        data = data.replace('\n', '', 'g');

        var
            start = data.indexOf('{'),
            open = 0,
            i = start,
            len = data.length,
            result = [];

        for (; i < len; i++) {
            if (data[i] == '{') {
                open++;
            } else if (data[i] == '}') {
                open--;
                if (open === 0) {
                    result.push(JSON.parse(data.substring(start, i + 1)));
                    start = i + 1;
                }
            }
        }
        data[data.length] = "\n";
        return result;
    }
});