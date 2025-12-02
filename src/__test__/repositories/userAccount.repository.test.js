/** @jest-environment node */
import {jest} from '@jest/globals';

const makeMockUserModel = () => {
  const MockUser = function (data) {
    this._data = data;
    this.save = jest.fn().mockResolvedValue({ ...data });
  };
  MockUser.findOne = jest.fn();
  MockUser.findOneAndDelete = jest.fn();
  MockUser.findOneAndUpdate = jest.fn();
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

  test('findUserByLogin delegates to findOne with case-insensitive regex', async () => {
    MockUser.findOne.mockResolvedValue({ login: 'user' });
    const res = await repo.findUserByLogin('User');
    expect(MockUser.findOne).toHaveBeenCalled();
    const arg = MockUser.findOne.mock.calls[0][0];
    expect(arg.login).toBeInstanceOf(RegExp);
    expect(arg.login.flags).toContain('i');
    expect(res).toEqual({ login: 'user' });
  });

  test('deleteUser delegates to findOneAndDelete with regex', async () => {
    MockUser.findOneAndDelete.mockResolvedValue({ login: 'x' });
    await repo.deleteUser('x');
    const arg = MockUser.findOneAndDelete.mock.calls[0][0];
    expect(arg.login).toBeInstanceOf(RegExp);
  });

  test('updateUser delegates to findOneAndUpdate with new: true', async () => {
    MockUser.findOneAndUpdate.mockResolvedValue({ login: 'x', firstName: 'A' });
    const res = await repo.updateUser('x', { firstName: 'A' });
    expect(MockUser.findOneAndUpdate).toHaveBeenCalled();
    const args = MockUser.findOneAndUpdate.mock.calls[0];
    expect(args[2]).toEqual({ new: true });
    expect(res.firstName).toBe('A');
  });

  test('addRole calls $addToSet and uppercases role', async () => {
    MockUser.findOneAndUpdate.mockResolvedValue({ login: 'x', roles: ['USER', 'ADMIN'] });
    await repo.addRole('x', 'admin');
    const args = MockUser.findOneAndUpdate.mock.calls[0];
    expect(args[1]).toEqual({ $addToSet: { roles: 'ADMIN' } });
  });

  test('removeRole calls $pull and uppercases role', async () => {
    MockUser.findOneAndUpdate.mockResolvedValue({ login: 'x', roles: ['USER'] });
    await repo.removeRole('x', 'user');
    const args = MockUser.findOneAndUpdate.mock.calls.pop();
    expect(args[1]).toEqual({ $pull: { roles: 'USER' } });
  });
});
