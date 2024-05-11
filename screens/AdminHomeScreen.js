import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal, FlatList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import Sidebar from "../component/sidebar";
import axios from "axios"

const AdminHomeScreen = ({ navigation }) => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);
    
    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

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

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
                    <TouchableOpacity style={styles.iconContainer} onPress={openModal}>
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
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={toggleSidebar}
                navigation={navigation}
            />
            <View style={styles.navContent}>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate("ProfessorList")}
            >
                <Text style={styles.navButtonText}>Professors</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate("StudentList")}
            >
                <Text style={styles.navButtonText}>Students</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate("AnnouncementTab")}
            >
                <Text style={styles.navButtonText}>Announcements</Text>
            </TouchableOpacity>
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "whitesmoke",
        paddingVertical: 50,
        paddingHorizontal: 10,
    },
    navButton: {
        backgroundColor: "#007bff",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginBottom: 20,
        width: "70%",
        alignItems: "center",
    },
    navButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    iconContainer: {
        padding: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    rightIcons: {
        flexDirection: "row",
    },
    navContent: {
        alignItems: "center", 
        flex:1,
        justifyContent:"center"
      },
      announcementContainer: {
        flex: 1,
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
    modalContainer: {
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
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
    announcementShow:{
        marginTop:"10%"
    }
});

export default AdminHomeScreen;
