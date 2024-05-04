import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const StudentHomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Student Home</Text>
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
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentHomeScreen;
