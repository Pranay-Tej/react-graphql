import { gql, request } from "graphql-request";
import { useQuery } from "react-query";
import { API_URL } from "./constants/global.constants";

const GET_DATA = gql`
  query {
    allPosts {
      id
      title
    }
  }
`;

function ReactQuery() {
  const { data } = useQuery("data", async () => {
    const res = await request(
      API_URL,
      gql`
        query {
          allPosts {
            id
            title
          }
        }
      `
    );
    return res;
  });

  const { data: lazyData, refetch } = useQuery(
    "lazyData",
    async () => {
      const res = await request(
        API_URL,
        gql`
          query {
            allPosts(perPage: 1, page: 0) {
              id
              title
            }
          }
        `
      );
      return res;
    },
    {
      enabled: false,
    }
  );

  return (
    <>
      <h1>React Query</h1>
      {JSON.stringify(data)}

      <p>Lazy</p>
      <button
        onClick={() => {
          refetch();
        }}
      >
        Lazy
      </button>
      <p>{JSON.stringify(lazyData)}</p>
    </>
  );
}

export default ReactQuery;
