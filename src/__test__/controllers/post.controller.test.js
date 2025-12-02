import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';

describe('PostController via routes', () => {
  let app;
  let mockService;

  beforeEach(async () => {
    jest.resetModules();
    // Mock validation to pass-through
    jest.unstable_mockModule('../../middlewares/validation.middleware.js', () => ({
      default: () => (req, res, next) => next(),
    }));
    // Mock PostService used inside controller
    mockService = {
      createPost: jest.fn(async () => ({ id: '1' })),
      getPostById: jest.fn(async () => ({ id: '1' })),
      deletePost: jest.fn(async () => ({ id: '1' })),
      addLike: jest.fn(async () => ({})),
      getPostsByAuthor: jest.fn(async () => [{ id: '1' }]),
      addComment: jest.fn(async () => ({ id: '1', comments: [] })),
      getPostsByTags: jest.fn(async () => []),
      getPostsByPeriod: jest.fn(async () => []),
      updatePost: jest.fn(async () => ({ id: '1', title: 'x' })),
    };
    jest.unstable_mockModule('../../services/post.service.js', () => ({
      default: mockService,
    }));

    const routes = (await import('../../routes/post.routes.js')).default;
    const errorHandler = (await import('../../middlewares/errorHandler.middleware.js')).default;

    app = express();
    app.use(express.json());
    app.use('/forum', routes);
    app.use(errorHandler);
  });

  test('POST /forum/post/:author creates a post', async () => {
    const res = await request(app)
      .post('/forum/post/alice')
      .send({ title: 't', content: 'c' });
    expect(res.status).toBe(201);
    expect(mockService.createPost).toHaveBeenCalledWith('alice', { title: 't', content: 'c' });
  });

  test('GET /forum/post/:id returns 404 mapped error', async () => {
    mockService.getPostById.mockRejectedValueOnce(new Error('Post with id=1 not found'));
    const res = await request(app).get('/forum/post/1');
    expect(res.status).toBe(404);
    expect(res.body).toEqual(expect.objectContaining({ code: 404, status: 'Not found', path: '/forum/post/1' }));
  });

  test('PATCH /forum/post/:id/like returns 204', async () => {
    const res = await request(app).patch('/forum/post/5/like');
    expect(res.status).toBe(204);
    expect(mockService.addLike).toHaveBeenCalledWith('5');
  });

  test('PATCH /forum/post/:id updates post', async () => {
    const res = await request(app).patch('/forum/post/1').send({ title: 'x' });
    expect(res.status).toBe(200);
    expect(mockService.updatePost).toHaveBeenCalledWith('1', { title: 'x' });
  });
});
