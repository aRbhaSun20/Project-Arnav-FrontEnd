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
