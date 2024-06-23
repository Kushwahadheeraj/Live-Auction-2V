// react context api
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: localStorage.getItem("payemntMethod")
      ? localStorage.getItem("paymentMethod")
      : "",
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
  auctionitem: {
    auctionShippingAddress: localStorage.getItem("auctionShippingAddress")
      ? JSON.parse(localStorage.getItem("auctionShippingAddress"))
      : {},
    auctionPaymentMethod: localStorage.getItem("auctionPayemntMethod")
      ? localStorage.getItem("auctionPaymentMethod")
      : "",
    auctioncartItems: localStorage.getItem("auctioncartItems")
      ? JSON.parse(localStorage.getItem("auctioncartItems"))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      // Creating local storage for added items
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    case "CART_REMOVE_ITEM": {
      // used {} so cartItems doesn't conflict cartItems from case 1
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      // Creating local storage removed items
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_CLEAR": {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }

    case "AUCTIONCART_ADD_ITEM": {
      const newauctionItem = action.payload;
      const existauctionItem = state.auctionitem.auctioncartItems.find(
        (auction) => auction._id === newauctionItem._id
      );
      const auctioncartItems = existauctionItem
        ? state.auctionitem.auctioncartItems.map((auction) =>
            auction._id === existauctionItem._id
              ? newauctionItem
              : auction
          )
        : [...state.auctionitem.auctioncartItems, newauctionItem];
      // Creating local storage for added items
      localStorage.setItem(
        "auctioncartItems",
        JSON.stringify(auctioncartItems)
      );
      return {
        ...state,
        auctionitem: { ...state.auctionitem, auctioncartItems },
      };
    }
    case "AUCTIONCART_REMOVE_ITEM": {
      // used {} so auctioncartItems doesn't conflict auctioncartItems from case 1
      const auctioncartItems = state.auctionitem.auctioncartItems.filter(
        (auction) => auction._id !== action.payload._id
      );
      // Creating local storage removed items
      localStorage.setItem(
        "auctioncartItems",
        JSON.stringify(auctioncartItems)
      );
      return {
        ...state,
        auctionitem: { ...state.auctionitem, auctioncartItems },
      };
    }

    case "AUCTIONCART_CLEAR": {
      return {
        ...state,
        auctionitem: { ...state.auctionitem, auctioncartItems: [] },
      };
    }

    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };

    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: "",
        },
        auctionitem: {
          auctioncartItems: [],
          auctionShippingAddress: {},
          auctionPaymentMethod: "",
        },
      };

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
        auctionitem: {
          ...state.auctionitem,
          auctionShippingAddress: action.payload,
        },
      };

    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
        auctionitem: { ...state.auctionitem, auctionPaymentMethod: action.payload },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
