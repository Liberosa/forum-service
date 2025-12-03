import {jest} from '@jest/globals';

describe('UserAccountService', () => {
  let Service;
  let mockRepo;

  beforeEach(async () => {
    jest.resetModules();
    mockRepo = {
      findUserByLogin: jest.fn(),
      createUser: jest.fn(async x => x),
      deleteUser: jest.fn(),
      updateUser: jest.fn(async (_l, data) => ({ login: _l, ...data })),
      addRole: jest.fn(async () => ({ roles: ['USER', 'ADMIN'] })),
      removeRole: jest.fn(async () => ({ roles: ['USER'] })),
    };
    jest.unstable_mockModule('../../repositories/userAccount.repository.js', () => ({
      default: mockRepo,
    }));
    ({ default: Service } = await import('../../services/userAccount.service.js'));
  });

  test('register throws error if login taken', async () => {
    mockRepo.createUser.mockRejectedValue(new Error('duplicate'));
    await expect(Service.register({ login: 'adam' })).rejects.toThrow('User with this login already exists');
  });

  test('register creates user', async () => {
    const user = { login: 'new', password: 'p', firstName: 'A', lastName: 'B' };
    mockRepo.createUser.mockResolvedValue(user);
    const result = await Service.register(user);
    expect(mockRepo.createUser).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  test('getUser throws if not found', async () => {
    mockRepo.findUserByLogin.mockResolvedValue(null);
    await expect(Service.getUser('x')).rejects.toThrow('User with login x not found');
  });

  test('deleteUser throws if not found', async () => {
    mockRepo.deleteUser.mockResolvedValue(null);
    await expect(Service.deleteUser('x')).rejects.toThrow('User with login x not found');
  });

  test('updateUser updates user data', async () => {
    const updated = { login: 'u', firstName: 'A', lastName: 'B' };
    mockRepo.updateUser.mockResolvedValue(updated);
    const result = await Service.updateUser('u', { firstName: 'A', lastName: 'B' });
    expect(mockRepo.updateUser).toHaveBeenCalledWith('u', { firstName: 'A', lastName: 'B' });
    expect(result).toEqual(updated);
  });

  test('changeRoles adds role', async () => {
    const user = { login: 'u', roles: ['USER', 'ADMIN'] };
    mockRepo.addRole.mockResolvedValue(user);
    const result = await Service.changeRoles('u', 'admin', true);
    expect(mockRepo.addRole).toHaveBeenCalledWith('u', 'ADMIN');
    expect(result).toEqual({ roles: ['USER', 'ADMIN'], login: 'u' });
  });

  test('changeRoles removes role', async () => {
    const user = { login: 'u', roles: ['USER'] };
    mockRepo.removeRole.mockResolvedValue(user);
    const result = await Service.changeRoles('u', 'moderator', false);
    expect(mockRepo.removeRole).toHaveBeenCalledWith('u', 'MODERATOR');
    expect(result).toEqual({ roles: ['USER'], login: 'u' });
  });

  test('changeRoles throws if user not found', async () => {
    mockRepo.addRole.mockResolvedValue(null);
    await expect(Service.changeRoles('x', 'admin', true)).rejects.toThrow('User with login x not found');
  });
});
