import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "Formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

const CreatePost: React.FC<{}> = ({}) => {
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    title: "",
                    text: "",
                }}
                onSubmit={async (values) => {
                    console.log(values);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="title"
                            label="Title"
                        />
                        <Box mt={4}>
                            <InputField
                                textarea
                                name="text"
                                placeholder="text..."
                                label="Text"
                            />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme="teal"
                        >
                            create post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default CreatePost;
