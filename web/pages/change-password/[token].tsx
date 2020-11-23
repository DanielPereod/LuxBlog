import { Box, Button, Flex, Heading } from "@chakra-ui/core";
import { Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React from "react";
import AuthInput from "../../components/AuthInput";
import { useChangePasswordMutation } from "../../graphql/generated/graphql";
import { createUrlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

interface Props {
  token?: string;
}

const ChangePassword: NextPage<Props> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();

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
            new_password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const res = await changePassword({
              newPassword: values.new_password,
              token: token,
            });

            if (res.data?.changePassword.errors) {
              setErrors(toErrorMap(res.data.changePassword.errors));
            } else if (res.data?.changePassword.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting, handleChange, values, handleSubmit, errors }) => (
            <form onSubmit={handleSubmit}>
              <AuthInput
                errors={errors.new_password}
                type=""
                name="new_password"
                handleChange={handleChange}
                values={values.new_password}
              />

              <Box w="100" textAlign="center">
                <Button w="50%" isLoading={isSubmitting} type="submit">
                  Change
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrlClient, { ssr: false })(ChangePassword);
