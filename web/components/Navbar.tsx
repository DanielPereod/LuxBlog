import { Box, Button, Flex, Icon, Link, useColorMode } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { useLogoutMutation, useMeQuery } from "../graphql/generated/graphql";
import { isServer } from "../utils/isServer";
import { LoadScreen } from "./LoadScreen";

interface Props {}

export default function Navbar({}: Props): ReactElement {
  const { colorMode, toggleColorMode } = useColorMode();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  if (fetching) {
  }

  const isLogged = (
    <Flex align="center" fontWeight="semibold">
      <Box>{data?.me?.username}</Box>
      <Box>
        <Button isLoading={logoutFetching} onClick={() => logout()}>
          Log out
        </Button>
      </Box>
    </Flex>
  );
  const isNotLogged = (
    <Box>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </Box>
  );

  return (
    <Flex justifyContent="flex-end" m={3}>
      {!data?.me ? isNotLogged : isLogged}
      <Button ml={3} onClick={toggleColorMode}>
        {colorMode === "light" ? <Icon name="sun" /> : <Icon name="moon" />}
      </Button>
    </Flex>
  );
}
