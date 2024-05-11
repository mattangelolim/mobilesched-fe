import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { Snackbar } from "react-native-paper";

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    const handleCheckEmail = async () => {
        try {
            const response = await axios.post("http://3.26.19.203/check/email", { email });

            if (response.data.exists) {
                setShowPasswordFields(true);
            } else {
                setMessage("Email does not exist. Please enter a valid email.");
                setVisible(true);
            }
        } catch (error) {
            console.error("Error checking email:", error);
            setMessage("Failed to check email. Please try again later.");
            setVisible(true);
        }
    };

    const handleResetPassword = async () => {
        try {
            if (password === confirmPassword) {
                const response = await axios.post("http://3.26.19.203/reset/password", { email, newPassword: password });

                setMessage(response.data.message);
                setVisible(true);

                if (response.status === 200) {
                    setTimeout(() => {
                        navigation.navigate("Login");
                    }, 3000);
                }
            } else {
                setMessage("Passwords do not match. Please try again.");
                setVisible(true);
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setMessage("Failed to reset password. Please try again later.");
            setVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleCheckEmail}>
                <Text style={styles.buttonText}>Check Email</Text>
            </TouchableOpacity>
            {showPasswordFields && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>
                </>
            )}
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
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "blue",
        width: "80%",
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});
