import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Sidebar = ({ isOpen, onClose, navigation }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://3.26.19.203/get/user");
      if (response.data && response.data.name) {
        setUserName(response.data.name);
      }
    } catch (error) {
      // console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://3.26.19.203/logout/user");

      navigation.navigate("Login");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={isOpen ? styles.containerOpen : styles.containerClosed}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>

      {/* Sidebar Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome to Institute of Engineering
        </Text>
        <View style={styles.userContainer}>
          <Ionicons name="person-circle" size={32} color="#333" />
          <Text style={styles.title}>{userName}</Text>
        </View>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={36} color="orange" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerOpen: {
    marginVertical: 40,
    backgroundColor: "#FFF", // Change background color to white
    width: 250,
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: "#000", // Add shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Add shadow opacity
    shadowRadius: 3, // Add shadow radius
    elevation: 5, // For Android shadow effect
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "orange", // Change text color to black
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  containerClosed: {
    display: "none",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333", // Change text color to black
  },
  title2: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333", // Change text color to black
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  itemText: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 10,
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "orange"
  },
});

export default Sidebar;
