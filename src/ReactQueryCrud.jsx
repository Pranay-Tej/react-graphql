import { gql, request } from "graphql-request";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_URL } from "./constants/global.constants";

const GET_TODOS = gql`
  query {
    allTodos {
      id
      title
    }
  }
`;

const GET_TODO_BY_ID = gql`
  query ($id: ID!) {
    Todo(id: $id) {
      id
      title
    }
  }
`;

const CREATE_TODO = gql`
  mutation ($title: String!) {
    createTodo(title: $title) {
      id
      title
    }
  }
`;

const UPDATE_TODO = gql`
  mutation ($id: ID!, $title: String) {
    updateTodo(id: $id, title: $title) {
      id
      title
    }
  }
`;

const REMOVE_TODO = gql`
  mutation ($id: ID!) {
    removeTodo(id: $id) {
      id
      title
    }
  }
`;

const ReactQueryCrud = () => {
  const [title, setTitle] = useState("");
  const [id, setId] = useState();

  const queryClient = useQueryClient();

  const {
    data: todoList,
    refetch: fetchTodoList,
    isLoading,
    isFetching,
    error,
  } = useQuery("fetchTodoList", async () => {
    const { allTodos } = await request(API_URL, GET_TODOS);
    return allTodos;
  });

  //   const {
  //     data: todo,
  //     refetch: fetchTodo,
  //     isLoading: isLoadingTodo,
  //     error: errorTodo,
  //   } = useQuery(
  //     "fetchTodo",
  //     (todoId) => async () => {
  //       console.log(todoId);
  //       const { Todo } = await request(API_URL, GET_TODO_BY_ID, {
  //         id: todoId,
  //       });
  //       setId(Todo.id);
  //       setTitle(Todo.title);
  //       return Todo;
  //     },
  //     {
  //       enabled: false,
  //     }
  //   );

  const {
    data: todo,
    refetch: fetchTodo,
    isLoading: isLoadingTodo,
    error: errorTodo,
  } = useQuery(
    ["fetchTodo", id],
    async () => {
      const { Todo } = await request(API_URL, GET_TODO_BY_ID, {
        id,
      });
      setTitle(Todo.title);
      return Todo;
    },
    {
      enabled: id !== undefined,
    }
  );

  const createTodo = useMutation(
    "createTodo",
    async (title) => {
      const { createTodo } = await request(API_URL, CREATE_TODO, {
        title,
      });
      return createTodo;
    },
    {
      enabled: false,
      onSuccess: () => {
        queryClient.invalidateQueries("fetchTodoList");
        resetForm();
      },
    }
  );

  const updateTodo = useMutation(
    "updateTodo",
    async ({ id, title }) => {
      const { updateTodo } = await request(API_URL, UPDATE_TODO, {
        id,
        title,
      });
      return updateTodo;
    },
    {
      enabled: false,
      onSuccess: () => {
        queryClient.invalidateQueries("fetchTodoList");
        resetForm();
      },
    }
  );

  const removeTodo = useMutation(
    "removeTodo",
    async (id) => {
      const { removeTodo } = await request(API_URL, REMOVE_TODO, {
        id,
      });
      return removeTodo;
    },
    {
      enabled: false,
      onSuccess: () => {
        queryClient.invalidateQueries("fetchTodoList");
        resetForm();
      },
    }
  );

  const resetForm = () => {
    setTitle("");
    setId(undefined);
  };

  return (
    <>
      <h1>React Query CRUD</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            updateTodo.mutate({ id, title });
          } else {
            createTodo.mutate(title);
          }
        }}
      >
        <label htmlFor="title" id="todo">
          Todo
        </label>
        <input
          required
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          disabled={
            isLoadingTodo || createTodo.isLoading || updateTodo.isLoading
          }
        />
        <button
          disabled={
            isLoadingTodo || createTodo.isLoading || updateTodo.isLoading
          }
        >
          {id ? "Update" : "Create"}
        </button>

        {todo?.id && (
          <button
            type="button"
            onClick={() => {
              resetForm();
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {isFetching && <p>Loading...</p>}

      <ul>
        {!isFetching &&
          !error &&
          todoList &&
          todoList.map((todo) => {
            return (
              <li key={todo.id}>
                <p>{todo.title}</p>
                <button
                  onClick={() => {
                    //   fetchTodo(todo.id);
                    setId(todo.id);
                    //   fetchTodo();
                  }}
                >
                  🖋️ Edit
                </button>
                <button
                  onClick={() => {
                    removeTodo.mutate(todo.id);
                  }}
                >
                  🗑️ Delete
                </button>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default ReactQueryCrud;
