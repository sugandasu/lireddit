import { MyContext } from "../types";
import { User } from "../entities/User";
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernameAndPasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernameAndPasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.trim().length <= 4) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be greater than 4 characters",
          },
        ],
      };
    }

    if (options.password.trim().length <= 6) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be greater than 6 characters",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "Username is already taken",
            },
          ],
        };
      }
    }
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernameAndPasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (user) {
      const validPassword = await argon2.verify(
        user.password,
        options.password
      );
      if (validPassword) {
        return {
          user,
        };
      }
    }

    return {
      errors: [
        {
          field: "username",
          message: "Username or password is invalid",
        },
      ],
    };
  }
}
