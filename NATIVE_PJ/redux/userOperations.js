import { Alert } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/config";




export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    console.log(credentials);
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      Alert.alert("Done! You have successfully created an account!");
      await updateProfile(auth.currentUser, {
        displayName: credentials.login,
        photoURL: credentials.avatar,
      });
      const updateUser = auth.currentUser;
      console.log(
        updateUser,
        updateUser.displayName,
        updateUser.email,
        updateUser.uid
      );
      return {
        name: updateUser.displayName,
        email: updateUser.email,
        id: updateUser.uid,
        token: updateUser.accessToken,
        avatar: updateUser.photoURL,
      };
    } catch (error) {
      if (`${error}`.includes("auth/email-already-in-use")) {
        Alert.alert("Oops, something went wrong, please try again");
      }
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const uploadPhotoToStorage = async (uri) => {
    
  const response = await fetch(uri);
  const file = await response.blob();
  const imageId = uuid.v4();

  const storageRef = ref(storage, `avatar/${imageId}`);
  await uploadBytes(storageRef, file)
  const storageUrlPhoto = await getDownloadURL(
    ref(storage, `avatar/${imageId}`)
  );
  console.log(storageUrlPhoto);
  return storageUrlPhoto;
};

export const DeletUploadPhotoToStorage = async () => {
    
}

export const setAvatar = createAsyncThunk(
  "auth/setAvatar",
  async (uri, { rejectWithValue }) => {
    const auth = getAuth();
    try {
      const avatar = await uploadPhotoToStorage(uri);
      await updateProfile(auth.currentUser, { photoURL: avatar });
      const updateUser = auth.currentUser;
      return {
        name: updateUser.displayName,
        email: updateUser.email,
        id: updateUser.uid,
        token: updateUser.accessToken,
        avatar: updateUser.photoURL,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/logIn",
  async (credentials, { rejectWithValue }) => {
    console.log(credentials);
    const auth = getAuth();
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      Alert.alert("Hello! Nice to meet you again!");
      return {
        name: user.displayName,
        email: user.email,
        id: user.uid,
        token: user.accessToken,
        avatar: user.photoURL,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);