import express from 'express';

import UserController from './controllers/UserController';
import BookController from './controllers/BookController';

const routes = express.Router();

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.store);
routes.post('/login', UserController.login);
routes.post('/verifyToken', UserController.verifyToken);
// routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.get('/dashboard/books', BookController.dashboard);
routes.get('/books', BookController.index);
routes.get('/books/:id', BookController.show);
routes.get('/search/books', BookController.search);
routes.post('/book', BookController.store);
routes.put('/book/:id', BookController.update);
routes.delete('/book/:id', BookController.delete);

module.exports = routes;
