import "../styles/globals.css";

import type { AppProps } from "next/app";
import {
  CSSReset,
  ThemeProvider,
  ColorModeProvider,
  theme,
} from "@chakra-ui/core";
import { createClient, Provider } from "urql";
import { createContext, useEffect, useState } from "react";
import { useMeQuery } from "../graphql/generated/graphql";

const client = createClient({
  url: "http://localhost:4040/graphql",
  fetchOptions: {
    credentials: "include",
  },
});

const UserContext = createContext(null);

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState();
  /* const [{ fetching, data }] = useMeQuery(); */

  /*   useEffect(() => {
    if (!user && !fetching) {
      console.log(data?.me);
      /* setUser(); 
    }
  }); */
  return (
    <Provider value={client}>
      <UserContext.Provider value={null}>
        <ThemeProvider theme={theme}>
          <ColorModeProvider>
            <CSSReset />
            <Component {...pageProps} />
          </ColorModeProvider>
        </ThemeProvider>
      </UserContext.Provider>
    </Provider>
  );
}

export default MyApp;
