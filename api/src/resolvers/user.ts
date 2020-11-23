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
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { v4 as uuid } from "uuid";
import { emailForgotPassword } from "../utils/emailTemplate";

@ArgsType()
class InputUser {
  @Field(() => String, { nullable: true })
  username?: string;
  @Field(() => String, { nullable: true })
  email?: string;
  @Field()
  password: string;
}

@ArgsType()
class ChangePassword {
  @Field(() => String)
  token: string;
  @Field(() => String)
  newPassword: string;
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
  async users(): Promise<User[]> {
    const users = await User.find();
    return users;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Query(() => User)
  user(@Arg("id") id: string, @Ctx() {}: MyContext): Promise<User | undefined> {
    return User.findOne(id);
  }

  @Mutation(() => UserResponse)
  async login(
    @Args() { email, password }: InputUser,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });
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
    @Args() { username, email, password }: InputUser
  ): Promise<UserResponse> {
    try {
      let hash = await argon2.hash(password);
      const user = await User.create({
        username,
        email,
        password: hash,
      }).save();
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

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { redis }: MyContext,
    @Arg("email") email: string
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const token = uuid();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 12
    );

    sendEmail(email, emailForgotPassword(process.env.FRONT_URL, token));
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Ctx() { redis, req }: MyContext,
    @Args() { token, newPassword }: ChangePassword
  ): Promise<UserResponse> {
    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "no user found",
          },
        ],
      };
    }
    const hash = await argon2.hash(newPassword);

    await User.update({ id: user.id }, { password: hash });

    req.session.userId = userId;
    redis.del(FORGET_PASSWORD_PREFIX + token);

    return {
      user,
    };
  }
}
