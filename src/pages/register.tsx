import React from "react";
import { Formik, Form } from "Formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUT = `
mutation Register ($username: String!, $password: String!) {
    register(options: {username: $username, password: $password}) {
        errors{
            field
            message
        },
        user{
            id
            username
        }
    }
}
`;

const register: React.FC<registerProps> = ({}) => {
    const [, register] = useMutation(REGISTER_MUT);
    return (
        <Wrapper variant="regular">
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                }}
                onSubmit={async (values) => {
                    const response = await register(values);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="Username"
                            label="Username"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="Password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme="teal"
                        >
                            register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default register;
