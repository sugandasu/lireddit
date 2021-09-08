import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Heading } from "@chakra-ui/layout";

const Post = ({}) => {
    const router = useRouter();
    const intId =
        typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: { id: intId },
    });

    if (fetching) {
        return <Layout>loading...</Layout>;
    }

    return (
        <Layout>
            <Heading mb={4}>{data?.post?.title}</Heading>
            {data?.post?.text}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
