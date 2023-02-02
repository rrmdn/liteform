import { createContext } from "react-immersive";

const UserContext = createContext({ user: null as firebase.default.User | null }, (modify) => ({
  setUser: (user: firebase.default.User | null) => modify((state) => ({ ...state, user })),
}));

export default UserContext;
