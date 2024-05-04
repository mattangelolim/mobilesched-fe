import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import StudentSidebar from "../component/studentSidebar";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

const StudentHomeScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrData, setQrData] = useState(null);

  const navigation = useNavigation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    console.log(result.assets[0].uri);
    setSelectedImage(result.assets[0].uri);
  };

  const decodeQRCode = async () => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: selectedImage,
        name: "image.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post("http://3.26.19.203/decode", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);

      if (response.data && response.data.qrData) {
        console.log("QR Code Data:", response.data.qrData);
      } else {
        console.log("QR code not found in the image.");
      }
    } catch (error) {
      console.error("Error decoding QR code:", error);
      throw error;
    }
  };

  const codes = [
    {
      code: "aoOtgO",
    },
    {
      code: "KkSzX1",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleCalendar}
          >
            <Ionicons name="calendar" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar />
        </View>
      )}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        navigation={navigation}
      />

      <View style={styles.codeContainer}>
        <Text style={styles.codeTitle}>Current Schedules Enrolled</Text>
        {codes.map((item, index) => (
          <View style={styles.codeItem} key={index}>
            <Text style={styles.codeText}>Schedule code - {item.code}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.addButtonIcon}>
          <Ionicons name="add" size={50} color="white" />
        </View>
      </TouchableOpacity>

      {/* Modal for Image Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleChoosePhoto}>
                <Text>Upload QR</Text>
              </TouchableOpacity>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 200, height: 200 }}
                />
              )}
              {qrData && <Text>QR Code Data: {qrData}</Text>}
              <TouchableOpacity onPress={decodeQRCode}>
                <Text>Decode QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    paddingVertical: 50,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    padding: 10,
  },
  calendarDropdown: {
    padding: 10,
  },
  rightIcons: {
    flexDirection: "row",
  },
  calendarContainer: {
    marginBottom: 20,
  },
  codeContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  codeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  codeItem: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  codeText: {
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  addButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default StudentHomeScreen;
