import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet } from "react-native";
import { Login } from "./Screens/LoginScreen";
import { RegistrationScreen } from "./Screens/RegistrationScreen";
import { Home } from "./Screens/Home";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { refreshUser } from "./redux/sliceAuth";
import { CommentsScreen } from "./Screens/CommentsScreen";
import { Map } from "./Screens/MapScreen";
import { PostsScreen } from "./Screens/PostsScreen";


const AuthStack = createStackNavigator();

export const Rout = () => {
    const dispatch = useDispatch();
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            console.log(user);
            if (user) {
                const { displayName, email, uid, accessToken } = user;
                dispatch(
                    refreshUser({
                        name: displayName,
                        email: email,
                        id: uid,
                        token: accessToken,
                    })
                );
            } else {
                console.log('User is signed out')
            }
        })
    }, []);

    const isAuth = useSelector(state => state.auth.isAuth);
    console.log(isAuth);
    if (isAuth === false) {
        return (
          <AuthStack.Navigator
            initialRouteName="Register"
            style={styles.navBox}
          >
            <AuthStack.Screen
              name="Register"
              options={{ headerShown: false }}
              component={RegistrationScreen}
            />
            <AuthStack.Screen
              name="Login"
              options={{ headerShown: false }}
              component={Login}
            />
          </AuthStack.Navigator>
        );
    } else {
        return (
          <AuthStack.Navigator initialRouteName="home" style={styles.navBox}>
            <AuthStack.Screen
              name="home"
              component={Home}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen name="Map" component={Map} />
            <AuthStack.Screen
              name="CommentsScreen"
              component={CommentsScreen}
            />
            <AuthStack.Screen name="PostsScreen" component={PostsScreen} />
          </AuthStack.Navigator>
        );
    }

};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  navBox: {
    padding: 16,

    borderColor: "red",
  },
});