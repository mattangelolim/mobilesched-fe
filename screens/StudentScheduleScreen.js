import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import StudentSidebar from "../component/studentSidebar";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";

const StudentScheduleScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigation = useNavigation();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

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
      {/* <Text style={styles.title}>Welcome to Student Home</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Courses')}
      >
        <Text style={styles.buttonText}>View Courses</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Grades')}
      >
        <Text style={styles.buttonText}>View Grades</Text>
      </TouchableOpacity> */}
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
});

export default StudentScheduleScreen;
