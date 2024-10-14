import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login, register } from "@/utils/client";
import { useNavigation } from "@react-navigation/native";

interface User {
  email: string;
  name: string;
}

export default function AuthScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      if (response) {
        setUser(response.user);
        setError(null);
        // @ts-ignore
        navigation.navigate("(tabs)");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await register({ email, password });
      if (response) {
        setUser(response);
        setError(null);
        // @ts-ignore
        navigation.navigate("(tabs)");
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };
  const handleLogout = async () => {
    try {
      setUser(null);
    } catch (err) {
      setError("Logout failed. Please try again.");
    }
  };

  const handleOAuthLogin = (provider: string) => {
    alert(`Logging in with ${provider}`);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {user.name}</Text>
        <Text>Email: {user.email}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.topLoginText}>
          {isLogin ? "Login" : "Register"}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin ? "Access your account securely" : "Create a new account"}
        </Text>

        <View style={styles.formContainer}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="black"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#888"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <Text style={styles.oauthText}>
          Or {isLogin ? "login" : "register"} with
        </Text>
        <View style={styles.oauthGrid}>
          <TouchableOpacity
            style={styles.oauthButton}
            onPress={() => handleOAuthLogin("Google")}
          >
            <Ionicons name="logo-google" size={20} color="white" />
            <Text style={styles.oauthButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.oauthButton}
            onPress={() => handleOAuthLogin("GitHub")}
          >
            <Ionicons name="logo-github" size={20} color="white" />
            <Text style={styles.oauthButtonText}>GitHub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={isLogin ? handleLogin : handleRegister}
      >
        <Text style={styles.loginButtonText}>
          {isLogin ? "Login" : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-between",
  },
  topLoginText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  loginButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: 15,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#888",
    marginVertical: 10,
  },
  oauthText: {
    textAlign: "center",
    marginBottom: 10,
    color: "#888",
  },
  oauthGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  oauthButton: {
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    width: "48%",
    justifyContent: "center",
    marginVertical: 5,
  },
  oauthButtonText: {
    color: "white",
    marginLeft: 8,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
