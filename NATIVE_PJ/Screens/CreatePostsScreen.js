import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { storage, db } from "../firebase/config";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectID, selectName } from "../redux/selectors";

import * as ImagePicker from "expo-image-picker";


export const CreatePostsScreen = ({ navigation }) => {
  const [imageSignature, setImageSignature] = useState("");
  const [description, setDescription] = useState("");
const [imageLocation, setImageLocation] = useState("");
const [hasPermission, setHasPermission] = useState(null);
const [cameraRef, setCameraRef] = useState(null);
const [type, setType] = useState(Camera.Constants.Type.back);
const [photo, setPhoto] = useState(null);
const [location, setLocation] = useState({
  latitude: 50.34855795212235,
  longitude: 30.420385218904713,
  latitudeDelta: 0.01,
  longitudeDelta: 0.06,
});
const [errorMsg, setErrorMsg] = useState(null);
const uid = useSelector(selectID);
const name = useSelector(selectName);
 
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLocation({
          coords: {
            latitude: 50.34855795212235,
            longitude: 30.420385218904713,
          },
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  


  const uploadPhotoToStorage = async (photo) => {
    try {
      const response = await fetch(photo);
      const file = await response.blob();
      const imageId = v4();

      const storageRef = ref(storage, `postImage/${imageId}`);
      await uploadBytes(storageRef, file);
      const storageUrlPhoto = await getDownloadURL(
        ref(storage, `postImage/${imageId}`)
      );
      console.log(storageUrlPhoto);
      return storageUrlPhoto;
    } catch (error) {
      Alert.alert("Try again \n", error.message);
    }
  };


  const uploadPostToStorage = async () => {
    
    try {
      const valueObj = {
        name,
        uid,
        imageSignature,
        description,
        imageLocation,
        photo,
        commentCounter: 0,
      };
      console.log(valueObj);
      if (location) valueObj.location = location.coords;
      const docRef = await addDoc(collection(db, "posts"), valueObj);
      console.log(docRef);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const imageTitleHandler = (text) => {
  setImageSignature(text);
  };

  const imageDescription = (text) => {
    setDescription(text);
  }
  
  const imageLocationHandler = (text) => {
    setImageLocation(text);
  };

  const imageDownloaderHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPhoto(await uploadPhotoToStorage(result.assets[0].uri));
      console.log(setPhoto(await uploadPhotoToStorage(result.assets[0].uri)));
    }
    console.log("upload");
  };
  const onSubmit = async () => {
    await uploadPostToStorage();
    setImageSignature("");
    setDescription("");
    setImageLocation("");
    setPhoto(null);
    
    navigation.navigate("Публикации");
  };

  const onSubmitClear = () => {
    setDescription("")
    setImageSignature("");
    setImageLocation("");
    setPhoto(null);
    
  };

  const imageClearHandler = () => {
    setPhoto(null);
    setCameraRef(null);
  }

  const flipCamera = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
     
      setPhoto(photo.uri);
      console.log("photo", photo);
    }
  };
 const pressMapMarker = async () => {
   console.log("fdret", location);
   navigation.navigate("Map", { location });
 };

console.log("CreatePostsScreen");


  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView styles={styles.box} backGroundColor="#fff">
          <View style={styles.container}>
            <View style={styles.cameraWr}>
              {photo === null ? (
                <Camera
                  style={styles.camera}
                  type={type}
                  ref={(ref) => {
                    setCameraRef(ref);
                  }}
                >
                  <TouchableOpacity
                    style={styles.flipContainer}
                    onPress={flipCamera}
                  >
                    <MaterialCommunityIcons
                      name="camera-front-variant"
                      size={24}
                      style={{ color: "white" }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shootButton}
                    onPress={takePhoto}
                  >
                    <View style={styles.takePhotoOut}>
                      <View style={styles.takePhotoInner}>
                        <MaterialCommunityIcons
                          name="camera-outline"
                          size={24}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Camera>
              ) : (
                <View style={styles.containerIMG}>
                  <Image
                    style={styles.photo}
                    source={{
                      uri: photo,
                    }}
                  />
                </View>
              )}
            </View>

            {photo === null ? (
              <TouchableOpacity onPress={imageDownloaderHandler}>
                <MaterialCommunityIcons
                  name="plus-box-multiple"
                  size={24}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={imageClearHandler}>
                <MaterialCommunityIcons
                  name="image-remove"
                  size={24}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            )}

            <View>
              <TextInput
                value={imageSignature}
                onChangeText={imageTitleHandler}
                placeholder="Название..."
                style={styles.input}
              />
            </View>
            <View>
              <TextInput
                value={description}
                onChangeText={imageDescription}
                placeholder="Добавить описание..."
                style={styles.input}
              />
            </View>
            <View position="relative">
              <Pressable style={styles.mapButton} onPress={pressMapMarker}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={24}
                  color="#BDBDBD"
                />
              </Pressable>

              <TextInput
                value={imageLocation}
                onChangeText={imageLocationHandler}
                placeholder="Местность..."
                style={styles.input}
              ></TextInput>
            </View>
            <TouchableOpacity onPress={onSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Опубликовать</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmitClear}
              style={{
                flex: 1,
                width: 70,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 150,
              }}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                color="#BDBDBD"
                size={24}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backGroundColor: "#fff",
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent:'center',
  },
  camera: {
    height: 250,
  },
  cameraWr: {
    justifyContent: "center",
    width: 350,
    height: 300,

    borderRadius: 8,
    marginLeft: "auto",
    marginRight: "auto",
  },
  photoView: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },

  flipContainer: {
    flex: 0.1,
    alignSelf: "flex-end",
    marginRight: 10,
    marginTop: 10,
  },

  shootButton: {
    alignSelf: "center",
    top: 150,
  },

  takePhotoOut: {
    borderWidth: 2,
    borderColor: "#ffffff67",
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },

  takePhotoInner: {
    borderWidth: 2,
    borderColor: "#ccc",
    height: 40,
    width: 40,
    backgroundColor: "#ffffff80",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  // image: {
  //   marginLeft: "auto",
  //   marginRight: "auto",
  //   width: 343,
  //   height: 240,
  // },

  text: {
    marginTop: 10,
    color: "#BDBDBD",
  },

  input: {
    paddingLeft: 50,
    height: 44,
    padding: 10,
    backgroundColor: "#EEEEEE",
    marginTop: 16,

    borderBottomColor: "#BDBDBD",
    borderBottomWidth: 1,
  },
  mapButton: {
    position: "absolute",
    top: 26,
    left: 15,
    zIndex: 2,
  },
  button: {
    backgroundColor: "#FF6C00",
    borderRadius: 32,
    padding: 16,
    marginVertical: 16,
    marginTop: 43,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  containerIMG: {
    justifyContent: "center",
    width: 350,
    height: 350,
    marginStart: 10,
    borderRadius: 8,
    marginLeft: "auto",
    marginRight: "auto",
  },
  photo: {
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    width: 343,
    height: 250,
    borderRadius: 5,
    
  },
});
