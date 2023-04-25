import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/userOperations";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { PostsScreen } from "./PostsScreen";
import { CreatePostsScreen } from "./CreatePostsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { StyleSheet, Text, View, Pressable } from "react-native";



const Tab = createBottomTabNavigator();


export const Home = ({ navigation }) => {
  const dispatch = useDispatch();

  const logOutHandler = () => {
    dispatch(logOut());
  };

  return (
    <Tab.Navigator
      style={{ paddingTop: 9, height: 83 }}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Публикации") {
            iconName = "view-grid-outline";
          } else if (route.name === "Создать публикацию") {
            iconName = "plus";
          } else if (route.name === "Профиль") {
            iconName = "account-outline";
          }

          return (
            <View
              style={{
                width: 70,
                height: 40,
                borderRadius: 20,
                backgroundColor: focused ? "#FF6C00" : "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name={iconName} color={color} size={24} />
            </View>
          );
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Публикации"
        component={PostsScreen}
        options={{
          headerRight: () => (
            <Pressable onPress={logOutHandler}>
              <MaterialCommunityIcons name="logout" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate("Публикации")}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="black"
              />
            </Pressable>
          ),
        }}
        name="Создать публикацию"
        component={CreatePostsScreen}
      />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  );
};