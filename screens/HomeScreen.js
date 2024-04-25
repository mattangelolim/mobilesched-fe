// HomeScreen.js
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");

  const dummyData = [
    {
      id: 1,
      status: "In Meeting",
      date: "2024-04-25",
      start_time: "08:00:00",
      end_time: "09:00:00",
    },
    {
      id: 2,
      status: "In Faculty",
      date: "2024-04-25",
      start_time: "10:00:00",
      end_time: "11:30:00",
    },
    {
      id: 3,
      status: "Outside School",
      date: "2024-04-25",
      start_time: "13:00:00",
      end_time: "14:30:00",
    },
    {
      id: 4,
      status: "Free time",
      date: "2024-04-25",
      start_time: "15:30:00",
      end_time: "17:00:00",
    },
  ];

  const today = new Date().toISOString().split("T")[0];

  // Filter dummyData for events with the same date as today
  const todayEvents = dummyData.filter((event) => event.date === today);

  const handleSubmit = () => {
    // Handle form submission logic here
    // For example, you can submit the form data to your backend
    // and close the modal
    setModalVisible(false);
  };

  const handleOpenQRCode = (eventId) => {
    // console.log(eventId)
    setQRCodeData(eventId.toString());
    setShowQRModal(true);
  };
  console.log(qrCodeData);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Categories</Text>
      <View style={styles.scrollView}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.column}
          showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.box, { height: 120 }]}>
            <Text style={styles.boxLabel}>Schedule</Text>
            <Text style={styles.subLabel}>In Meeting</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: "50%" }]}></View>
            </View>
          </View>
          <View style={[styles.box, { height: 120 }]}>
            <Text style={styles.boxLabel}>Schedule</Text>
            <Text style={styles.subLabel}>In Faculty</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: "20%" }]}></View>
            </View>
          </View>
          <View style={[styles.box, { height: 120 }]}>
            <Text style={styles.boxLabel}>Schedule</Text>
            <Text style={styles.subLabel}>Outside School</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: "30%" }]}></View>
            </View>
          </View>
          <View style={[styles.box, { height: 120 }]}>
            <Text style={styles.boxLabel}>Schedule</Text>
            <Text style={styles.subLabel}>Free Time</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: "10%" }]}></View>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ maxHeight: 500 }}>
        <Text style={styles.label}>Today's Schedule</Text>
        <ScrollView>
          {todayEvents.length > 0 ? (
            // Render today's events
            todayEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventContainer}
                onPress={() => handleOpenQRCode(event.id)}
              >
                <Text style={styles.eventStatus}>{event.status}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
                <Text>Start Time: {event.start_time}</Text>
                <Text>End Time: {event.end_time}</Text>
              </TouchableOpacity>
            ))
          ) : (
            // Render a message if there are no events for today
            <Text>No events for today</Text>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.addButtonIcon}>
          <Ionicons name="add" size={50} color="white" />
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Create a Schedule</Text>
            {/* Status Input */}
            <TextInput
              style={styles.input}
              placeholder="Choose between 4 categories"
              value={status}
              onChangeText={(text) => setStatus(text)}
            />
            {/* Date Input */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)} // Show date picker on press
            >
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false); // Hide date picker after selection
                  const currentDate = selectedDate || date;
                  setDate(currentDate);
                }}
              />
            )}
            {/* Start Time Input */}
            <TextInput
              style={styles.input}
              placeholder="Start Time (use military time format)"
              value={startTime}
              onChangeText={(text) => setStartTime(text)}
            />
            {/* End Time Input */}
            <TextInput
              style={styles.input}
              placeholder="End Time (use military time format)"
              value={endTime}
              onChangeText={(text) => setEndTime(text)}
            />
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showQRModal}
        transparent={true}
        onRequestClose={() => setShowQRModal(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1} // Prevents the modal from closing immediately when touched
          onPress={() => setShowQRModal(false)} // Close the modal when the background is pressed
        >
          <View style={styles.qrModalContent}>
            <QRCode value={qrCodeData} size={200} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    paddingVertical: 50,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  rightIcons: {
    flexDirection: "row",
  },
  iconContainer: {
    marginHorizontal: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  column: {
    marginTop: 5,
    flexDirection: "row",
    borderColor: "gray",
    borderWidth: 1,
    overflow: "scroll",
    borderRadius: 10,
  },
  box: {
    width: 200,
    height: 120,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    margin: 10,
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
  boxLabel: {
    fontSize: 18,
    color: "#787878",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subLabel: {
    fontSize: 18,
    color: "#2b2b2b",
  },
  progressBar: {
    width: "80%",
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginTop: 5,
  },
  progress: {
    height: "100%",
    backgroundColor: "#696969",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    height: "70%",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  eventContainer: {
    maxHeight: "30%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
  },
  eventStatus: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  eventDate: {
    marginBottom: 5,
  },
});
