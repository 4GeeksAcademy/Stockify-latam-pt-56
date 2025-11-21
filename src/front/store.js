export const initialStore = () => {
  const token = localStorage.getItem("jwtToken");
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return {
    token: token,
    userData: userData,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_token":
      localStorage.setItem("jwtToken", action.payload);
      return {
        ...store,
        token: action.payload,
      };
    case "set_user_data":
      localStorage.setItem("userData", JSON.stringify(action.payload));
      return {
        ...store,
        userData: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    default:
      console.log(action.type);
      throw Error("Unknown action.");
  }
}
