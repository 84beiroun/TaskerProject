document.addEventListener('DOMContentLoaded', () => {

    const btnLogin = document.querySelector('.form__login'),
        btnSignup = document.querySelector('.form__signup'),
        formLogin = document.querySelector('.form__shell_left'),
        formSignup = document.querySelector('.form__shell_right'),
        formContainer = document.querySelector('.form__container'),
        logBtnShow = document.getElementById('logShowPassword'),
        regBtnShow = document.getElementById('regShowPassword'),
        regPasswordInput = document.getElementById('regPasswordInput');
		regVerifPasswordInput = document.getElementById('regVerifPasswordInput'),
        regformMsg = document.getElementById('regFormMsg'),
		logformMsg = document.getElementById('logFormMsg'),
		LogButton = document.getElementById('LoginButton'),
        RegButton = document.getElementById('SignupButton');


    btnLogin.addEventListener('click', (e) => {
        event.preventDefault();

        btnSignup.classList.add('_hidden');
        btnLogin.classList.remove('_hidden');

        formSignup.classList.add('_hidden');
        formLogin.classList.remove('_hidden');
        formContainer.style.setProperty('--move-to', '0px');
    });

    btnSignup.addEventListener('click', (e) => {
        event.preventDefault();

        btnSignup.classList.remove('_hidden');
        btnLogin.classList.add('_hidden');

        formLogin.classList.add('_hidden');
        formSignup.classList.remove('_hidden');
        formContainer.style.setProperty('--move-to', '-100%');
    });

    // ПОКАЗ / НЕ ПОКАЗ ПАРОЛЯ

    const togglePassword = (name) => {

        const fieldAll = document.querySelectorAll('.form__field');

        for (let index = 0; index < fieldAll.length; index++) {
            const field = fieldAll[index];

            if (field.getAttribute('name') === name) {
                (field.getAttribute('type') === 'password') ?
                field.setAttribute('type', 'text'): field.setAttribute('type', 'password')
            }
        }

    }

    // ГЛАЗИК ДЛЯ ЛОГИН ПАРОЛЯ

    logBtnShow.addEventListener('click', (e) => {
        event.preventDefault();

        togglePassword("logPassword");
        logBtnShow.classList.toggle('_opened');
    });

    // ГЛАЗИК ДЛЯ РЕГ ПАРОЛЯ

    regBtnShow.addEventListener('click', (e) => {
        event.preventDefault();

        togglePassword("regPassword");
        regBtnShow.classList.toggle('_opened');
    });

    // ПОКАЗ ЧТО ИНВАЛИД ПОЛЕ

    const invalidField = (field) => {
        field.classList.add('_invalid');
        field.classList.remove('_valid');
    }

    // ПОКАЗ ЧТО ВАЛИД ПОЛЕ

    const validField = (field) => {
        field.classList.remove('_invalid');
        field.classList.add('_valid');
    }

    // const showLogMsg = (msg, isValid) => {
    //     logFormMsg.textContent = msg;

    //     isValid
    //     ? validField(logFormMsg) 
    // 	: invalidField(logFormMsg)

    //     setTimeout(() => {
    //         logFormMsg.classList.remove('_hidden');
    //     }, 10)
    // }

    const showRegMsg = (msg, isValid) => {
        regFormMsg.textContent = msg;

        (isValid) ?
        validField(regFormMsg): invalidField(regFormMsg)


        setTimeout(() => {
            regFormMsg.classList.remove('_hidden');
        }, 10)
    }

	const clearAll = () => {
		const fieldAll = document.querySelectorAll('.form__field');
		const msgAll = document.querySelectorAll('.form__msg');
		

		for (let index = 0; index < fieldAll.length; index++) {
			const field = fieldAll[index];
			field.classList.remove('_valid');
			field.classList.remove('_invalid');
		}

		for (let index = 0; index < msgAll.length; index++) {
			const msg = msgAll[index];
			msg.classList.remove('_valid');
			msg.classList.remove('_invalid');
			msg.classList.add('_hidden');
		}

	}

    // КРАСИВОЕ ОТСЛЕЖИВАНИЯ СОВПАДЕНИЯ ПАРОЛЕЙ В РЕГ ПОЛЕ

    const validMsg = "Ur awesome!",
        invalidMsg = "Check fields...";

    regVerifPasswordInput.oninput = () => {

        if (regPasswordInput.value !== '' && regVerifPasswordInput.value !=='') {

            if (regPasswordInput.value != regVerifPasswordInput.value)
                invalidField(regPasswordInput),
                invalidField(regVerifPasswordInput),
                showRegMsg(invalidMsg, false);
            else
                validField(regPasswordInput),
                validField(regVerifPasswordInput),
                showRegMsg(validMsg, true);
        }

		else clearAll();

    };

    regPasswordInput.oninput = () => {

        if (regVerifPasswordInput.value !== '' && regPasswordInput.value !== '') {
            if (regPasswordInput.value != regVerifPasswordInput.value)
                invalidField(regPasswordInput),
                invalidField(regVerifPasswordInput),
                showRegMsg(invalidMsg, false);
            else
                validField(regPasswordInput),
                validField(regVerifPasswordInput),
                showRegMsg(validMsg, true);
        }

		else clearAll();
    };
	
    LogButton.addEventListener('click', (e) => {
        event.preventDefault();
        let request=new XMLHttpRequest();
        let credentials = {login: document.getElementById("logLoginInput").value,
            password: md5(document.getElementById("logPasswordInput").value)};
        request.onreadystatechange = function() { // listen for state changes
            if (request.readyState == 4 && request.status == 200) { // when completed we can move away
                window.location = "main.html";
            } else {console.log("fkoff");}
        }
        request.open("POST", "LoginServlet" , true);
         request.send(JSON.stringify(credentials));
    });
    RegButton.addEventListener('click', (e) => {
        event.preventDefault();
        if(document.getElementById("regPasswordInput").value == document.getElementById("regVerifPasswordInput").value) {
            let request = new XMLHttpRequest();
            let credentials = {login: document.getElementById("regLoginInput").value,
               password: md5(document.getElementById("regPasswordInput").value)};

            request.onreadystatechange = function () {// listen for state changes
                document.getElementById("regLoginInput").value = null;
                document.getElementById("regPasswordInput").value = null;
                document.getElementById("regVerifPasswordInput").value = null;
                if (request.readyState == 4 && request.status == 200) { // when completed we can move away
                    btnSignup.classList.add('_hidden');
                    btnLogin.classList.remove('_hidden');

                    formSignup.classList.add('_hidden');
                    formLogin.classList.remove('_hidden');
                    formContainer.style.setProperty('--move-to', '0px');
                } else {console.log("fk off");}
            }
            request.open("POST", "RegisterServlet", true);
            request.send(JSON.stringify(credentials));
        }
    });


});