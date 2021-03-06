import { IconButton } from "@chakra-ui/button";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<
        "updoot-loading" | "downdoot-loading" | "not-loading"
    >("not-loading");
    const [, vote] = useVoteMutation();
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            mr={4}
        >
            <IconButton
                aria-label="updoot post"
                icon={<ChevronUpIcon boxSize="24px" />}
                colorScheme={post.voteStatus === 1 ? "green" : undefined}
                isLoading={loadingState === "updoot-loading"}
                onClick={async () => {
                    if (post.voteStatus === 1) {
                        return;
                    }
                    setLoadingState("updoot-loading");
                    await vote({ postId: post.id, value: 1 });
                    setLoadingState("not-loading");
                }}
            />
            {post.points}
            <IconButton
                aria-label="downdoot post"
                icon={<ChevronDownIcon boxSize="24px" />}
                colorScheme={post.voteStatus === -1 ? "red" : undefined}
                isLoading={loadingState === "downdoot-loading"}
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return;
                    }
                    setLoadingState("downdoot-loading");
                    await vote({ postId: post.id, value: -1 });
                    setLoadingState("not-loading");
                }}
            />
        </Flex>
    );
};
