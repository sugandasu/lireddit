import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Link } from "@chakra-ui/layout";
import {
    Box,
    Button,
    Heading,
    IconButton,
    Stack,
    Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery, useDeletePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 10,
        cursor: null as null | string,
    });
    const [{ data, fetching }] = usePostsQuery({
        variables,
    });
    const [, deletePost] = useDeletePostMutation();

    if (!fetching && !data) {
        return <Box>Query failed</Box>;
    }
    return (
        <Layout>
            {!data && fetching ? (
                <div>loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((post) =>
                        !post ? null : (
                            <Flex
                                key={post.id}
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                            >
                                <UpdootSection post={post}></UpdootSection>
                                <Box flex={1}>
                                    <NextLink
                                        href="/post/[id]"
                                        as={`/post/${post.id}`}
                                    >
                                        <Link>
                                            <Heading fontSize="xl">
                                                {post.title}
                                            </Heading>
                                        </Link>
                                    </NextLink>
                                    <Text>
                                        posted by {post.creator.username}
                                    </Text>
                                    <Flex flex={1} align="center">
                                        <Text mt={4}>{post.textSnippet}</Text>
                                        <IconButton
                                            ml="auto"
                                            colorScheme="red"
                                            aria-label="delete post"
                                            icon={<DeleteIcon />}
                                            onClick={() => {
                                                deletePost({ id: post.id });
                                            }}
                                        />
                                    </Flex>
                                </Box>
                            </Flex>
                        )
                    )}
                </Stack>
            )}
            {data && data.posts.hasMore ? (
                <Flex>
                    <Button
                        onClick={() => {
                            setVariables({
                                limit: variables.limit,
                                cursor: data.posts.posts[
                                    data.posts.posts.length - 1
                                ].createdAt,
                            });
                        }}
                        isLoading={fetching}
                        m="auto"
                        my={8}
                    >
                        Load more
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
