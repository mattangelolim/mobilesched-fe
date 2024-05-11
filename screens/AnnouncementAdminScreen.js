import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, TextInput, FlatList, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import Sidebar from "../component/sidebar";
import { useNavigation } from "@react-navigation/native";

const AnnouncementAdminScreen = () => {
    const [announcement, setAnnouncement] = useState("");
    const [expiration, setExpiration] = useState("");
    const [message, setMessage] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

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

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const createAnnouncement = async () => {
        try {
            const response = await axios.post("http://3.26.19.203/create/announcement", {
                announcement: announcement,
                expiration: parseInt(expiration)
            });
            setMessage(response.data.message);
            setAnnouncement("");
            setExpiration("");
            // Refresh announcements after creating a new one
            fetchAnnouncements();
        } catch (error) {
            console.error("Error creating announcement:", error);
            setMessage("Failed to create announcement. Please try again later.");
        }
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconContainer} onPress={toggleSidebar}>
                    <Ionicons name="menu" size={24} color="orange" />
                </TouchableOpacity>
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.iconContainer} onPress={toggleCalendar}>
                        <Ionicons name="calendar" size={24} color="orange" />
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
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} navigation={navigation} />
            <View style={styles.announcementContainer}>
                <Text style={styles.label}>Announcement:</Text>
                <TextInput
                    style={styles.input}
                    value={announcement}
                    onChangeText={setAnnouncement}
                    placeholder="Enter announcement"
                />
                <Text style={styles.label}>Expiration (in days):</Text>
                <TextInput
                    style={styles.input}
                    value={expiration}
                    onChangeText={setExpiration}
                    placeholder="Enter expiration"
                    keyboardType="numeric"
                />
                <Button title="Create Announcement" onPress={createAnnouncement} />
                {message ? <Text style={styles.message}>{message}</Text> : null}
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
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingTop: 50,
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
    iconContainer: {
        padding: 10,
        marginHorizontal: 5,
    },
    calendarContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        color: "#333",
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#333",
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        color: "orange",
    },
    announcementContainer: {
        flex: 1,
        paddingHorizontal:20
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

export default AnnouncementAdminScreen;
