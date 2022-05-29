import "./App.css";
import Router from "./Pages/Router";
import { SnackbarProvider } from "notistack";
import { ServerStateProvider } from "./Context/ServerState";
import { useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

function App() {
  useEffect(() => {
    if (navigator.appVersion.includes("Windows")) {
      document.querySelector("html").style.fontSize = ".8rem";
    }
  }, []);

  return (
    <div className="App">
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <ServerStateProvider>
          <Router />
        </ServerStateProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;

const firebaseConfig = {
  apiKey: "AIzaSyAuMrvLDKGS-HbTMEgHd2xHSb-wlwLjzik",
  authDomain: "beaming-gadget-351716.firebaseapp.com",
  projectId: "beaming-gadget-351716",
  storageBucket: "beaming-gadget-351716.appspot.com",
  messagingSenderId: "754962440375",
  appId: "1:754962440375:web:669a0acc316cb9f67bad32",
  measurementId: "G-F0PKQTZJ8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
