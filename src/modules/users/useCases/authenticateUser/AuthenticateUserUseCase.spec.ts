import { log } from "console";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate a user', async () => { 
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@test.com',
      password: '1234'
    })

    const session = await authenticateUserUseCase.execute({ email: 'user@test.com', password: '1234'})

    expect(session).toHaveProperty('token');
  });

  it('should not be able to authenticate a non-existent user', async () => {
    const session = authenticateUserUseCase.execute({ email: 'user@test.com', password: '1234'})
    await expect(session).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it('should not be able to authenticate a user with incorrect password', async () => {
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@test.com',
      password: '1234'
    })

    expect(() => 
          authenticateUserUseCase.execute({ email: 'user@test.com', password: '123'}))
          .rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

 });
