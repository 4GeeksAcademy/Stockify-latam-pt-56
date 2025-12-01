export const initialStore = () => {
  const token = sessionStorage.getItem("jwtToken");
  const userDataString = sessionStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return {
    token: token,
    userData: userData,
    categories: [],
    products: [],
    cart: [],
    totalInventoryValue: 0,
    users: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_token":
      sessionStorage.setItem("jwtToken", action.payload);
      return {
        ...store,
        token: action.payload,
      };
    case "set_user_data":
      sessionStorage.setItem("userData", JSON.stringify(action.payload));
      return {
        ...store,
        userData: action.payload,
      };

    case "set_categories":
      return {
        ...store,
        categories: action.payload,
      };

    case "set_products":
      return {
        ...store,
        products: action.payload,
      };

    case "ADD_PRODUCT_TO_CART":
      // El 'payload' es el nuevo producto: action.payload = {id: 5, product_name: 'Tornillo', ...}

      // 1. Crear el nuevo ítem de carrito con cantidad 1
      const newItem = {
        product: action.payload,
        quantity: 1,
      };

      // 2. BUSCAR si el producto ya existe en el carrito
      const existingItem = store.cart.find(
        (item) => item.product.id === action.payload.id
      );

      if (existingItem) {
        // 3. Si el producto EXISTE: Incrementar la cantidad de ese ítem
        const updatedCart = store.cart.map((item) => {
          if (item.product.id === action.payload.id) {
            // Creamos una nueva copia del item con la cantidad actualizada
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item; // Devolvemos los otros items sin cambios
        });

        // Devolver el nuevo estado con el array 'cart' actualizado
        return {
          ...store,
          cart: updatedCart,
        };
      } else {
        // 4. Si el producto NO EXISTE: AGREGAR el nuevo ítem al final del array
        return {
          ...store, // Copiar todo el estado global
          cart: [...store.cart, newItem], // Copiar el array 'cart' existente y AÑADIR el nuevo item
        };
      }
    // return {
    //   ...store,
    //   cart: action.payload,
    // };

    case "INCREMENT_CART_ITEM":
      const incrementedCart = store.cart.map((item) => {
        if (item.product.id === action.payload) {
          return {
            ...item, // Copiar propiedades del item (product, etc.)
            quantity: item.quantity + 1, // Aumentar cantidad
          };
        }
        return item;
      });

      return {
        ...store,
        cart: incrementedCart,
      };

    case "DECREMENT_CART_ITEM":
      const itemToDecrement = store.cart.find(
        (item) => item.product.id === action.payload
      );

      if (itemToDecrement && itemToDecrement.quantity > 1) {
        // Reducir la cantidad
        const decrementedCart = store.cart.map((item) => {
          if (item.product.id === action.payload) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
        return { ...store, cart: decrementedCart };
      } else if (itemToDecrement && itemToDecrement.quantity === 1) {
        // Eliminar el producto del carrito (filtrar)
        const filteredCart = store.cart.filter(
          (item) => item.product.id !== action.payload
        );
        return { ...store, cart: filteredCart };
      }
      return store;

    case "CLEAR_CART":
      // 1. Devolver una copia del estado (...state).
      // 2. Sobrescribir la propiedad 'cart' con un array vacío.
      return {
        ...store,
        cart: [],
      };

    case "SET_CATALOG_PRODUCTS":
      // Este caso será usado específicamente para la lista filtrada del catálogo.
      // Simplemente sobrescribe el array 'products' con el resultado de la búsqueda.
      return {
        ...store,
        products: action.payload,
      };

    case "LOGOUT":
      sessionStorage.removeItem("jwtToken");
      sessionStorage.removeItem("userData");

      return {
        ...store,
        token: null,
        userData: null,
        cart: [],
      };

    case "SET_TOTAL_INVENTARY_VALUE":
      return {
        ...store,
        totalInventoryValue: action.payload,
      };

    case "SET_USERS":
      return { ...store, users: action.payload };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    default:
      throw Error("Unknown action.");
  }
}
