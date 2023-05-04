import React, {useState, useEffect} from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  VirtualizedList,
} from "react-native";
const imageBg = require("../assets/images/PhotoBG.jpg");
import SVGImg from "../assets/images/add.svg";
import SVGDel from "../assets/images/del.svg";
import * as ImagePicker from "expo-image-picker";
import {
  
  logOut,
  
} from "../redux/userOperations";
import { selectName, selectID } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../firebase/config";
import PostItem from "../Components/PostComponent";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const ProfileScreen = ({ navigation }) => {

  const [avatar, setAvatar] = useState(null);
  const auth = getAuth();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const id = useSelector(selectID);
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState();
  
// const [dimensions, setdimensions] = useState(Dimensions.get("window").width);

// useEffect(() => {
//   const onChange = () => {
//     const width = Dimensions.get("window").width;

//     setdimensions(width);
//   };
//   Dimensions.addEventListener("change", onChange);
//   return () => {
//     Dimensions.removeEventListener("change", onChange);
//   };
// }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      
      dispatch(setAvatar(uri));
    }
  };
  const logOutHandler = () => {
    dispatch(logOut());
  };

  const onSubmit = () => {
    setAvatar(null);
  };
  const getItemCount = () => posts.length;
  
  const getItem = (posts, index) => ({
    title: posts[index].imageSignature,
    photo: posts[index].photo,
    imageLocation: posts[index].imageLocation,
    uid: posts[index].uid,
    id: posts[index].id,
    location: posts[index].location,
  });

  
  useEffect(() => {
    if (!isAuth) return;

    setAvatar(auth.currentUser.photoURL);
    const q = query(collection(db, "posts"), where("uid", "==", id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const post = [];
      querySnapshot.forEach((doc) =>
        post.push({
          ...doc.data(),
          id: doc.id,
        })
      );
      setPosts(post);
    });
    return () => {
      unsubscribe();
    };
  }, []);



  return (
    <>
      <ImageBackground source={imageBg} resizeMode="cover" style={styles.image}>
        <View style={{ ...styles.form }}>
          <View style={styles.containerIMG}>
            <Image
              style={styles.avatar}
              source={{
                uri: avatar,
              }}
            />
            {avatar === null ? (
              <TouchableOpacity style={styles.svg} onPress={pickImage}>
                <SVGImg width={25} height={25} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.svgDel} onPress={onSubmit}>
                <SVGDel width={40} height={40} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={logOutHandler} style={styles.logoutIcon}>
            <MaterialCommunityIcons name="logout" size={26} color="#aaa" />
          </TouchableOpacity>
          <Text style={styles.name}>{name}</Text>
          <VirtualizedList
            data={posts}
            initialNumToRender={posts.length}
            renderItem={({ item }) => (
              <PostItem
                navigation={navigation}
                title={item.imageSignature}
                photo={item.photo}
                imageLocation={item.imageLocation}
                uid={item.uid}
                id={item.id}
                location={item.location}
              />
            )}
            keyExtractor={(item) => item.id}
            getItemCount={getItemCount}
            getItem={getItem}
          />
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  form: {
    justifyContent: "flex-end",
    position: "relative",
    // marginHorizontal: 16,
    alignItems: "stretch",
    padding: 16,
    backgroundColor: "#FFFFFF",
    height: 520,
    paddingBottom: 25,
    marginTop: 92,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingTop: 105,
  },
  containerIMG: {
    position: "absolute",
    width: 120,
    height: 120,
    paddingTop: 30,
    borderRadius: 16,
    top: -60,
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
  },
  avatar: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  svg: {
    position: "absolute",
    bottom: 14,
    right: -12,
  },
  svgDel: {
    position: "absolute",
    bottom: 10,
    right: -20,
  },
  logoutIcon: {
    position: "absolute",
    top: 20,
    right: 15,
  },
  name: {
    marginTop: 92,
    marginBottom: 32,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});