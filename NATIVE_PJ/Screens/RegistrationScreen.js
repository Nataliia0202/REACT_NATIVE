import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Image,
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
const imageBg = require("../assets/images/PhotoBG.jpg");
import { useDispatch } from "react-redux";
import SVGImg from "../assets/images/add.svg";
import SVGDel from "../assets/images/del.svg";
import * as ImagePicker from "expo-image-picker";
import {
  uploadPhotoToStorage,
  DeletUploadPhotoToStorage,
} from "../redux/userOperations";
import { register } from "../redux/userOperations";

export const RegistrationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isShowkeyboard, setIsShowkeyboard] = useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(true);

  
  const [avatar, setAvatar] = useState(null);

  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setIsShowkeyboard(true);
    setIsFocused(!isFocused);
  }, [isFocused]);

  const loginHandler = (text) => setLogin(text);
  const emailHandler = (text) => setEmail(text);
  const passwordHandler = (text) => setPassword(text);

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

  const keyboardHide = async () => {
    if (login === "" || email === "" || password === "") {
      return Alert.alert("Заполните поля");
    } else {
    
      dispatch(register({ email, password, login, avatar }));
      console.log({ email, password, login, avatar });
    }
    setLogin("");
    setEmail("");
    setPassword("");
    
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

      if (!result.canceled) {
        setAvatar(await uploadPhotoToStorage(result.assets[0].uri));
    }
      
    };
    
   
  // const onTransition = () => {
  //   navigation.navigate("Логин");
  // };
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
                  <TouchableOpacity style={styles.svgDel} onPress={pickImage}>
                    <SVGDel width={40} height={40} />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.text}>Регистрация</Text>
              <View>
                <TextInput
                  value={login}
                  onChangeText={loginHandler}
                  style={{
                    ...styles.input,
                    borderColor: isFocused ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Логин"
                  onFocus={handleFocus}
                  selectionColor="#FF6C00"
                />
              </View>
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

              <TouchableOpacity style={styles.button} onPress={keyboardHide}>
                <Text style={styles.textTitel}> Зарегистрироваться </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.viewForText}>Уже есть аккаунт? Войти</Text>
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
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
