export const USER_ACTIONS = {
  LOGIN: "login",
  LOGOUT: "logout",
};

export const UserReducers = (
  InitialState = {
    _id: "",
    name: "",
    email: "",
    phone: "",
    token: "",
  },
  actions
) => {
  switch (actions.type) {
    case USER_ACTIONS.LOGIN:
      return { ...InitialState, ...actions.payload };

    default:
      return InitialState;
  }
};
