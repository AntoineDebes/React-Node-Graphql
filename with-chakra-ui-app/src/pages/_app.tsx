import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { UseFormContextProvider } from "../context/useFormContext";
import client from "../types/apolloClient";

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <UseFormContextProvider>
        <ChakraProvider>
          <ColorModeProvider
            options={{
              useSystemColorMode: true,
            }}
          >
            <Component {...pageProps} />
          </ColorModeProvider>
        </ChakraProvider>
      </UseFormContextProvider>
    </ApolloProvider>
  );
}

export default MyApp;
