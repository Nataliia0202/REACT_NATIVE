import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const PostItem = ({
  navigation,
  photo,
  title,
  description,
  imageLocation,
  id,
  uid,
  location,
}) => {
  const [like, setLike] = useState(0);
  const [comment, setComment] = useState(0);

  const getLikeAndComment = async () => {
    const likeRef = doc(db, "posts", id);
    const docSnap = await getDoc(likeRef);
    setComment(docSnap.data().comment);
    setLike(docSnap.data().like);
  };

  const incrementLike = async () => {
    const likeRef = doc(db, "posts", id);
    await updateDoc(likeRef, { like: increment(1) });
  };

  const pressComment = () => {
    console.log("pressComment");
    navigation.navigate("Комментарии", { photo, id, uid });
  };

  const pressLike = () => {
    setLike(like + 1);
    incrementLike();
  };

  const pressMapMarker = async () => {
    console.log("fdret", location);
    navigation.navigate("Map", { location });
  };

  getLikeAndComment();

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: photo }} />
      <Text style={styles.signature}>{title}</Text>
      <View style={styles.signatureBox}>
        <TouchableOpacity onPress={pressComment} style={styles.viewBox}>
          <MaterialCommunityIcons name="comment" color="#ff6c00" size={24} />
          <Text style={styles.view}>{comment}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pressLike} style={styles.likeBox}>
          <MaterialCommunityIcons
            name="thumb-up-outline"
            color="#ff6c00"
            size={24}
          />
          <Text style={styles.like}>{like}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pressMapMarker} style={styles.localBox}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            color="#aaa"
            size={24}
          />
          <Text style={styles.local}>{imageLocation}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.description}>
        <Text style={styles.signatureDis}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },

  image: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "90%",
    height: 240,
    borderRadius: 15,
  },
  signature: {
    marginTop: 10,
    marginLeft: 35,
  },
  signatureDis: {
    marginTop: 10,
    marginLeft: 35,
  },
  description: {
    
  },

  signatureBox: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  viewBox: {
    alignItems: "center",
    marginLeft: 20,
    flexDirection: "row",
  },
  view: {
    marginLeft: 10,
  },
  likeBox: {
    alignItems: "center",
    marginLeft: 20,
    flexDirection: "row",
  },
  like: {
    marginLeft: 10,
  },
  localBox: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: 16,
  },
  local: {
    marginLeft: 7,
  },
});