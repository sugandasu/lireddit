import React from "react";
import { Formik, Form } from "Formik";
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
    return (
        <Wrapper variant="regular">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {(values, handleChange) => (
                    <Form>
                        <FormControl>
                            <FormLabel htmlFor="username">Name</FormLabel>
                            <Input
                                value={values.username}
                                onChange={handleChange}
                                id="username"
                                placeholder="username"
                            ></Input>
                            {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                        </FormControl>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default register;
