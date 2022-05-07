import { gql, useLazyQuery, useQuery } from "@apollo/client";

const GET_DATA = gql`
  query {
    allPosts {
      id
      title
    }
  }
`;

function Apollo() {
  const { loading, error, data } = useQuery(
    // GET_DATA
    gql`
      query {
        allPosts {
          id
          title
        }
      }
    `
  );

  const [fetchData, { called, isLoading, data: lazyData }] = useLazyQuery(
    gql`
      query {
        allPosts(perPage: 1, page: 0) {
          id
          title
        }
      }
    `
    // {
    //   fetchPolicy: "no-cache",
    // }
  );

  return (
    <>
      <h1>Apollo Client</h1>
      {JSON.stringify(data)}

      <p>Lazy</p>
      <button
        onClick={() => {
          console.log(typeof fetchData);
          fetchData();
        }}
      >
        Lazy
      </button>
      <p>{JSON.stringify(lazyData)}</p>
    </>
  );
}

export default Apollo;
