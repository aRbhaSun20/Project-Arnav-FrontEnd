export const LOCATION_ACTIONS = {
  ADD_LOCATION: "add_location",
  Default_location: "default_location",
};

export const LocationReducers = (InitialState = getDAta(), actions) => {
  switch (actions.type) {
    case LOCATION_ACTIONS.ADD_LOCATION:
      const data = { ...InitialState, ...actions.payload };
      localStorage.setItem("arnavLocation", JSON.stringify(data));
      return data;
    case LOCATION_ACTIONS.Default_location:
      localStorage.removeItem("arnavLocation");
      return {
        parentId: "",
        fromId: "",
        toId: "",
      };
    default:
      return InitialState;
  }
};

const getDAta = () => {
  const data = localStorage.getItem("arnavLocation");
  if (data) {
    const returnData = JSON.parse(data);
    if (returnData) return returnData;
  }
  return {
    parentId: "",
    fromId: "",
    toId: "",
  };
};
