const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  tel: { type: String, required: false, default: "" },
  criadoEm: { type: Date, dafaul: Date.now },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.buscarPorId = async function (id) {
  if (typeof id !== "string") return;
  const user = await ContatoModel.findById(id);
  return user;
};

Contato.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;

  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function () {
  this.cleanUp();

  // validação do usuario
  // o email precisa ser valido
  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push("Email inválido");
  }

  if (!this.body.nome) this.errors.push("Nome é um campo obrigatorio");

  if (!this.body.email && !this.body.tel) {
    this.errors.push("Você precisa adicionar um email ou telefone");
  }
};

Contato.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    tel: this.body.tel,
  };
};

Contato.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.legth > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};
module.exports = Contato;
