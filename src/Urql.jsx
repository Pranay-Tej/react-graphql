import { useQuery } from "urql";

function Urql() {
  const [result, reexecuteQuery] = useQuery({
    query: `
      query {
        allPosts {
          id
          title
        }
      }
    `,
  });

  const { data } = result;

  const [lazyResult, lazyReexecuteQuery] = useQuery({
    query: `
      query {
        allPosts(perPage: 1, page: 0) {
          id
          title
        }
      }
    `,
    pause: true,
  });

  const { data: lazyData, fetching, error } = lazyResult;

  return (
    <>
      <h1>Urql</h1>
      {JSON.stringify(data)}

      <p>Lazy</p>
      <button
        onClick={() => {
          lazyReexecuteQuery();
        }}
      >
        Lazy
      </button>
      <p>{JSON.stringify(lazyData)}</p>
    </>
  );
}

export default Urql;
