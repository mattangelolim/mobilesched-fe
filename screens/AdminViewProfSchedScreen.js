import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import axios from "axios";
import { Snackbar } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import Sidebar from "../component/sidebar";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const CalendarEvent = ({ day, schedules, fetchData, codes }) => {
  const [modalVisible, setModalVisible] = useState(false);
  // const [selectedSchedule, setSelectedSchedule] = useState(null); // State to manage selected schedule
  // const [selectedOption, setSelectedOption] = useState(null); // State to manage selected option
  const [selectedOpen, setSelectedOpen] = useState(null);
  const [isOthersSelected, setIsOthersSelected] = useState(false);
  const [customOption, setCustomOption] = useState("");
  const displaySchedules = schedules.slice(0, 2);
  const moreSchedules = schedules.length > 2;

  const options = [
    { id: 1, label: "Online Learning" },
    { id: 2, label: "Asynchronous Class" },
    { id: 3, label: "No Classes" },
    { id: 4, label: "Face to Face Meeting" },
    { id: 5, label: "Others" },
  ];


  const handleOptionSelect = async (option, statusCheck) => {
    let status;

    if (option === "Others") {
      status = customOption;
    } else {
      status = option;
    }

    const data = {
      id: selectedOpen,
      status: status,
    };

    try {
      let response;
      if (statusCheck !== null) {
        response = await axios.post("http://3.26.19.203/update/status", data);
      } else {
        response = await axios.post("http://3.26.19.203/create/status", data);
      }

      if (response.status === 201) {
        setSelectedOpen(null);
        setIsOthersSelected(false);
        setCustomOption("");
        fetchData(codes);
      }
    } catch (error) {
      console.error("Error:", error);
      console.error("Failed to update status");
    }
  };

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
                <TouchableOpacity
                  style={styles.scheduleItem}
                  onPress={() => setSelectedOpen(item.id, item.status)}
                >
                  <View style={styles.additional}>
                    {item.status === null ? (
                      <Ionicons
                        name="add-circle"
                        size={14}
                        color="blue"
                        onPress={() => setSelectedOpen(item.id)}
                      />
                    ) : null}
                    <Text style={styles.descriptionText}>
                      {item.description} |{" "}
                    </Text>
                    <Text>{`${item.start_time} - ${item.end_time}`}</Text>
                  </View>
                  <Text style={styles.statuslabel}>{item.status}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        {selectedOpen !== null && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={selectedOpen !== null}
            onRequestClose={() => setSelectedOpen(null)}
          >
            <View style={styles.popup}>
              <View style={styles.optionModalContent}>
                <Text style={styles.modalTitle}>Select Option</Text>
                <FlatList
                  data={options}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        if (item.label === "Others") {
                          setIsOthersSelected(true);
                        } else {
                          handleOptionSelect(item.label);
                        }
                      }}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
                {isOthersSelected && (
                  <>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter custom option"
                      value={customOption}
                      onChangeText={(text) => setCustomOption(text)}
                    />
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => handleOptionSelect("Others")}
                    >
                      <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setIsOthersSelected(false);
                    setSelectedOpen(null);
                  }}
                >
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </Modal>
    </View>
  );
};

const AdminViewProfSchedScreen = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const route = useRoute();

  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDate3, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  // const [status, setStatus] = useState("");
  const [number, setNumber] = useState("");
  const [availableSem, setAvailableSem] = useState(null);
  const options = { month: "long", day: "2-digit", year: "numeric" };

  const [announcements, setAnnouncements] = useState([]);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [modalVisible5, setModalVisible5] = useState(false);


  const [events, setEvents] = useState([]);

  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [professor, setProfessor] = useState("");
  const [codes, setCodes] = useState("");
  const [description, setDescription] = useState("");

  const [QRValue, setQrValue] = useState("");
  const [modalQRVisible, setModalQRVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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


  useEffect(() => {
    const { code, name } = route.params;
    if (code) {
      setProfessor(name)
      setCodes(code)
      checkAvailableSem(code)
      fetchData(code);
    }
  }, [route.params]);

  const navigation = useNavigation();

  const handleQRCodePress = (code) => {
    setQrValue(code);
    setModalQRVisible(true);
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
      console.error("Error fetching data3:", error);
    }
  };
  const checkAvailableSem = async (code) => {
    try {
      const response = await axios.get("http://3.26.19.203/check/sem/ranges", {
        params: {
          code: code,
        },
      });
      setAvailableSem(response.data);
    } catch (error) {
      console.error("Error fetching data2:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://3.26.19.203/create/schedule?code=${codes}`, {
        day,
        start_time: startTime,
        end_time: endTime,
        professor,
        description
      });
      if (response.status === 200) {
        setModalVisible(false);
        setMessage("Schedule Created Successful");
        setVisible(true);
        fetchData(codes);
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (text) => {
    if (/^\d+$/.test(text) || text === "") {
      setNumber(text);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://3.26.19.203/set/sem/range?code=${codes}", {
        number,
        code: codes
      });
      if (response.status === 200) {
        setMessage("Semester Range Set Successful");
        setVisible(true);
        checkAvailableSem(codes);
      }
    } catch (error) {
      console.error("Error:", error);
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
          <Calendar markedDates={markedDate3} />
        </View>
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        navigation={navigation}
      />
      <View style={styles.maincont2}>
        {!availableSem ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputDays}
              placeholder="no of days this sem?"
              value={number}
              onChangeText={handleInputChange}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
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
              <TouchableOpacity
                onPress={() => handleQRCodePress(availableSem.code)}
              >
                <Ionicons name="qr-code-outline" size={24} color="black" />
              </TouchableOpacity>
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
                codes={codes}
                fetchData={fetchData}
              />
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
              style={styles.closeButton2}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Create a Schedule</Text>
            <TextInput
              style={styles.input}
              placeholder="Input day of the scheule"
              value={day}
              onChangeText={(text) => setDay(text)}
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
              placeholder="Subject Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
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

      {/* QR CODE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalQRVisible}
        onRequestClose={() => setModalQRVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <QRCode value={QRValue} size={200} />
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => setModalQRVisible(false)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
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
    marginLeft: 5,
  },
  iconContainer: {
    padding: 10,
    marginHorizontal: 5,
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
    backgroundColor: "whitesmoke",
    paddingVertical: 50,
    paddingHorizontal: 10,
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
    backgroundColor: "orange",
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
  closeButton2: {
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
  scheduleItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  popup: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  additional: {
    flexDirection: "row",
    alignItems: "center",
  },
  statuslabel: {
    color: "gray",
    marginLeft: 5,
    fontSize: 12,
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
  announcementShow: {
    marginTop: "10%"
  }
});

export default AdminViewProfSchedScreen;
