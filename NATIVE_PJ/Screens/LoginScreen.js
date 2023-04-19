import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Platform,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { logIn } from "../redux/userOperations";
const imageBg = require("../assets/images/PhotoBG.jpg");

export const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isShowkeyboard, setIsShowkeyboard] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setIsShowkeyboard(true);
    setIsFocused(!isFocused);
  }, [isFocused]);
  const emailHandler = (text) => setEmail(text);
  const passwordHandler = (text) => setPassword(text);

  const onLogin = () => {
    if (email === "" || password === "") {
      return Alert.alert("Заполните все поля");
    }
    dispatch(logIn({ email, password }));
    console.log({ email, password });
  };

  // const onTransition = () => {
  //   navigation.navigate("Регистрация");
  // };

  const [dimensions, setdimensions] = useState(Dimensions.get("window").width);
  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;

      setdimensions(width);
    };
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  const showPassword = () => {
    if (passwordShown === true) {
      setPasswordShown(false);
    }
    if (passwordShown === false) {
      setPasswordShown(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={imageBg} resizeMode="cover" style={styles.image}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{ ...styles.form, width: dimensions }}>
              <Text style={styles.text}>Войти</Text>

              <View>
                <TextInput
                  value={email}
                  onChangeText={emailHandler}
                  style={{
                    ...styles.input,
                    borderColor: isFocused ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Адрес электронной почты"
                  onFocus={handleFocus}
                  selectionColor="#FF6C00"
                />
              </View>
              <View style={styles.inputWraper}>
                <TextInput
                  value={password}
                  onChangeText={passwordHandler}
                  secureTextEntry={passwordShown}
                  style={{
                    ...styles.input,
                    borderColor: isFocused ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Пароль"
                  onFocus={handleFocus}
                  selectionColor="#FF6C00"
                />

                <TouchableOpacity
                  style={styles.buttonShow}
                  onPress={showPassword}
                >
                  <Text style={styles.viewForText}>Показать</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={onLogin}>
                <Text style={styles.textTitel}> Войти </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.viewForText}>
                  Нет аккаунта? Зарегистрироваться
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingLeft: 16,
    borderColor: "#E8E8E8",
    height: 50,
    borderRadius: 8,

    color: "#212121",
    backgroundColor: "#F6F6F6",
    marginBottom: 16,
    // width: 343,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
  },
  form: {
    justifyContent: "flex-start",
    position: "relative",
    // marginHorizontal: 16,
    alignItems: "stretch",
    paddingTop: 32,
    backgroundColor: "#FFFFFF",
    height: 520,

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: "Roboto-Bold",

    fontSize: 30,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",
    marginBottom: 32,

    fontWeight: "500",
  },
  button: {
    marginTop: 27,
    marginBottom: 16,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: 100,
    width: 343,
    flexDirection: "row",
    alignSelf: "center",
  },
  textTitel: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
  },
  viewForText: {
    color: "#1B4371",
    fontSize: 16,
    lineHeight: 19,
    paddingBottom: 45,
    fontFamily: "Roboto-Regular",
    flexDirection: "row",
    alignSelf: "center",
  },
  inputWraper: {
    position: "relative",
  },
  buttonShow: {
    position: "absolute",
    top: 14,
    right: 25,
  },
  contentContainer: {
    paddingTop: 105,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
});