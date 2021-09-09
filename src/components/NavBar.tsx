import { Box, Button, Flex, Link, Heading } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter();
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });
    let body = (
        <>
            <NextLink href="/login">
                <Link color="white" mr={2}>
                    login
                </Link>
            </NextLink>
            <NextLink href="/register">
                <Link color="white">register</Link>
            </NextLink>
        </>
    );

    if (fetching) {
    } else if (!data?.me) {
    } else {
        body = (
            <Flex align="center">
                <NextLink href="/create-post">
                    <Button as={Link} mr={4}>
                        create post
                    </Button>
                </NextLink>
                <Box mr={2}>{data.me.username}</Box>
                <Button
                    onClick={async () => {
                        await logout();
                        router.reload();
                    }}
                    isLoading={logoutFetching}
                    variant="link"
                >
                    logout
                </Button>
            </Flex>
        );
    }
    return (
        <Flex zIndex={2} position="sticky" top={0} bg="tan" p={4}>
            <Flex flex={1} margin="auto" maxW={800} align="center">
                <NextLink href="/">
                    <Link>
                        <Heading>LiReddit</Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>{body}</Box>
            </Flex>
        </Flex>
    );
};

export default NavBar;
