import * as Yup from 'yup';
import { capitalCase } from 'capital-case';

const Book = require('../models/books');

class BookController {
  async dashboard(req, res) {
    const allBooks = await Book.findAndCountAll();

    const response = {
      sumBooks: 0,
      uniqueBooks: allBooks.count,
      authors: 0,
      borrowedBooks: 0,
      readedBooks: 0,
    };

    let allAuthors = [];

    allBooks.rows.map(book => {
      response.sumBooks += book.quantity;
      response.borrowedBooks += book.quantity_borrowed;
      book.readed && response.readedBooks++;
      allAuthors.push(book.author);
    });

    const distinctAuthors = [...new Set(allAuthors)];

    response.authors = distinctAuthors.length;

    return res.json({ response });
  }

  async index(req, res) {
    const books = await Book.findAll();

    return res.json({ books });
  }

  async show(req, res) {
    const { id } = req.params;

    const book = await Book.findByPk(id);

    if (book === null || book === undefined) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    return res.json(book);
  }

  async search(req, res) {
    const { name, author } = req.query;

    var filter;
    // Find by name and author
    if (name && author) {
      filter = { name: capitalCase(name), author: capitalCase(author) };
    } else if (name) {
      filter = { name: capitalCase(name) };
    } else if (author) {
      filter = { author: capitalCase(author) };
    } else {
      return res
        .status(400)
        .json({ error: 'Nenhum filtro de busca selecionado' });
    }

    const books = await Book.findAll({
      where: filter,
    });

    if (books.length === 0) {
      return res.status(404).json({ error: 'Livros não encontrado' });
    }

    return res.json(books);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      author: Yup.string().required(),
      quantity: Yup.number()
        .positive()
        .required(),
      borrowed: Yup.boolean().required(),
      quantity_borrowed: Yup.number(),
      borrowed_for_who: Yup.string().required(),
      readed: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Algum campo não foi preenchido corretamente' });
    }

    const {
      name,
      author,
      quantity,
      borrowed,
      quantity_borrowed,
      borrowed_for_who,
      readed,
    } = req.body;

    const bookExists = await Book.findOne({
      where: { name: capitalCase(name), author: capitalCase(author) },
    });

    if (bookExists) {
      return res.status(400).json({ error: 'Livro já existe!' });
    }

    const { id } = await Book.create({
      name: capitalCase(name),
      author: capitalCase(author),
      quantity,
      borrowed,
      quantity_borrowed,
      borrowed_for_who,
      readed,
    });

    return res.json({
      id,
      name,
      author,
      quantity,
      borrowed,
      quantity_borrowed,
      borrowed_for_who,
      readed,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      author: Yup.string().required(),
      quantity: Yup.number()
        .positive()
        .required(),
      borrowed: Yup.boolean().required(),
      quantity_borrowed: Yup.number(),
      borrowed_for_who: Yup.string().required(),
      readed: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Algum campo não foi preenchido corretamente' });
    }

    const {
      name,
      author,
      quantity,
      borrowed,
      quantity_borrowed,
      borrowed_for_who,
      readed,
    } = req.body;

    const { id } = req.params;

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ error: 'Livro não existente!' });
    }

    const bookExists = await Book.findOne({
      where: {
        name: capitalCase(name),
        author: capitalCase(author),
        quantity,
        borrowed,
        quantity_borrowed,
        borrowed_for_who,
        readed,
      },
    });

    if (bookExists) {
      return res.status(400).json({ error: 'Livro já existe!' });
    }

    await Book.update(
      {
        name: capitalCase(name),
        author: capitalCase(author),
        quantity,
        borrowed,
        quantity_borrowed,
        borrowed_for_who,
        readed,
      },
      { where: { id } }
    );

    return res.json(req.body);
  }
}

export default new BookController();
