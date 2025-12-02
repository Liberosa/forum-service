import {jest} from '@jest/globals';

describe('PostService', () => {
  let PostService;
  let mockRepo;

  beforeEach(async () => {
    jest.resetModules();
    mockRepo = {
      createPost: jest.fn(async x => ({ ...x, id: '1' })),
      findPostById: jest.fn(),
      addLike: jest.fn(),
      findPostByAuthor: jest.fn(async () => [{ id: '1' }]),
      addComment: jest.fn(),
      deletePost: jest.fn(),
      findPostsByTags: jest.fn(async () => []),
      findPostsByPeriod: jest.fn(async () => []),
      updatePost: jest.fn(async (_id, data) => ({ id: _id, ...data })),
    };
    jest.unstable_mockModule('../../repositories/post.repository.js', () => ({
      default: mockRepo,
    }));
    ({ default: PostService } = await import('../../services/post.service.js'));
  });

  test('createPost delegates to repository and adds author', async () => {
    const res = await PostService.createPost('alice', { title: 't' });
    expect(mockRepo.createPost).toHaveBeenCalledWith({ title: 't', author: 'alice' });
    expect(res.id).toBe('1');
  });

  test('getPostById throws if not found', async () => {
    mockRepo.findPostById.mockResolvedValue(null);
    await expect(PostService.getPostById('x')).rejects.toThrow('Post with id=x not found');
  });

  test('addLike throws if repo returns null', async () => {
    mockRepo.addLike.mockResolvedValue(null);
    await expect(PostService.addLike('p1')).rejects.toThrow('Post with id p1 not found');
  });

  test('addComment passes comment and throws if null', async () => {
    mockRepo.addComment.mockResolvedValue({ id: '1', comments: [] });
    await PostService.addComment('1', 'bob', 'hi');
    expect(mockRepo.addComment).toHaveBeenCalledWith('1', { user: 'bob', message: 'hi' });
    mockRepo.addComment.mockResolvedValueOnce(null);
    await expect(PostService.addComment('2', 'bob', 'x')).rejects.toThrow('Post with id 2 not found');
  });

  test('deletePost throws when not found', async () => {
    mockRepo.deletePost.mockResolvedValue(null);
    await expect(PostService.deletePost('1')).rejects.toThrow('Post with id 1 not found');
  });

  test('getPostsByTags lowercases and trims', async () => {
    await PostService.getPostsByTags(' Js, Node ');
    expect(mockRepo.findPostsByTags).toHaveBeenCalledWith(['js', 'node']);
  });

  test('getPostsByPeriod converts to Date', async () => {
    const from = '2020-01-01T00:00:00.000Z';
    const to = '2020-02-01T00:00:00.000Z';
    await PostService.getPostsByPeriod(from, to);
    const call = mockRepo.findPostsByPeriod.mock.calls[0];
    expect(call[0]).toBeInstanceOf(Date);
    expect(call[1]).toBeInstanceOf(Date);
  });

  test('updatePost merges tags and throws if not found', async () => {
    mockRepo.findPostById.mockResolvedValue({ id: '1', tags: ['a'] });
    await PostService.updatePost('1', { title: 'x', tags: ['b'] });
    expect(mockRepo.updatePost).toHaveBeenCalledWith('1', { title: 'x', tags: ['b', 'a'] });

    mockRepo.findPostById.mockResolvedValueOnce(null);
    await expect(PostService.updatePost('9', { title: 't' })).rejects.toThrow('Post with id 9 not found');
  });
});
