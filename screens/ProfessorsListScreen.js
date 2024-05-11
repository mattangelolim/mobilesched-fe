import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import Sidebar from "../component/sidebar";

const ProfessorListScreen = ({ navigation }) => {
    const [professors, setProfessors] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        user_type: "Professor",
        password: ""
    });
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProfessors, setFilteredProfessors] = useState([]);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const fetchProfessors = async () => {
        try {
            const response = await axios.get("http://3.26.19.203/get/profesors");
            setProfessors(response.data);
        } catch (error) {
            console.error("Error fetching professors:", error);
        }
    };

    useEffect(() => {
        fetchProfessors();
    }, []);

    useEffect(() => {
        // Filter professors based on search query
        const filteredData = professors.filter(professor =>
            professor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProfessors(filteredData);
    }, [searchQuery, professors]);

    const handleRegister = async () => {
        try {
            const response = await axios.post("http://3.26.19.203/register/user", formData);

            if(response.status === 200){
                setIsModalVisible(false)
                fetchProfessors();
            }
        } catch (error) {
            console.error("Error registering professor:", error);
        }
    };

    const navigateToViewSchedule = (scheduleCode, name ) => {
        navigation.navigate("AdminViewProfSched", { code: scheduleCode, name:name});
      };

    const renderProfessorItem = ({ item }) => (
        <TouchableOpacity style={styles.professorItem} onPress={() => navigateToViewSchedule(item.code, item.name)}>
            <Text style={styles.professorName}>Professor's Name: {item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Username: {item.username}</Text>
            <Text>Code: {item.code}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconContainer} onPress={toggleSidebar}>
                    <Ionicons name="menu" size={24} color="orange" />
                </TouchableOpacity>
                <Text style={styles.headerText}>List of Professors</Text>
                <View style={styles.rightIcons}>
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={toggleCalendar}
                    >
                        <Ionicons name="calendar" size={24} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={toggleSearch}>
                        <Ionicons name="search" size={24} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={toggleModal}>
                        <Ionicons name="add" size={24} color="orange" />
                    </TouchableOpacity>
                </View>
            </View>
            {searchVisible && (
                <TextInput
                    style={styles.input}
                    placeholder="Search by professor's name"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
            )}
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
            <FlatList
                data={searchQuery ? filteredProfessors : professors}
                renderItem={renderProfessorItem}
                keyExtractor={(item) => item.id.toString()}
            />

            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>Add Professor</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={(text) => handleChange("email", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={formData.username}
                        onChangeText={(text) => handleChange("username", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        value={formData.password}
                        onChangeText={(text) => handleChange("password", text)}
                    />
                    <View style={styles.modalButtons}>
                        <Button title="Cancel" onPress={toggleModal} />
                        <Button title="Register" onPress={handleRegister} />
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
        paddingVertical: 50,
        paddingHorizontal: 10,
    },
    professorItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    professorName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
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
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    calendarContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    modalContainer: {
        flex: 1, 
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 20,
    },
    modalHeader: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 20,
    },
});

export default ProfessorListScreen;
