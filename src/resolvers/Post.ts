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
  Int,
  FieldResolver,
  Root,
} from "type-graphql";
import { MyContext } from "../types/myContext";
import { isAuth } from "../middlewares/isAuth";
import { getConnection } from "typeorm";
import { ObjectType } from "type-graphql";
import { Updoot } from "../entities/Updoot";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: Boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    const updoot = await Updoot.findOne({
      where: { postId: postId, userId: userId },
    });

    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        UPDATE updoot
        SET value = $1
        WHERE "userId" = $2 AND "postId" = $3
        `,
          [realValue, userId, postId]
        );

        await tm.query(
          `
        UPDATE post
        SET points = points + $1
        WHERE id = $2;
        `,
          [realValue * 2, postId]
        );
      });
    } else if (!updoot) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        INSERT into updoot 
        ("userId", "postId", value)
        VALUES ($1, $2, $3)
        `,
          [userId, postId, realValue]
        );

        await tm.query(
          `
        UPDATE post
        SET points = points + $1
        WHERE id = $2;
        `,
          [realValue, postId]
        );
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const parameters: any[] = [realLimitPlusOne];

    if (req.session.userId) {
      parameters.push(req.session.userId);
    }

    let cursorIdx = 2;
    if (cursor) {
      parameters.push(new Date(parseInt(cursor)));
      cursorIdx = parameters.length;
    }
    const posts = await getConnection().query(
      `
    SELECT p.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
    ) creator,
    ${
      req.session.userId
        ? '(SELECT value FROM updoot WHERE "userId" = $2 AND "postId" = p.id) as "voteStatus"'
        : 'null as "voteStatus" '
    }
    FROM post p
    INNER JOIN public.user u ON u.id = p."creatorId"
    ${cursor ? `WHERE p."createdAt" < $${cursorIdx}` : ""}
    ORDER BY p."createdAt" DESC
    LIMIT $1
    `,
      parameters
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id, { relations: ["creator"] });
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
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
