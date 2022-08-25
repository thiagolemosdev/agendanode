require("dotenv").config();
//Referente as nossas variaveis de ambiente que estao no arquivo
// .dotenv, coisas relacionadas ao desenvolvimento que nao queremos publicar no repositorio

const express = require("express");
const app = express();
//Iniciando o express

const mongoose = require("mongoose");

mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit("pronto");
  })
  .catch((e) => console.log(e));
// Iniciando o mongoose que é quem vai modelar a nossa base de dados
// criar tabelas e etc...
// e ele retorna uma promisse, por isso usamos esse app.emit \
// qua vai ser captura mais abaixo no codigo

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
// Sessions para salvar cookies e identificar o computador do cliente
// toda vez que ele conectar nos vamos checar  e falare que é aquele cliente

const routes = require("./routes");
// são as rotas da nossa aplicaçao

const path = require("path");
// Path é para trabahlharmos com caminhos

// const helmet = require("helmet");
// Cuida da segurança da aplicação

const csrf = require("csurf");
// São tokens do nosso formularios
// Evita invasões dos nossos formularios

const {
  checkCsrfError,
  csrfMiddleware,
  middlewareGlobal,
} = require("./src/middlewares/middleware");
// importando nosso middlewares

// app.use(helmet());
// Falando pro express utilizar o helmet

app.use(express.urlencoded({ extended: true }));
// Falando pro express que podemos postar fomularios para dentro da nmossa aplicação

app.use(express.json());
// falando pro express que podemos utilizar json

app.use(express.static(path.resolve(__dirname, "public")));
//passando o endereço de arquivos estaticos e que devem ser acessados diretamente

const sessionOptions = session({
  secret: "tstestshb ysvs",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());
// Configurações de sessões

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");
// Sao os arquivos que renderizamos na tela e a engine que estamos usando
// para renderizar esse arquivos

app.use(csrf());
// chamando o nosso csrf token

app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(middlewareGlobal);
// Chamando nossos middlewares

app.use(routes);
// chamando as rotas

app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3k");
  });
});
// Mandando nossa aplicaçao escutar essas coisas e porta.
