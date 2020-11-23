import { Box, Heading, Button, Flex, Link } from "@chakra-ui/core";
import { Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement } from "react";
import AuthInput from "../components/AuthInput";
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from "../graphql/generated/graphql";
import { createUrlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface Props {}

function ChangePassword({}: Props): ReactElement {
  const router = useRouter();
  const [, forgotPassword] = useForgotPasswordMutation();

  return (
    <Flex height="100vh" className="background">
      <Box
        background="#fff"
        padding="30px"
        borderRadius="20px"
        width={["100%", "90%", "55%", "30%", "20%"]}
        margin="auto"
        justifyContent="center"
        alignContent="center"
      >
        <Heading textAlign="center" mb="10">
          Change Password
        </Heading>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async (values) => {
            try {
              await forgotPassword({
                email: values.email,
              });
            } catch (error) {
              console.log(error);
            }

            router.push("/");
          }}
        >
          {({ isSubmitting, handleChange, values, handleSubmit, errors }) => (
            <form onSubmit={handleSubmit}>
              <AuthInput
                errors={errors.email}
                handleChange={handleChange}
                values={values.email}
                name={"email"}
                type="email"
              />

              <Box w="100" textAlign="center">
                <Button w="50%" isLoading={isSubmitting} type="submit">
                  Send email
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}
export default withUrqlClient(createUrlClient, { ssr: false })(ChangePassword);
