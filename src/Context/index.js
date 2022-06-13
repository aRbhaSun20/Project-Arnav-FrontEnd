import { combineReducers } from "redux";
import { NavigationReducers } from "./NavigationReducers";
import { LocationReducers } from "./LocationReducers";
import { UserReducers } from "./UserReducers";

const allReducers = combineReducers({
  user: UserReducers,
  navigation: NavigationReducers,
  location: LocationReducers,
});

export default allReducers;
