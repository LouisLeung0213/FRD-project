// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD243djxwnLoP4tSfW0CUqOlE-3z0UQGL4",
  authDomain: "test-6e6e8.firebaseapp.com",
  projectId: "test-6e6e8",
  storageBucket: "test-6e6e8.appspot.com",
  messagingSenderId: "541343843596",
  appId: "1:541343843596:web:7f5af8f2e7113d68a53529",
  measurementId: "G-35MBSYNCVH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export let uploadFile = async (
  filename: string,
  file: File,
  typeObj: { contentType: string } | undefined,
  setPercent: React.Dispatch<React.SetStateAction<number>>,
  setImgUrl: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const storageRef = ref(storage, `/files/${filename}`);

  const uploadTask = uploadBytesResumable(storageRef, file, typeObj);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percent = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );

      setPercent(percent);
    },
    (err) => console.log(err),
    () => {
      // download url
      console.log(uploadTask.snapshot.ref);
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log(url);
        setImgUrl(url);
      });
    }
  );
};
