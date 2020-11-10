import { Flex } from "@chakra-ui/core";
import Image from "next/image";
import React from "react";

interface Props {}

export const LoadScreen = (props: Props) => {
  return (
    <Flex
      pos="absolute"
      width="100vw"
      height="100vh"
      justify="center"
      align="center"
    >
      <Image src="/loadscreen.gif" width="200px" height="200px" />
    </Flex>
  );
};
