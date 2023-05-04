import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export const Comment = ({ avatar, text, time, postUid, commentUid }) => {
  console.log(postUid, commentUid);
  return postUid === commentUid ? (
    <View style={styles.comment}>
      <View style={styles.myWrap}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.time}>{time} </Text>
      </View>
      <Image style={styles.myAvatar} source={{ uri: avatar }} />
    </View>
  ) : (
    <View style={styles.comment}>
      <Image style={styles.avatar} source={{ uri: avatar }} />
      <View style={styles.wrap}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.time}>{time} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    flex: 1,
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "center",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 16,
  },
  myAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 16,
  },
  wrap: {
    width: 300,
    flexWrap: "wrap",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    padding: 16,
  },
  myWrap: {
    width: 300,
    flexWrap: "wrap",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 10,
    borderTopRightRadius: 0,
    padding: 16,
  },

  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18,
    width: 250,
    marginLeft: 20,
  },
  time: {
    width: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 8,
  },
});
