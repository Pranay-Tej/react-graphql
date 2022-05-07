import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { createClient, Provider } from "urql";
import App from "./App";
import { API_URL } from "./constants/global.constants";
import "./index.css";

const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

const urqlClient = createClient({
  url: API_URL,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider value={urqlClient}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
