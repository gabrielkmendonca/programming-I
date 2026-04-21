const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));

function Authenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    return res.redirect('/login.html');
}

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.post('/login', (req, res) => {
    const { user, password } = req.body;

    if (user === 'admin' && password === '123456') {
        req.session.user = user;
        return res.redirect('/admin/form');
    }

    res.send(`
        <h1>Erro no login!</h1>
        <p>Usuário ou senha incorretos.</p>
        <a href="/login.html">Tentar novamente</a>
    `);
});

app.get('/admin/form', Authenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected', 'form.html'));
});

app.post('/register', Authenticated, (req, res) => {
    const data = req.body;

    console.log('Novo cadastro:', data);

    res.send(`
        <h1>Cadastro realizado com sucesso!</h1>
        <p>Dados recebidos: ${JSON.stringify(data)}</p>
        <a href="/admin/form">Novo cadastro</a>
    `);
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});