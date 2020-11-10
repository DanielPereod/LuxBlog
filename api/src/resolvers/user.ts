import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { MyContext } from "../types";

@ArgsType()
class InputUser {
  @Field(() => String, { nullable: true })
  username?: string;
  @Field(() => String, { nullable: true })
  email?: string;
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

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() { em }: MyContext): Promise<User[]> {
    const users = await em.find(User, {});
    return users;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Query(() => User)
  async user(
    @Arg("id") id: string,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    const user = em.findOne(User, { id });

    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Args() { email, password }: InputUser,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { email });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "no user found with given email",
          },
        ],
      };
    }

    const verifiedHash = await argon2.verify(user!.password, password);

    if (!verifiedHash) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    if (verifiedHash) {
      req.session.userId = user.id;

      return {
        user: user,
      };
    }
    return {
      errors: [
        {
          field: "user",
          message: "something went wrong",
        },
      ],
    };
  }

  @Mutation(() => UserResponse)
  async register(
    @Args() { username, email, password }: InputUser,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    try {
      let hash = await argon2.hash(password);
      const user = em.create(User, { username, email, password: hash });
      await em.persistAndFlush(user);
      return {
        user: user,
      };
    } catch (error) {
      if (error.constraint === "user_username_unique") {
        return {
          errors: [{ field: "username", message: "username already exist" }],
        };
      }
      if (error.constraint === "user_email_unique") {
        return {
          errors: [{ field: "email", message: "email already exist" }],
        };
      }

      return {
        errors: [{ field: "web", message: "something went wrong" }],
      };
    }
  }
}
