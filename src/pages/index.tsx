import { Link } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
    const [{ data }] = usePostsQuery({
        variables: { limit: 10 },
    });
    return (
        <Layout>
            <NextLink href="/create-post">
                <Link>create post</Link>
            </NextLink>
            <div>hello world</div>
            <br />
            {!data ? (
                <div>loading...</div>
            ) : (
                data.posts.map((post) => <div key={post.id}>{post.title}</div>)
            )}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
