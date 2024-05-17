import Header from '../components/header/header.js';
import {
    authCheckReverse,
    prependChild,
    setCookie,
    validEmail,
} from '../utils/function.js';
import { userLogin } from '../api/loginRequest.js';

const HTTP_OK = 200;
const MAX_PASSWORD_LENGTH = 8;

const loginData = {
    id: '',
    password: '',
};

const updateHelperText = (helperTextElement, message = '') => {
    helperTextElement.textContent = message;
};

const loginClick = async () => {
    const { id: email, password } = loginData;
    const helperTextElement = document.querySelector('.helperText');

    const response = await userLogin(email, password);
    if (!response.ok) {
        updateHelperText(
            helperTextElement,
            '*입력하신 계정 정보가 정확하지 않았습니다.',
        );
        return;
    }

    const result = await response.json();
    if (result.status !== HTTP_OK) {
        updateHelperText(
            helperTextElement,
            '*입력하신 계정 정보가 정확하지 않았습니다.',
        );
        return;
    }
    updateHelperText(helperTextElement);

    setCookie('session', result.data.auth_token, 14);
    setCookie('userId', result.data.userId, 14);
    location.href = '/html/index.html';
};

const observeSignupData = () => {
    const { id: email, password } = loginData;
    const button = document.querySelector('#login');
    const helperTextElement = document.querySelector('.helperText');

    const isValidEmail = validEmail(email);
    updateHelperText(
        helperTextElement,
        isValidEmail || !email
            ? ''
            : '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)',
    );

    button.disabled = !(
        email &&
        isValidEmail &&
        password &&
        password.length >= MAX_PASSWORD_LENGTH
    );
    button.style.backgroundColor = button.disabled ? '#ACA0EB' : '#7F6AEE';
};

const eventSet = () => {
    document.getElementById('login').addEventListener('click', loginClick);

    document.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            loginClick();
        }
    });

    ['id', 'pw'].forEach(field => {
        const inputElement = document.getElementById(field);
        inputElement.addEventListener('input', event =>
            onChangeHandler(event, field === 'id' ? 'id' : 'password'),
        );

        if (field === 'id') {
            inputElement.addEventListener('focusout', event =>
                lottieAnimation(validEmail(event.target.value) ? 1 : 2),
            );
        }
    });

    document
        .getElementById('id')
        .addEventListener('input', event => validateEmail(event.target));
};

const onChangeHandler = (event, uid) => {
    loginData[uid] = event.target.value;
    observeSignupData();
};

const validateEmail = input => {
    const regex = /^[A-Za-z0-9@.]+$/;
    if (!regex.test(input.value)) input.value = input.value.slice(0, -1);
};

let lottieInstance = null;
const lottieAnimation = type => {
    const container = document.getElementById('lottie-animation');
    const animationPaths = [
        '/public/check_anim.json',
        '/public/denied_anim.json',
    ];
    if (lottieInstance) lottieInstance.destroy();
    container.innerHTML = '';
    lottieInstance = window.lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: animationPaths[type - 1],
    });
};

const init = async () => {
    await authCheckReverse();
    observeSignupData();
    prependChild(document.body, Header('커뮤니티', 0));
    eventSet();
    localStorage.clear();
    document.cookie = '';
};

init();

/*
import Header from '../components/header/header.js';

import {
    authCheckReverse,
    prependChild,
    setCookie,
    validEmail,
} from '../utils/function.js';

import { userLogin } from '../api/loginRequest.js';

const HTTP_OK = 200;
const MAX_PASSWORD_LENGTH = 8;

const loginData = {
    id: '',
    password: '',
};

const loginClick = async () => {
    const email = loginData.id;
    const password = loginData.password;
    const helperTextElement = document.querySelector('.helperText');

    const response = await userLogin(email, password);
    if (!response.ok) {
        helperTextElement.textContent =
            '*입력하신 계정 정보가 정확하지 않았습니다.';
        return;
    }

    const result = await response.json();
    if (result.status !== HTTP_OK) {
        helperTextElement.textContent =
            '*입력하신 계정 정보가 정확하지 않았습니다.';
        return;
    }
    helperTextElement.textContent = '';

    setCookie('session', result.data.auth_token, 14);
    setCookie('userId', result.data.userId, 14);
    location.href = '/html/index.html';
};

const observeSignupData = () => {
    const email = loginData.id;
    const password = loginData.password;
    const button = document.querySelector('#login');
    const helperTextElement = document.querySelector('.helperText');

    const isValidEmail = validEmail(email);
    if (!isValidEmail && email) {
        helperTextElement.textContent =
            '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
    } else {
        helperTextElement.textContent = '';
    }

    // email, pw값이 모두 존재하는지 확인
    if (
        !email ||
        !isValidEmail ||
        !password ||
        password.length < MAX_PASSWORD_LENGTH
    ) {
        button.disabled = true;
        button.style.backgroundColor = '#ACA0EB';
    } else {
        button.disabled = false;
        button.style.backgroundColor = '#7F6AEE';
    }
};

const eventSet = () => {
    const loginButton = document.getElementById('login');
    loginButton.addEventListener('click', loginClick);

    document.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            loginClick();
        }
    });

    const idInput = document.getElementById('id');
    const passwordInput = document.getElementById('pw');

    idInput.addEventListener('input', event => onChangeHandler(event, 'id'));
    idInput.addEventListener('focusout', event => {
        const isValidEmail = validEmail(event.target.value);

        if (isValidEmail) {
            return lottieAnimation(1);
        }

        return lottieAnimation(2);
    });

    passwordInput.addEventListener('input', event =>
        onChangeHandler(event, 'password'),
    );

    const emailInput = document.getElementById('id');
    emailInput.addEventListener('input', event => validateEmail(event.target));
};

const onChangeHandler = (event, uid) => {
    if (uid == 'id') {
        loginData.id = event.target.value;
    } else {
        loginData.password = event.target.value;
    }
    observeSignupData();
};

const validateEmail = async input => {
    const regex = /^[A-Za-z0-9@.]+$/;

    if (!regex.test(input.value)) {
        input.value = input.value.substring(0, input.value.length - 1);
    }
};

let lottieInstance = null;
const lottieAnimation = type => {
    const container = document.getElementById('lottie-animation');

    const CHECK = 1;
    const DENIED = 2;

    const CHECK_ANIM_PATH = '/public/check_anim.json';
    const DENIED_ANIM_PATH = '/public/denied_anim.json';

    // 기존 인스턴스가 있으면 중지 및 제거
    if (lottieInstance) {
        lottieInstance.destroy();
    }

    // 컨테이너 내부를 비우거나 애니메이션 인스턴스를 제거
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // 또는 lottieInstance가 있을 경우
    if (lottieInstance) {
        lottieInstance.destroy(); // 기존 애니메이션 인스턴스 제거
        lottieInstance = null; // 참조 제거
    }

    // 새로운 애니메이션 추가
    if (type === CHECK) {
        lottieInstance = window.lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: CHECK_ANIM_PATH,
        });
    } else if (type == DENIED) {
        lottieInstance = window.lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: DENIED_ANIM_PATH,
        });
    }
};

const init = async () => {
    // 로그인 유무 체크. 로그인이 되어 있으면 메인 페이지로 이동
    await authCheckReverse();
    observeSignupData();

    // 헤더 추가
    prependChild(document.body, Header('커뮤니티', 0));

    // 이벤트 추가
    eventSet();

    // 로컬 스토리지 초기화
    localStorage.clear();

    // 쿠키 초기화
    document.cookie = '';
};

init();
*/
