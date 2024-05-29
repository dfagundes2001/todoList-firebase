// Definindo referências para elementos da página
var auth = document.querySelector('.auth')
var authForm = document.getElementById('authForm')
var authFormTitle = document.getElementById('authFormTitle')
var register = document.getElementById('register')
var access = document.getElementById('access')
var loading = document.getElementById('loading')
var userContent = document.getElementById('userContent')
var userEmail = document.getElementById('userEmail')
var pEmailVerified = document.getElementById('pEmailVerified')
var sendEmailVerificationDiv = document.getElementById('sendEmailVerificationDiv')
var passwordReset = document.getElementById('passwordReset')
var userImg = document.getElementById('userImg')
var userName = document.getElementById('userName')
var search = document.getElementById('search')
var progressFeedback = document.getElementById('progressFeedback')
var progress = document.getElementById('progress')
var playPauseBtn = document.getElementById('playPauseBtn')
var cancelBtn = document.getElementById('cancelBtn')
var divUpdateTodo = document.getElementById('divUpdateTodo')

var todoForm = document.querySelector('.todoForm')
var submitTodoForm = document.querySelector('.submitTodoForm')
var submitTodoForm = document.querySelector('.submitTodoForm')
var ulTodoList = document.querySelector('.ulTodoList')
var todoCount = document.querySelector('.todoCount')

// Função que muda o tipo do input de password para text e vice-versa
function togglePasswordVisibility() {
  var showPassword = document.querySelector(".img-showPassword");
  var passwordField = document.getElementById("password");

  if (passwordField.type == 'password') {
    showPassword.src = './img/eye_120221.png'
    passwordField.type = 'text'        
  } else if (passwordField.type == 'text') {
    showPassword.src = './img/eye.png'
    passwordField.type = 'password'
  }
}

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = 'Cadastrar conta'
  authFormTitle.innerHTML = 'Insira seus dados para se cadastrar'
  hideItem(register)
  hideItem(passwordReset)
  showItem(access)
}

// Alterar o formulário de autenticação para o acesso de contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = 'Acessar'
  authFormTitle.innerHTML = 'Acesse a sua conta para continuar'
  hideItem(access)
  showItem(passwordReset)
  showItem(register)
}

// Simplifica a exibição de elementos da página
function showItem(element) {
  element.style.display = 'block'
}

// Simplifica a remoção de elementos da página
function hideItem(element) {
  element.style.display = 'none'
}

function showUserContent(user) {
  if(user.providerData[0].providerId != 'password') {
    pEmailVerified.innerHTML = 'Autenticação por provedor confiável, não é necessário verificar e-mail'
    hideItem(sendEmailVerificationDiv)
  } else {
    if(user.emailVerified) {
      pEmailVerified.innerHTML = 'E-mail verificado'
      hideItem(sendEmailVerificationDiv)
    } else {
      pEmailVerified.innerHTML = 'E-mail não verificado'
      showItem(sendEmailVerificationDiv)
    }
  }
  userImg.src = user.photoURL ? user.photoURL : './../img/unknownUser.png'
  userName.innerHTML = user.displayName

  userEmail.innerHTML = user.email
  hideItem(auth)

  getDefaultTodoList() 
  search.onkeyup = function() {
    if (search.value != '') {
      var searchText = search.value.toLowerCase()
      dbFirestore.doc(firebase.auth().currentUser.uid).collection('tarefas')
      .orderBy('nameLowerCase')
      .startAt(searchText).endAt(searchText + '\uf8ff').get().then(function (dataSnapshot) {
        fillTodoList(dataSnapshot)
      })

      // dbRefUsers.child(user.uid)
      // .orderByChild('nameLowerCase')
      // .startAt(searchText).endAt(searchText + '\uf8ff').once('value').then(function (dataSnapshot) {
      //   fillTodoList(dataSnapshot)
      // })
    } else {
      getDefaultTodoList()
    }
  }
  showItem(userContent)
}

// Busca tarefas em tempo real (Listagem padrão usando o on)
function getDefaultTodoList( ) {
  dbFirestore.doc(firebase.auth().currentUser.uid).collection('tarefas').orderBy('nameLowerCase').onSnapshot(function (dataSnapshot) {
    fillTodoList(dataSnapshot)
  })

  // dbRefUsers.child(firebase.auth().currentUser.uid)
  // .orderByChild('nameLowerCase')
  // .on('value', function (dataSnapshot) {
  //   fillTodoList(dataSnapshot)
  // })
}

// Mostrar conteudo para usuarios não autenticados
function showAuth() {
  authForm.password.value = ''
  authForm.email.value = ''
  hideItem(userContent)
  showItem(auth)
}

// Função que lida com todos os erros
function showError(prefix, err) {
  console.log(err.code);
  hideItem(loading)

  switch (err.code) {
    case 'auth/invalid-email': alert(prefix + '' + 'E-mail inválido!')      
      break;
    case 'auth/wrong-password': 
    case 'auth/internal-error': alert(prefix + '' + 'Senha inválida!')      
      break;
    case 'auth/weak-password': alert(prefix + '' + 'Senha deve ter no minimo 6 caracteres!')      
      break;
    case 'auth/email-already-in-use': alert(prefix + '' + 'E-mail já está em uso por outra conta!')      
      break;
    case 'auth/account-exists-with-different-credential': alert(prefix + '' + 'Já existe uma conta com o mesmo endereço de e-mail, mas com credenciais de login diferentes. Faça login usando um provedor associado a este endereço de e-mail.')      
      break;
    case 'auth/popup-closed-by-user': alert(prefix + '' + 'O popup de autenticação foi fechado antes da operação	ser concluida!')      
      break;
    case 'storage/canceled':      
      break;
    case 'storage/unauthorized': alert(prefix + '' + 'Falha ao acessar o Cloud Storage!') 
      break;
  
    default: alert(prefix + '' + err.message)
  }
}

// Atributos extras de configuração de e-mail
var actionCodeSettings = {
  url: 'https://todolist-2c452.firebaseapp.com'
} 

var database = firebase.database()
var dbRefUsers = database.ref('users')

var dbFirestore = firebase.firestore().collection('users')