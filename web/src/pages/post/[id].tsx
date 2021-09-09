import { Heading } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import dynamic from "next/dynamic";
import React from "react";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const EditDeletePostButtons = dynamic(
    () => import("../../components/EditDeletePostButtons"),
    { ssr: true }
);

const Post = ({}) => {
    const [{ data, error, fetching }] = useGetPostFromUrl();

    if (fetching) {
        return <Layout>loading...</Layout>;
    }

    if (!data?.post) {
        <Layout>
            <Box>could not find post</Box>
        </Layout>;
    }

    return (
        <Layout>
            <Heading mb={4}>{data?.post?.title}</Heading>
            <Box mb={4}>{data?.post?.text}</Box>
            <EditDeletePostButtons
                id={data?.post?.id as number}
                creatorId={data?.post?.creator.id as number}
            />
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
