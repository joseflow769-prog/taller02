require('dotenv').config();

const fetch = require('node-fetch');
global.fetch = fetch;

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');

const authenticateToken = require('./middleware/autenticacion_middleware');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname,'public')));

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_ANON_KEY
);

console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_ANON_KEY);

const port = 3000;

// Probar conexión
const test = async ()=>{
const {data,error} = await supabase
.from('usuarios')
.select('*');

console.log("TEST DATA:",data);
console.log("TEST ERROR:",error);
}

test();


// Registrar
app.post('/registrar', async (req,res)=>{

console.log("BODY:", req.body);

try{

const {username,password} = req.body;

if(!username || !password){
return res.status(400).json({error:'Datos requeridos'});
}

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password,salt);

const { data, error } = await supabase
.from('usuarios')
.insert([{ username, password: hashedPassword }]);

console.log("DATA:", data);
console.log("ERROR:", error);

if(error){
return res.status(500).json({
error:error.message
});
}

res.json({message:'Usuario registrado correctamente'});

}catch(error){
console.log("Error servidor:", error);
res.status(500).json({error:'Error servidor'});
}

});


// Login
app.post('/login', async (req,res)=>{

try{

const {username,password} = req.body;

const {data:user,error} = await supabase
.from('usuarios')
.select('*')
.eq('username',username)
.single();

console.log("LOGIN DATA:", user);
console.log("LOGIN ERROR:", error);

if(!user){
return res.status(401).json({error:'Credenciales inválidas'});
}

const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
return res.status(401).json({error:'Credenciales inválidas'});
}

const token = jwt.sign(
{username:user.username},
process.env.JWT_SECRET,
{expiresIn:'1h'}
);

res.json({message:'Login exitoso',token});

}catch(error){
console.log("Error login:", error);
res.status(500).json({error:'Error servidor'});
}

});


// Ruta protegida
app.get('/recurso-protegido',authenticateToken,(req,res)=>{
res.json({
message:`Bienvenido ${req.user.username}`,
data:'Datos protegidos'
});
});

app.listen(port,()=>{
console.log(`Servidor ejecutando http://localhost:${port}`);
});