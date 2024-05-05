import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import StudentSidebar from "../component/studentSidebar";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";

const CalendarEvent = ({ day, schedules }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const displaySchedules = schedules.slice(0, 2);
  const moreSchedules = schedules.length > 2;

  return (
    <View style={styles.eventContainer}>
      {/* <Text>{day}</Text> */}
      {displaySchedules.map((schedule, index) => (
        <TouchableOpacity key={index} onPress={() => setModalVisible(true)}>
          <Text>
            <Text style={styles.descriptionText}>{schedule.description} |</Text>
            {` ${schedule.start_time} - ${schedule.end_time}`}
          </Text>
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
                <View style={styles.scheduleItem}>
                  <View style={styles.additional}>
                    <Text style={styles.descriptionText}>
                      {item.description} |
                    </Text>
                    <Text>{` ${item.start_time} - ${item.end_time}`}</Text>
                  </View>
                  {item.status !== null && (
                    <Text style={styles.statuslabel}>{item.status}</Text>
                  )}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const StudentScheduleScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState([]);

  const [availableSem, setAvailableSem] = useState(null);
  const options = { month: "long", day: "2-digit", year: "numeric" };
  // const [code, setCode] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const fetchData = async (code) => {
    try {
      const response = await axios.get("http://3.26.19.203/show/schedules", {
        params: {
          code: code,
        },
      });
      setEvents(response.data);
    } catch (error) {
      // console.log(code)
      console.error("Error fetching data:", error);
    }
  };

  const checkAvailableSem = async (code) => {
    try {
      const response = await axios.get("http://3.26.19.203/range/sched", {
        params: {
          code: code,
        },
      });
      setAvailableSem(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const markDates = () => {
    const newMarkedDates = {};
    events.forEach((event) => {
      const currentDate = moment().startOf("month");

      while (currentDate.month() === moment().month()) {
        if (currentDate.format("dddd") === event.day) {
          newMarkedDates[currentDate.format("YYYY-MM-DD")] = { marked: true };
        }
        currentDate.add(1, "day");
      }
    });
    setMarkedDates(newMarkedDates);
  };

  useEffect(() => {
    const { code } = route.params;
    if (code) {
      fetchData(code);
      checkAvailableSem(code);
    }
  }, [route.params]);

  useEffect(() => {
    markDates();
  }, [events]);

  const groupedEvents = {};

  // Group events by day
  events.forEach((event) => {
    if (!groupedEvents[event.day]) {
      groupedEvents[event.day] = [];
    }
    groupedEvents[event.day].push(event);
  });

  const getCurrentWeekDates = () => {
    const weekStart = moment().startOf("week");
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(weekStart.clone().add(i, "days").format("YYYY-MM-DD"));
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
          <Calendar markedDates={markedDates} />
        </View>
      )}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        navigation={navigation}
      />
      <View style={styles.maincont2}>
        {!availableSem ? (
          <View style={styles.inputContainer}>
            <Text>No Current Semester</Text>
          </View>
        ) : (
          <View style={styles.dateRanges}>
            <View style={styles.dateContainer2}>
              <Text style={styles.dateText}>
                {new Date(availableSem.startDate).toLocaleDateString(
                  undefined,
                  options
                )}
              </Text>
              <Text style={styles.dateText}>TO</Text>
              <Text style={styles.dateText2}>
                {new Date(availableSem.endDate).toLocaleDateString(
                  undefined,
                  options
                )}
              </Text>
            </View>
            <View style={styles.QrContainer}>
              <Text style={styles.dateTitle}>Semester Range</Text>
            </View>
          </View>
        )}

        <View style={styles.maincont}>
          <View style={styles.dateContainer}>
            {getCurrentWeekDates().map((date, index) => (
              <View key={index} style={styles.dateItem}>
                <Text style={styles.dateLabel}>
                  {moment(date).format("ddd")}
                </Text>
                <Text>{moment(date).format("MMM DD")}</Text>
              </View>
            ))}
          </View>
          <View style={styles.eventsContainer}>
            {getCurrentWeekDates().map((date, index) => (
              <CalendarEvent
                key={index}
                schedules={events.filter(
                  (event) => event.day === moment(date).format("dddd")
                )}
              />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.maincont}>
        <View style={styles.dateContainer}>
          {getCurrentWeekDates().map((date, index) => (
            <View key={index} style={styles.dateItem}>
              <Text style={styles.dateLabel}>{moment(date).format("ddd")}</Text>
              <Text>{moment(date).format("MMM DD")}</Text>
            </View>
          ))}
        </View>
        <View style={styles.eventsContainer}>
          {getCurrentWeekDates().map((date, index) => (
            <CalendarEvent
              key={index}
              schedules={events.filter(
                (event) => event.day === moment(date).format("dddd")
              )}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  maincont2: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    borderRadius: 10,
    overflow: "scroll",
  },
  maincont: {
    height: "90%",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    borderRadius: 10,
  },
  dateContainer: {
    flexDirection: "column",
    width: "20%",
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    padding: 5,
    backgroundColor: "#fff",
  },
  dateItem: {
    height: 80,
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 2,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventsContainer: {
    flexDirection: "column",
    height: "100%",
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
  },
  eventContainer: {
    height: 80,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  descriptionText: {
    fontWeight: "bold",
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
  container: {
    flex: 1,
    backgroundColor: "orange",
    paddingVertical: 50,
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "blue",
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
    backgroundColor: "#9AC8CD",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputDays: {
    borderColor: "black",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 5,
    backgroundColor: "white",
    borderWidth: 0.5,
    color: "#003f5c",
  },
  saveButton: {
    padding: 10,
    borderColor: "black",
    backgroundColor: "#003f5c",
    color: "white",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  dateContainer2: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dateTitle: {
    fontSize: 20,
    backgroundColor: "#FF8A08",
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 10,
    marginRight: 5,
    borderColor: "#FFC966",
    borderWidth: 2,
    borderRadius: 20,
  },
  dateText: {
    fontFamily: "Roboto",
    fontSize: 16,
    paddingVertical: 4,
    marginHorizontal: 4,
    backgroundColor: "#F3F3F3",

    borderRadius: 8,
  },
  dateText2: {
    fontFamily: "Roboto",
    fontSize: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginHorizontal: 4,
    backgroundColor: "orange",
    borderRadius: 8,
  },
  dateRanges: {
    flexDirection: "column",
  },
  QrContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  statuslabel: {
    color: "gray",
    marginLeft: 5,
    fontSize: 12,
  },
  additional: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default StudentScheduleScreen;
