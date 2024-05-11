import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
  FlatList
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import StudentSidebar from "../component/studentSidebar";
// import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { Snackbar } from "react-native-paper";

export default function StudentHomeScreen({ navigation }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [codes, setCodes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [modalVisible5, setModalVisible5] = useState(false);

  const openModal5 = () => {
    setModalVisible5(true);
};

const closeModal5 = () => {
    setModalVisible5(false);
};

useEffect(() => {
    fetchAnnouncements();
}, []);


const fetchAnnouncements = async () => {
    try {
        const response = await axios.get("http://3.26.19.203/get/announcements");
        setAnnouncements(response.data.announcements);
        // Calculate unread announcements count
        const unreadCount = response.data.announcements.filter(announcement => !announcement.read).length;
        setUnreadAnnouncements(unreadCount);
    } catch (error) {
        console.error("Error fetching announcements:", error);
    }
};

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    // console.log(result.assets[0].uri);
    setSelectedImage(result.assets[0].uri);

    decodeQRCode(result.assets[0].uri);
  };

  const navigateToViewSchedule = (scheduleCode) => {
    navigation.navigate("StudentSchedule", { code: scheduleCode });
  };

  const decodeQRCode = async (selectedImageUri) => {
    if (!selectedImageUri) {
      console.log("No image selected");
      return;
    }

    const formData = new FormData();
    const localUri = selectedImageUri;
    const filename = localUri.split("/").pop();

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    // Append the file to FormData
    formData.append("qrImage", {
      uri: localUri,
      name: filename,
      type,
    });

    try {
      const response = await axios.post("http://3.26.19.203/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000,
      });
      if (response.status === 202) {
        setSelectedImage(null);
        setModalVisible(false);
        fetchCodes();
        setMessage("Schedule Saved Success");
        setVisible(true);
      } else {
        setVisible(true);
        setMessage("Already enroll in the schedule.");
      }
    } catch (error) {
      setVisible(true);
      setMessage("Error Occured in reading qr, please check your connection");
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await axios.get("http://3.26.19.203/get/enrolled");
      setCodes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} color="orange" />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleCalendar}
          >
            <Ionicons name="calendar" size={24} color="orange" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="search" size={24} color="orange" />
          </TouchableOpacity>
       
  <TouchableOpacity style={styles.iconContainer} onPress={openModal5}>
                        <Ionicons name="notifications" size={24} color="orange" />
                        {unreadAnnouncements > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationText}>{unreadAnnouncements}</Text>
                            </View>
                        )}
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
          <TouchableOpacity
            style={styles.codeItem}
            key={index}
            onPress={() => navigateToViewSchedule(item.code)}
          >
            <Text style={styles.codeLabel}>Schedule code: {item.code}</Text>
            <Text style={styles.codeText}>Professor: {item.name}</Text>
          </TouchableOpacity>
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

      <Modal
                visible={modalVisible5}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal5}
            >
                <View style={styles.modalContainer5}>
                    <TouchableOpacity style={styles.closeButton5} onPress={closeModal5}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.announcementShow}>
                    <FlatList
                        data={announcements}
                        renderItem={({ item }) => (
                            <View style={styles.announcementItem}>
                                <Text>{item.announcement}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    </View>
                </View>
            </Modal>


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

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* SNACK BAR FOR MESSAGE POP UP */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
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
  codeLabel: {
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 16,
    color: "#333", // You can adjust the color as needed
  },
  codeText: {
    fontSize: 16,
    color: "#666", // You can adjust the color as needed
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  addButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "orange",
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
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
},
notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
},
modalContainer5: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
},
announcementItem: {
    padding: 20,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
},
closeButton5: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
},
announcementShow:{
    marginTop:"10%"
}
});
