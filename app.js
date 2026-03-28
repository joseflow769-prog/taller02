
const registerForm =
document.getElementById('formulario-registro');

const loginForm =
document.getElementById('formulario-login');

const mensaje =
document.getElementById('mensaje');

const botonAcceso =
document.getElementById('acceso-protegido');

const mensajeProtegido =
document.getElementById('mensaje-protegido');

const API = "http://localhost:3000";

// Registrar
registerForm.addEventListener('submit',async(e)=>{

e.preventDefault();

const username =
document.getElementById('reg-username').value;

const password =
document.getElementById('reg-password').value;

const res = await fetch(`${API}/registrar`,{

method:'POST',

headers:{
'Content-Type':'application/json'
},

body:JSON.stringify({username,password})

});

const data = await res.json();

mensaje.textContent =
data.message || data.error;

});

// Login
loginForm.addEventListener('submit',async(e)=>{

e.preventDefault();

const username =
document.getElementById('log-username').value;

const password =
document.getElementById('log-password').value;

const res = await fetch(`${API}/login`,{

method:'POST',

headers:{
'Content-Type':'application/json'
},

body:JSON.stringify({username,password})

});

const data = await res.json();

mensaje.textContent =
data.message || data.error;

if(res.ok){

localStorage.setItem('token',data.token);

alert('Login exitoso');

}

});

// Ruta protegida
botonAcceso.addEventListener('click',async()=>{

const token = localStorage.getItem('token');

if(!token){

mensajeProtegido.textContent =
'Debe iniciar sesión';

return;

}

const res = await fetch(`${API}/recurso-protegido`,{

headers:{
Authorization:`Bearer ${token}`
}

});

const data = await res.json();

if(res.ok){

mensajeProtegido.textContent =
data.message;

}else{

mensajeProtegido.textContent =
data.error;

}

});
