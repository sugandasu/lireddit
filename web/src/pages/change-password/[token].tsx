import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "Formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const token =
        typeof router.query.token === "string" ? router.query.token : "";
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState();
    return (
        <Wrapper variant="regular">
            <Formik
                initialValues={{
                    newPassword: "",
                }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token,
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );
                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box>
                            <InputField
                                name="newPassword"
                                placeholder="new password"
                                label="New Password"
                                type="password"
                            />
                        </Box>
                        {tokenError ? (
                            <Flex>
                                <Box mr={2} color="red">
                                    {tokenError}
                                </Box>
                                <NextLink href="/forgot-password">
                                    <Link>reset token</Link>
                                </NextLink>
                            </Flex>
                        ) : null}
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme="teal"
                        >
                            change password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
