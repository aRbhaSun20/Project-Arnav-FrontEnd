import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAuMrvLDKGS-HbTMEgHd2xHSb-wlwLjzik",
  authDomain: "beaming-gadget-351716.firebaseapp.com",
  projectId: "beaming-gadget-351716",
  storageBucket: "beaming-gadget-351716.appspot.com",
  messagingSenderId: "754962440375",
  appId: "1:754962440375:web:669a0acc316cb9f67bad32",
  measurementId: "G-F0PKQTZJ8T",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);

export const uploadFIles = async (source, callback, extra) => {
  try {
    const fileName = `${source.name}.${getType(source.type)}`;
    const imageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(imageRef, source);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        console.log(progress)
      },
      (error) => {
        console.log(error.message);
      },
      () =>
        getDownloadURL(uploadTask.snapshot.ref).then((url) =>
          callback(url, fileName, extra)
        )
    );
  } catch (e) {
    console.error(e, "error");
  }
};

const getType = (data) => {
  const types = data.split("/").reverse();
  return types[0];
};
