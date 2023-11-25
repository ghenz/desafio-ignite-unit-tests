import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to create a new user', async () => { 
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@test.com',
      password: '1234'
    })

    const user = await usersRepositoryInMemory.findByEmail('user@test.com');

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user if email exists', async () => {
    await createUserUseCase.execute({
      name: 'User Test', 
      email: 'user@test.com',
      password: '1234'
    })

    await expect(
      createUserUseCase.execute({
        name: 'User Test',
        email: 'user@test.com',
        password: '1234'
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });

 });
