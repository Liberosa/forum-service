/** @jest-environment node */
import {jest} from '@jest/globals';

const makeMockUserModel = () => {
  const MockUser = function (data) {
    this._data = data;
    this.save = jest.fn().mockResolvedValue({ ...data });
  };
  MockUser.findById = jest.fn();
  MockUser.findByIdAndDelete = jest.fn();
  MockUser.findByIdAndUpdate = jest.fn();
  return MockUser;
};

describe('userAccount.repository', () => {
  let repo;
  let MockUser;

  beforeEach(async () => {
    jest.resetModules();
    MockUser = makeMockUserModel();
    jest.unstable_mockModule('../../models/user.model.js', () => ({
      default: MockUser,
    }));
    ({ default: repo } = await import('../../repositories/userAccount.repository.js'));
  });

  test('createUser uses new User().save()', async () => {
    const data = { login: 'user', password: 'pass', firstName: 'A', lastName: 'B' };
    const res = await repo.createUser(data);
    expect(res).toEqual(expect.objectContaining({ login: 'user' }));
  });

  test('findUserByLogin delegates to findById', async () => {
    MockUser.findById.mockResolvedValue({ login: 'user' });
    const res = await repo.findUserByLogin('user');
    expect(MockUser.findById).toHaveBeenCalledWith('user');
    expect(res).toEqual({ login: 'user' });
  });

  test('deleteUser delegates to findByIdAndDelete', async () => {
    MockUser.findByIdAndDelete.mockResolvedValue({ login: 'x' });
    await repo.deleteUser('x');
    expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith('x');
  });

  test('updateUser delegates to findByIdAndUpdate with new: true', async () => {
    MockUser.findByIdAndUpdate.mockResolvedValue({ login: 'x', firstName: 'A' });
    const res = await repo.updateUser('x', { firstName: 'A' });
    expect(MockUser.findByIdAndUpdate).toHaveBeenCalledWith('x', { firstName: 'A' }, { new: true });
    expect(res.firstName).toBe('A');
  });

  test('addRole calls $addToSet', async () => {
    MockUser.findByIdAndUpdate.mockResolvedValue({ login: 'x', roles: ['USER', 'ADMIN'] });
    await repo.addRole('x', 'ADMIN');
    expect(MockUser.findByIdAndUpdate).toHaveBeenCalledWith('x', { $addToSet: { roles: 'ADMIN' } }, { new: true });
  });

  test('removeRole calls $pull', async () => {
    MockUser.findByIdAndUpdate.mockResolvedValue({ login: 'x', roles: ['USER'] });
    await repo.removeRole('x', 'USER');
    expect(MockUser.findByIdAndUpdate).toHaveBeenCalledWith('x', { $pull: { roles: 'USER' } }, { new: true });
  });
});
