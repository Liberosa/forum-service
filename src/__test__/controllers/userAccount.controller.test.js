import express from 'express';
import request from 'supertest';
import {jest} from '@jest/globals';

describe('UserAccountController via routes', () => {
  let app;
  let mockService;

  beforeEach(async () => {
    jest.resetModules();
    // validation pass-through
    jest.unstable_mockModule('../../middlewares/validation.middleware.js', () => ({
      default: () => (req, res, next) => next(),
    }));

    mockService = {
      register: jest.fn(async (body) => ({ ...body, roles: ['USER'] })),
      getUser: jest.fn(async (user) => ({ login: user })),
      removeUser: jest.fn(async (user) => ({ login: user })),
      updateUser: jest.fn(async (user, data) => ({ login: user, ...data })),
      changeRoles: jest.fn(async () => ({ roles: ['USER', 'ADMIN'] })),
      changePassword: jest.fn(async () => ({})),
    };

    jest.unstable_mockModule('../../services/userAccount.service.js', () => ({
      default: mockService,
    }));

    const routes = (await import('../../routes/userAccounts.routes.js')).default;
    const errorHandler = (await import('../../middlewares/errorHandler.middleware.js')).default;

    app = express();
    app.use(express.json());
    app.use('/account', routes);
    app.use(errorHandler);
  });

  test('POST /account/register registers user', async () => {
    const body = { login: 'new', password: 'p', firstName: 'A', lastName: 'B' };
    const res = await request(app).post('/account/register').send(body);
    expect(res.status).toBe(200);
    expect(res.body.roles).toContain('USER');
    expect(mockService.register).toHaveBeenCalledWith(body);
  });

  test('POST /account/login proxies to getUser', async () => {
    const res = await request(app).post('/account/login');
    expect(res.status).toBe(200);
    expect(mockService.getUser).toHaveBeenCalled();
  });

  test('GET /account/user/:user returns user', async () => {
    const res = await request(app).get('/account/user/alice');
    expect(res.status).toBe(200);
    expect(mockService.getUser).toHaveBeenCalledWith('alice');
  });

  test('DELETE /account/user/:user deletes user', async () => {
    const res = await request(app).delete('/account/user/bob');
    expect(res.status).toBe(200);
    expect(mockService.removeUser).toHaveBeenCalledWith('bob');
  });

  test('PATCH /account/user/:user updates user', async () => {
    const res = await request(app).patch('/account/user/al').send({ firstName: 'A' });
    expect(res.status).toBe(200);
    expect(mockService.updateUser).toHaveBeenCalledWith('al', { firstName: 'A' });
  });

  test('PATCH /account/user/:user/role/:role adds role', async () => {
    const res = await request(app).patch('/account/user/al/role/admin');
    expect(res.status).toBe(200);
    expect(mockService.changeRoles).toHaveBeenCalledWith('al', 'admin', true);
  });

  test('DELETE /account/user/:user/role/:role removes role', async () => {
    const res = await request(app).delete('/account/user/al/role/admin');
    expect(res.status).toBe(200);
    expect(mockService.changeRoles).toHaveBeenCalledWith('al', 'admin', false);
  });

  test('Error mapping: 409 -> 409 empty body', async () => {
    const err = new Error('exists');
    err.statusCode = 409;
    mockService.register.mockRejectedValueOnce(err);
    const res = await request(app).post('/account/register').send({ login: 'x', password: 'p', firstName: 'A', lastName: 'B' });
    expect(res.status).toBe(409);
    expect(res.text).toBe('');
  });

  test('Error mapping: 400 -> json body', async () => {
    const err = new Error('Invalid role: bad. Valid roles: USER, MODERATOR, ADMIN');
    err.statusCode = 400;
    mockService.changeRoles.mockRejectedValueOnce(err);
    const res = await request(app).patch('/account/user/al/role/bad');
    expect(res.status).toBe(400);
    expect(res.body).toEqual(expect.objectContaining({ code: 400, status: 'Bad Request' }));
  });

  test('Error mapping: not found -> 404', async () => {
    mockService.getUser.mockRejectedValueOnce(new Error('User with login ghost not found'));
    const res = await request(app).get('/account/user/ghost');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe(404);
  });
});
