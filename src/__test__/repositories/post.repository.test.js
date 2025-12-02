/** @jest-environment node */
import {jest} from '@jest/globals';

// Mock Post model with constructor (for save) and static methods
const makeMockPostModel = () => {
  const MockPost = function (data) {
    this._data = data;
    this.save = jest.fn().mockResolvedValue({ ...data, id: 'mock-id' });
  };
  MockPost.findById = jest.fn();
  MockPost.findByIdAndDelete = jest.fn();
  MockPost.findByIdAndUpdate = jest.fn();
  MockPost.find = jest.fn();
  return MockPost;
};

describe('post.repository', () => {
  let PostRepository;
  let MockPost;

  beforeEach(async () => {
    jest.resetModules();
    MockPost = makeMockPostModel();
    jest.unstable_mockModule('../../models/post.model.js', () => ({
      default: MockPost,
    }));
    ({ default: PostRepository } = await import('../../repositories/post.repository.js'));
  });

  test('createPost uses new Post().save()', async () => {
    const repo = PostRepository; // singleton
    const data = { title: 't', content: 'c', author: 'a' };
    const res = await repo.createPost(data);
    expect(res).toEqual(expect.objectContaining({ title: 't', content: 'c', author: 'a', id: 'mock-id' }));
  });

  test('findPostById delegates to Post.findById', async () => {
    const repo = PostRepository;
    MockPost.findById.mockResolvedValue({ id: '1' });
    const res = await repo.findPostById('1');
    expect(MockPost.findById).toHaveBeenCalledWith('1');
    expect(res).toEqual({ id: '1' });
  });

  test('deletePost delegates to findByIdAndDelete', async () => {
    const repo = PostRepository;
    MockPost.findByIdAndDelete.mockResolvedValue({ id: '1' });
    const res = await repo.deletePost('1');
    expect(MockPost.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(res).toEqual({ id: '1' });
  });

  test('addLike uses $inc with findByIdAndUpdate', async () => {
    const repo = PostRepository;
    MockPost.findByIdAndUpdate.mockResolvedValue({ id: '1', likes: 1 });
    const res = await repo.addLike('1');
    expect(MockPost.findByIdAndUpdate).toHaveBeenCalledWith('1', { $inc: { likes: 1 } }, { new: true });
    expect(res).toEqual({ id: '1', likes: 1 });
  });

  test('findPostByAuthor uses case-insensitive regex', async () => {
    const repo = PostRepository;
    MockPost.find.mockResolvedValue([{ id: '1' }]);
    const res = await repo.findPostByAuthor('Alice');
    expect(MockPost.find).toHaveBeenCalled();
    const arg = MockPost.find.mock.calls[0][0];
    expect(arg.author).toBeInstanceOf(RegExp);
    expect(arg.author.flags).toContain('i');
    expect(res).toEqual([{ id: '1' }]);
  });

  test('addComment pushes comment and returns new doc', async () => {
    const repo = PostRepository;
    const comment = { user: 'u', message: 'm' };
    MockPost.findByIdAndUpdate.mockResolvedValue({ id: '1', comments: [comment] });
    const res = await repo.addComment('1', comment);
    expect(MockPost.findByIdAndUpdate).toHaveBeenCalledWith('1', { $push: { comments: comment } }, { new: true });
    expect(res.comments).toContainEqual(comment);
  });

  test('findPostsByTags builds $or regex filters', async () => {
    const repo = PostRepository;
    MockPost.find.mockResolvedValue([]);
    await repo.findPostsByTags(['js', 'node']);
    const arg = MockPost.find.mock.calls[0][0];
    expect(Array.isArray(arg.$or)).toBe(true);
    expect(arg.$or.length).toBe(2);
  });

  test('findPostsByPeriod queries by dateCreated range', async () => {
    const repo = PostRepository;
    const from = new Date('2020-01-01');
    const to = new Date('2020-12-31');
    MockPost.find.mockResolvedValue([]);
    await repo.findPostsByPeriod(from, to);
    expect(MockPost.find).toHaveBeenCalledWith({ dateCreated: { $gte: from, $lte: to } });
  });

  test('updatePost delegates to findByIdAndUpdate with new: true', async () => {
    const repo = PostRepository;
    MockPost.findByIdAndUpdate.mockResolvedValue({ id: '1', title: 'x' });
    const res = await repo.updatePost('1', { title: 'x' });
    expect(MockPost.findByIdAndUpdate).toHaveBeenCalledWith('1', { title: 'x' }, { new: true });
    expect(res.title).toBe('x');
  });
});
