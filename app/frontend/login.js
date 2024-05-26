// import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm'

import axios from 'axios'

const alert = document.querySelector('.alert')
const name = document.querySelector('.name')
const inputEmail = document.querySelector('.input-email')
const inputPassword = document.querySelector('.input-password')
const inputConfirmPassword = document.querySelector('.input-confirm-password')
const nameContainer = document.querySelector('.name-container')
const account = document.querySelector('.account')
const confirmPasswordContainer = document.querySelector(
  '.confirm-password-container'
)
const forgotPassword = document.querySelector('.forgot-password')
const btn = document.querySelector('.btn')
const link = document.querySelector('.link')

const formLogin = document.querySelector('.form-login')

const axiosInstance = axios.create({
  baseURL: '/',
  // timeout: 1000,
  headers: { token: 'foobar' },
})

formLogin.addEventListener('submit', async function (e) {
  e.preventDefault()
})

btn.addEventListener('click', async function (e) {
  if (btn.textContent === 'Sign Up') {
    const res = await callApi({
      path: '/signUp',
      method: 'post',
      payload: {
        name: name.value,
        email: inputEmail.value,
        password: inputPassword.value,
        passwordConfirm: inputConfirmPassword.value,
      },
    })
    res.status === 200 && redirect('/main/india.html')
  } else if (btn.textContent === 'Login') {
    const res = await callApi({
      path: '/userLogin',
      method: 'post',
      payload: {
        email: inputEmail.value,
        password: inputPassword.value,
      },
    })
    res.status === 200 && redirect('/main/india.html')
  } else if (btn.textContent === 'Reset Password') {
    const resetToken = window.location.pathname.split('/').at(-1)

    const res = await callApi({
      path: `/resetPassword/${resetToken}`,
      method: 'post',
      payload: {
        password: inputPassword.value,
        passwordConfirm: inputConfirmPassword.value,
      },
    })
    res.status === 200 && redirect('/main/india.html')
  }
})

link?.addEventListener('click', function (e) {
  e.preventDefault()

  if (link.textContent === 'Sign Up') {
    window.location = '/signup.html'
  } else if (link.textContent === 'Login') {
    window.location = '/login.html'
  }
})

forgotPassword?.addEventListener('click', async (e) => {
  e.preventDefault()

  await callApi({
    method: 'post',
    path: `/forgotPassword`,
    payload: {
      email: inputEmail.value,
    },
  })
})

function Alert(message) {
  alert.textContent = message
  alert.classList.remove('display-none')

  setTimeout(() => {
    alert.textContent = ''
    alert.classList.add('display-none')
  }, 3000)
}

async function callApi({
  path = '/',
  method = 'get',
  payload = {},
  errMsg = true,
  succMsg = true,
}) {
  try {
    const res = await axiosInstance[method](path, payload)

    succMsg && Alert(res.data.message)
    return res
  } catch (err) {
    console.log(err)

    errMsg && Alert(err.response.data.message)
  }
}

function redirect(path) {
  window.location = path
}

// NOTES

// npx rimraf dist&
