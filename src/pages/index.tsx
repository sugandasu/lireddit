import { Link } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";

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
                <Stack spacing={8}>
                    {data.posts.map((post) => (
                        <Box key={post.id} p={5} shadow="md" borderWidth="1px">
                            <Heading fontSize="xl">{post.title}</Heading>
                            <Text mt={4}>{post.text}</Text>
                        </Box>
                    ))}
                </Stack>
            )}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
