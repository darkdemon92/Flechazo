import "./index.css";
//Fuentes para MaterialUI
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { render } from "preact";
import { App } from "./app.jsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
const httpLink = createUploadLink({
  //uri: "https://backend1.darkprojects.tk/graphql",
  uri: `${import.meta.env.VITE_BASE_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const userData = JSON.parse(sessionStorage.getItem("UserData"));
  const token = userData.state.token;
  //console.log(JSON.parse(token));
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      ProfileEntity: {
        fields: {
          attributes: {
            merge(existing, incoming) {
              //return { ...existing, ...incoming };
              return incoming;
            },
          },
        },
      },
    },
  }),
  connectToDevTools: true,
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("app")
);
