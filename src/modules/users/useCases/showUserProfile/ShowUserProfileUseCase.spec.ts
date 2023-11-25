import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { User } from "../../entities/User";

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to show user profile", async () => {
    const user: User = await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@test.com',
      password: '1234'
    })

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty("id");
    expect(userProfile.name).toEqual(user.name);
    expect(userProfile.email).toEqual(user.email);
  });

  it("should not be able to show non-existing user profile", () => {
    expect(() => {showUserProfileUseCase.execute("non-existing-user-id")})
      .rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
