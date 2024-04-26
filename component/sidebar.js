import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <View style={isOpen ? styles.containerOpen : styles.containerClosed}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>

      {/* Sidebar Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Sidebar Title</Text>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Item 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Item 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Item 3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerOpen: {
    marginVertical:50,
    backgroundColor: "#fff6f6",
    width: 250,
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    paddingTop: 50, 
    paddingHorizontal: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  item: {
    marginBottom: 15,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Sidebar;
