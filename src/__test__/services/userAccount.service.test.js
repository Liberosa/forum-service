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

  test('register returns 409 error if login taken', async () => {
    mockRepo.findUserByLogin.mockResolvedValue({ login: 'adam' });
    await expect(Service.register({ login: 'adam' })).rejects.toMatchObject({ statusCode: 409 });
  });

  test('register sets default USER role', async () => {
    mockRepo.findUserByLogin.mockResolvedValue(null);
    await Service.register({ login: 'new', password: 'p', firstName: 'A', lastName: 'B' });
    expect(mockRepo.createUser).toHaveBeenCalledWith(expect.objectContaining({ roles: ['USER'] }));
  });

  test('getUser throws if not found', async () => {
    mockRepo.findUserByLogin.mockResolvedValue(null);
    await expect(Service.getUser('x')).rejects.toThrow('User with login x not found');
  });

  test('removeUser throws if not found', async () => {
    mockRepo.deleteUser.mockResolvedValue(null);
    await expect(Service.removeUser('x')).rejects.toThrow('User with login x not found');
  });

  test('updateUser only allows firstName/lastName and requires existing', async () => {
    mockRepo.findUserByLogin.mockResolvedValue({ login: 'u', roles: ['USER'] });
    await Service.updateUser('u', { firstName: 'A', lastName: 'B', password: 'HACK' });
    expect(mockRepo.updateUser).toHaveBeenCalledWith('u', { firstName: 'A', lastName: 'B' });
  });

  test('updateUser throws if user does not exist', async () => {
    mockRepo.findUserByLogin.mockResolvedValue(null);
    await expect(Service.updateUser('no', { firstName: 'A' })).rejects.toThrow('User with login no not found');
  });

  test('changeRoles validates role and prevents removing last role', async () => {
    mockRepo.findUserByLogin.mockResolvedValue({ login: 'u', roles: ['USER'] });
    await Service.changeRoles('u', 'admin', true);
    expect(mockRepo.addRole).toHaveBeenCalledWith('u', 'ADMIN');

    await expect(Service.changeRoles('u', 'user', false)).rejects.toMatchObject({ statusCode: 400 });
  });

  test('changeRoles rejects invalid role with 400', async () => {
    mockRepo.findUserByLogin.mockResolvedValue({ login: 'u', roles: ['USER'] });
    await expect(Service.changeRoles('u', 'invalid', true)).rejects.toMatchObject({ statusCode: 400 });
  });
});
