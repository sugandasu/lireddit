import { Post } from "../entities/Post";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types/myContext";
import { isAuth } from "../middlewares/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg("limit") limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50, limit);
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);
    if (cursor) {
      qb.where('"createdAt" < :cursor ', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    return qb.getMany();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("options") options: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...options, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
