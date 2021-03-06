import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import { Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement } from "react";
import AuthInput from "../components/AuthInput";
import { useLoginMutation } from "../graphql/generated/graphql";
import { createUrlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface Props {}

function Login({}: Props): ReactElement {
  const router = useRouter();

  const [, login] = useLoginMutation();

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
          Login
        </Heading>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const res = await login({
              email: values.email,
              password: values.password,
            });

            if (res.data?.login.errors) {
              setErrors(toErrorMap(res.data.login.errors));
            } else if (res.data?.login.user) {
              router.push("/");
            }
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

              <AuthInput
                errors={errors.password}
                type=""
                name="password"
                handleChange={handleChange}
                values={values.password}
              />

              <Box w="100" textAlign="center">
                <Button w="50%" isLoading={isSubmitting} type="submit">
                  Login
                </Button>
              </Box>
            </form>
          )}
        </Formik>
        <Box mt="20px" opacity={0.5} textAlign="center">
          <Link href="/register">Create an account!</Link>
          <Link href="change-password">Forgot your password?</Link>
        </Box>
      </Box>
    </Flex>
  );
}
export default withUrqlClient(createUrlClient)(Login);
