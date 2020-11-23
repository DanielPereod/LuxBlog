import { Box } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import Navbar from "../components/Navbar";
import { usePostsQuery } from "../graphql/generated/graphql";
import { createUrlClient } from "../utils/createUrqlClient";

function Index() {
  const [{ fetching, data }] = usePostsQuery();

  return (
    <>
      <Navbar />
      {!data
        ? null
        : data.posts.map((post, key) => (
            <Box key={key}>
              <Box>{post.title}</Box>
              <Box>{post.description}</Box>
            </Box>
          ))}
    </>
  );
}

export default withUrqlClient(createUrlClient, { ssr: true })(Index);
