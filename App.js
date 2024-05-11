// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import StudentHomeScreen from "./screens/StudentHomeScreen";
import StudentScheduleScreen from './screens/StudentScheduleScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import ProfessorListScreen from "./screens/ProfessorsListScreen"
import AdminViewProfSchedScreen from "./screens/AdminViewProfSchedScreen"
import StudentListScreen from './screens/StudentListScreen';
import AnnouncementAdminScreen from './screens/AnnouncementAdminScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
          <Stack.Screen name="AnnouncementTab" component={AnnouncementAdminScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ProfessorList" component={ProfessorListScreen} />
          <Stack.Screen name="StudentList" component={StudentListScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
          <Stack.Screen name="StudentSchedule" component={StudentScheduleScreen} />
          <Stack.Screen name="AdminViewProfSched" component={AdminViewProfSchedScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
