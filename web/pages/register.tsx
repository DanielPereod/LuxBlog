import {
  Box,
  Button,
  Flex,
  Heading,
  LightMode,
  Link,
  theme,
  useColorMode,
} from "@chakra-ui/core";
import { Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement } from "react";
import AuthInput from "../components/AuthInput";
import { useRegisterMutation } from "../graphql/generated/graphql";
import { createUrlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface Props {}

function Register({}: Props): ReactElement {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [, register] = useRegisterMutation();
  const color = { light: "white", dark: "gray" };

  return (
    <Flex height="100vh" className="background">
      {console.log(color[colorMode])}
      <Box
        background={color[colorMode]}
        padding="30px"
        borderRadius="20x"
        width={["100%", "90%", "55%", "30%", "20%"]}
        margin="auto"
        justifyContent="center"
        alignContent="center"
      >
        <Heading mb="10" textAlign="center">
          Register
        </Heading>
        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
            password_repeat: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            if (values.password === values.password_repeat) {
              const res = await register({
                email: values.email,
                username: values.username,
                password: values.password,
              });

              if (res.data?.register.errors) {
                setErrors(toErrorMap(res.data.register.errors));
              } else if (res.data?.register.user) {
                router.push("/");
              }
            } else {
              setErrors({ password: "passwords do not match" });
            }
          }}
        >
          {({ isSubmitting, handleChange, values, handleSubmit, errors }) => (
            <form onSubmit={handleSubmit}>
              <AuthInput
                errors={errors.username}
                handleChange={handleChange}
                values={values.username}
                name={"username"}
                type="text"
              />

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

              <AuthInput
                errors={errors.password}
                type=""
                name="password_repeat"
                handleChange={handleChange}
                values={values.password_repeat}
              />
              <Box w="100%" textAlign="center">
                <Button w="50%" isLoading={isSubmitting} type="submit">
                  Register
                </Button>
              </Box>
            </form>
          )}
        </Formik>
        <Box mt="20px" opacity={0.5} textAlign="center">
          <Link href="/login">Already have an account?</Link>
        </Box>
      </Box>
    </Flex>
  );
}

export default withUrqlClient(createUrlClient)(Register);
