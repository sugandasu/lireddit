import { IconButton } from "@chakra-ui/button";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import NextLink from "next/link";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
    id: number;
    creatorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
    id,
    creatorId,
}) => {
    const [{ data: meData }] = useMeQuery();
    const [, deletePost] = useDeletePostMutation();
    if (meData?.me?.id !== creatorId) {
        return null;
    }

    return (
        <Box ml="auto">
            <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <IconButton
                    variant="Link"
                    mr={4}
                    bgColor="blue"
                    textColor="white"
                    aria-label="edit post"
                    icon={<EditIcon />}
                />
            </NextLink>
            <IconButton
                colorScheme="red"
                aria-label="delete post"
                icon={<DeleteIcon />}
                onClick={() => {
                    deletePost({
                        id,
                    });
                }}
            />
        </Box>
    );
};

export default EditDeletePostButtons;
