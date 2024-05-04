import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import moment from "moment"

const events = [
  { day: 'Monday', start_time: '01:00:00', end_time: '02:00:00', description: 'Lorem ipsum 1' },
  { day: 'Monday', start_time: '03:00:00', end_time: '04:00:00', description: 'Lorem ipsum 2' },
  { day: 'Monday', start_time: '03:00:00', end_time: '04:00:00', description: 'Lorem ipsum 2' },
  { day: 'Tuesday', start_time: '01:00:00', end_time: '02:00:00', description: 'Lorem ipsum 3' },
  { day: 'Wednesday', start_time: '01:00:00', end_time: '02:00:00', description: 'Lorem ipsum 4' },
  { day: 'Wednesday', start_time: '03:00:00', end_time: '04:00:00', description: 'Lorem ipsum 5' },
  { day: 'Friday', start_time: '01:00:00', end_time: '02:00:00', description: 'Lorem ipsum 6' },
  { day: 'Saturday', start_time: '01:00:00', end_time: '02:00:00', description: 'Lorem ipsum 7' }
];

const CalendarEvent = ({ day, schedules }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const displaySchedules = schedules.slice(0, 1); // Limit to first 2 schedules
  const moreSchedules = schedules.length > 1;

  return (
    <View style={styles.eventContainer}>
      {/* <Text>{day}</Text> */}
      {displaySchedules.map((schedule, index) => (
        <TouchableOpacity key={index} onPress={() => setModalVisible(true)}>
          <Text>{`${schedule.start_time} - ${schedule.end_time}: ${schedule.description}`}</Text>
        </TouchableOpacity>
      ))}
      {moreSchedules && (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.seeMoreText}>See more</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedules</Text>
            <FlatList
              data={schedules}
              renderItem={({ item }) => (
                <Text>{`${item.start_time} - ${item.end_time}: ${item.description}`}</Text>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const CalendarScreen = () => {

  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [professor, setProfessor] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const markDates = () => {
      const newMarkedDates = {};

      events.forEach(event => {
        const currentDate = moment().startOf('month');

        while (currentDate.month() === moment().month()) {
          if (currentDate.format('dddd') === event.day) {
            newMarkedDates[currentDate.format('YYYY-MM-DD')] = { marked: true };
          }
          currentDate.add(1, 'day');
        }
      });

      setMarkedDates(newMarkedDates);
    };

    markDates();
  }, []);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const toggleSidebar = () => {
    // Implement your toggleSidebar function
  };
  const groupedEvents = {};

  // Group events by day
  events.forEach(event => {
    if (!groupedEvents[event.day]) {
      groupedEvents[event.day] = [];
    }
    groupedEvents[event.day].push(event);
  });

  // Helper function to get the dates for each day of the current week
  const getCurrentWeekDates = () => {
    const weekStart = moment().startOf('week'); // Start of current week
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(weekStart.clone().add(i, 'days').format('YYYY-MM-DD'));
    }

    return dates;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconContainer} onPress={toggleCalendar}>
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
          <Calendar markedDates={markedDates} />
        </View>
      )}
      <View>
        <Text>How many days is this semester?</Text>
        <View style={styles.maincont}>

          <View style={styles.dateContainer}>
            {getCurrentWeekDates().map((date, index) => (
              <View key={index} style={styles.dateItem}>
                <Text style={styles.dateLabel}>{moment(date).format('ddd')}</Text>
                <Text>{moment(date).format('MMM DD')}</Text>
              </View>
            ))}

          </View>
          <View style={styles.eventsContainer}>
            {getCurrentWeekDates().map((date, index) => (
              <CalendarEvent key={index} schedules={events.filter(event => event.day === moment(date).format('dddd'))} />
            ))}
          </View>
        </View>
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
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent2}>
            {/* Header */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Create a Schedule</Text>
            <TextInput
              style={styles.input}
              placeholder="Input day of the scheule"
              value={day}
              onChangeText={(text) => setStartTime(text)}
            />

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
            <TextInput
              style={styles.input}
              placeholder="Professor's name"
              value={professor}
              onChangeText={(text) => setProfessor(text)}
            />
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
            // onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  maincont: {
    flexDirection: 'row',
    justifyContent: "center",
    backgroundColor: '#f2f2f2',
    alignItems: "center",
    borderRadius: 10,
    overflow: 'scroll',
  },
  dateContainer: {
    flexDirection: 'column',
    width: '20%',
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    padding: 5,
    backgroundColor: '#fff',
  },
  dateItem: {
    height: "10%",
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    padding: 2,
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventsContainer: {
    flexDirection: 'column',
    height: "100%",
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  eventContainer: {
    height: "10%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fafafa',
  },
  iconContainer: {
    padding: 10,
  },
  calendarDropdown: {
    padding: 10,
  },
  rightIcons: {
    flexDirection: 'row',
  },
  calendarContainer: {
    marginBottom: 20,
  },
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
  iconContainer: {
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'blue',
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
  modalContainer2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent2: {
    backgroundColor: "white",
    height: "75%",
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
});

export default CalendarScreen;
