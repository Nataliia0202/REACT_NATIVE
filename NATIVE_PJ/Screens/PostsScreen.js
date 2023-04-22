
import React from "react";
import { Text, View, StyleSheet, Image, VirtualizedList } from "react-native";
import { useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { collection, query } from "firebase/firestore";
import { db } from "../firebase/config";
import {PostItem} from "../Components/PostComponent";
import { selectName, selectEmail } from "../redux/selectors";

export const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const name = useSelector(selectName);
  const email = useSelector(selectEmail);
  const isAuth = useSelector((state) => state.auth.isAuth);

  console.log("PostsScreen", isAuth);

  useEffect(() => {
    if (!isAuth) return;
    setAvatar(getAuth().currentUser.photoURL);

    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const post = [];
      querySnapshot.forEach((doc) =>
        post.push({
          ...doc.data(),
          id: doc.id,
        })
      );
      console.log(post, name);
      setPosts(post);
    });
    return () => {
      unsubscribe();
    };
  }, []);

   const getItemCount = () => posts.length;

   const getItem = (posts, index) => ({
     title: posts[index].imageSignature,
     photo: posts[index].photo,
     imageLocation: posts[index].imageLocation,
     uid: posts[index].uid,
     id: posts[index].id,
     location: posts[index].location,
   });


  return (
    <>
      <View style={styles.container}>
        {isAuth && (
          <>
            <View style={styles.avatar}>
              <Image style={styles.image} source={{ uri: avatar }} />
              <View style={styles.wraper}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
              </View>
            </View>
            <VirtualizedList
              data={posts}
              initialNumToRender={posts.length}
              renderItem={({ item }) => (
                <PostItem
                  navigation={navigation}
                  title={item.title}
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
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "scroll",
  },

  avatar: {
    marginTop: 16,
    padding: 16,
    flexDirection: "row",
    backgroundColor: "#fff",
    overflow: "scroll",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  wraper: {
    marginLeft: 8,
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 13,
    lineHeight: 15,
  },
  email: {
    fontWeight: "normal",
    fontSize: 11,
    lineHeight: 13,
  },
});