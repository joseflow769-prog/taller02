// Registro
document.getElementById('formulario-registro')
.addEventListener('submit', async (e)=>{

e.preventDefault();

const username = document.getElementById('reg-username').value;
const password = document.getElementById('reg-password').value;

const res = await fetch('/registrar',{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({username,password})
});

const data = await res.json();

alert(data.message || data.error);

});

// Login
document.getElementById('formulario-login')
.addEventListener('submit', async (e)=>{

e.preventDefault();

const username = document.getElementById('log-username').value;
const password = document.getElementById('log-password').value;

const res = await fetch('/login',{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({username,password})
});

const data = await res.json();

if(data.token){
localStorage.setItem('token',data.token);
alert('Login exitoso');
}else{
alert(data.error);
}

});

// Recurso protegido
document.getElementById('btn-protegido')
.addEventListener('click', async ()=>{

const token = localStorage.getItem('token');

const res = await fetch('/recurso-protegido',{
headers:{
'Authorization':'Bearer '+token
}
});

const data = await res.json();

document.getElementById('resultado')
.innerText = JSON.stringify(data);

});