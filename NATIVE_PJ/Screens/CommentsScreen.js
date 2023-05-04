import React, {useState, useEffect} from "react";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Comment from "../Components/Comment";
import { db } from "../firebase/config";
import date from "date-and-time";
import uk from "date-and-time/locale/uk";

export const CommentsScreen = ({ route }) => {
  const currentUid = getAuth().currentUser.uid;
  const { photo, id, uid } = route.params;
  const avatar = getAuth().currentUser.photoURL;
  console.log(avatar);
  const [text, setText] = useState("");
  const [comments, setComments] = useState(null);
  const [commentsCounter, setCommentsCounter] = useState(0);

  date.locale(uk);

  const createPost = async (avatar, text, id) => {
    if (text === "") return;
    try {
      const time = date.format(new Date(), "D MMMM YYYY | HH:mm");
      console.log({ avatar, text, time, id });
      const commentDocRef = await addDoc(
        collection(db, "posts", id, "comments"),
        { avatar, text, time, uid: currentUid }
      );
      console.log(commentDocRef);
    } catch (error) {
      console.log(error.message);
    }
    setText("");
  };
 
  const getAllComments = async () => {
    const q = query(collection(db, "posts", id, "comments"));
    const commentRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const post = [];
      querySnapshot.forEach((doc) =>
        post.push({
          ...doc.data(),
          id: doc.id,
        })
      );
      updateDoc(commentRef, { comment: post.length });
      console.log(post.length);
      setComments(post);
    });

    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    getAllComments();
  }, []);
const onChange = (text) => {
  setText(text);
};
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: photo }} />

      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <Comment
            avatar={item.avatar}
            text={item.text}
            time={item.time}
            postUid={uid}
            commentUid={item.uid}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.inputWrap}>
        <TextInput onChangeText={onChange} style={styles.input} value={text} />
        <TouchableOpacity onPress={createPost} style={styles.button}>
          <MaterialCommunityIcons
            name="arrow-up-circle"
            size={36}
            color="#FF6C00"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  image: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "90%",
    height: "40%",
    borderRadius: 15,
  },

  inputWrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  input: {
    width: "90%",
    height: 44,
    padding: 10,
    paddingRight: 50,
    backgroundColor: "#E8E8E8",
    bottom: 0,
    borderRadius: 22,
  },
  button: {
    position: "absolute",
    right: 20,
    top: "7%",
  },
});
