import * as Yup from 'yup';

const User = require('../models/user');

class UserController {
  async login(req, res) {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username, password },
    });

    if (!user) {
      res.status(400).json({ error: 'Usuário ou senha inválido(s)!' });
    }

    res.json({ token: user.username + '-' + user.createdAt });
  }

  async verifyToken(req, res) {
    const { token } = req.body;

    if (token === null || token === undefined) {
      res
        .status(400)
        .json({ error: 'Token inválido! Faça seu login novamente!' });
    }

    const username = token.split('-')[0];

    const user = await User.findOne({
      where: { username },
    });

    var newToken = user.username + '-' + user.createdAt;

    if (token !== newToken) {
      res
        .status(400)
        .json({ error: 'Token inválido! Faça seu login novamente!' });
    }

    res.json({ token });
  }

  async index(req, res) {
    const users = await User.findAll();

    if (users === null || users === undefined) {
      return res.status(404).json({ error: 'Nenhum usuário encontrado' });
    }
    return res.json({ users });
  }

  async show(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (user === null || user === undefined) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user: Yup.string()
        .min(5)
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Algum campo não foi preenchido corretamente' });
    }

    const { user, password } = req.body;

    const userExists = await User.findOne({
      where: { username: user },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe!' });
    }

    const { username, permission } = await User.create({
      username: user,
      password,
      permission: 'USER',
    });

    return res.json({ username, permission });
  }

  async delete(req, res) {
    const { id } = req.params;
    const { admin_id } = req.body;

    const user = await User.findByPk(id);
    const admin = await User.findByPk(admin_id);

    if (!(admin.permission === 'ADMIN')) {
      return res
        .status(403)
        .json({ error: 'Você não possui permissão para isto' });
    }

    if (user === null || user === undefined) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.id !== admin.id) {
      await user.destroy();
    } else {
      return res
        .status(403)
        .json({ error: 'Você não pode deletar a si mesmo' });
    }

    return res.send();
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     user: Yup.string()
  //       .min(5)
  //       .required(),
  //     password: Yup.string()
  //       .min(6)
  //       .required(),
  //     permission: Yup.string().required(),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res
  //       .status(400)
  //       .json({ error: 'Algum campo não foi preenchido corretamente' });
  //   }

  //   const { username, password, permission } = req.body;

  //   const { id } = req.params;

  //   const user = await User.findByPk(id);

  //   if (!user) {
  //     return res.status(404).json({ error: "Usuário não existe!" });
  //   }

  //   const userExists = await User.findOne({
  //     where: { username, password, permission },
  //   });

  //   if (userExists) {
  //     return res.status(400).json({ error: "Usuário já existe!" });
  //   }
  // }
}

export default new UserController();
