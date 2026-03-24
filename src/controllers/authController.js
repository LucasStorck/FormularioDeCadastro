const db = require("../config/database");

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  // Server-side validation
  if (!name || !email || !password) {
    return res.redirect("/error.html?msg=Todos os campos são obrigatórios.");
  }

  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, password], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.redirect("/error.html?msg=E-mail já está em uso.");
      }
      console.error(err.message);
      return res.redirect("/error.html?msg=Erro ao registrar o usuário.");
    }
    res.redirect("/success.html?msg=Cadastro realizado com sucesso!");
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.redirect("/error.html?msg=Preencha email e senha.");
  }

  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(sql, [email, password], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.redirect("/error.html?msg=Erro ao fazer login.");
    }
    if (row) {
      res.redirect("/success.html?msg=Login efetuado com sucesso!");
    } else {
      res.redirect("/error.html?msg=E-mail ou senha incorretos.");
    }
  });
};
