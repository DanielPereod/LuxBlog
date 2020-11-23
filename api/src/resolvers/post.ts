import { Post } from "../entities/Post";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

@ArgsType()
class PostInput {
  @Field(() => String, { nullable: false })
  title: string;

  @Field(() => String, { nullable: false })
  description: string;
}

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    const posts = await Post.find();
    return posts;
  }

  @Query(() => Post)
  async post(
    @Arg("id", { nullable: false }) id: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    return post;
  }

  @Mutation(() => Post)
  async createPost(@Args() { title, description }: PostInput): Promise<Post> {
    const post = await Post.create({ title, description }).save();
    return post;
  }
}
