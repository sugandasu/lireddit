import { MyContext } from "../types/myContext";
import { User } from "../entities/User";
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { EntityManager } from "@mikro-orm/postgresql";
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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernameAndPasswordInput,
    @Ctx() { em, req }: MyContext
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
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
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

    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernameAndPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (user) {
      const validPassword = await argon2.verify(
        user.password,
        options.password
      );
      if (validPassword) {
        req.session.userId = user.id;
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
