import React from 'react';
import { Button, StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';
import CreateAccount from './createAccount';
import LoginScreen from './login';


const styles= StyleSheet.create({
  center:{
    alignItems: 'center',
  },
});

export default function Index() {
    const [isLoginModalVisible, setIsLoginModalVisible] = React.useState(false);
    const [isCreateLoginModalVisible, setIsCreateLoginModalVisible] = React.useState(false);
    const toggleLoginModal = () => {
        setIsLoginModalVisible(!isLoginModalVisible);
    };
    const toggleCreateLoginModel = () => {
      setIsCreateLoginModalVisible(!isCreateLoginModalVisible);
    }

    return (
        <View style={[styles.center, {top: 100}]}>
            <Text> Welcome to Go To Class! </Text>

            <Button
              title="Log in"
              onPress={toggleLoginModal}/>
            <Button
              title="Create account"
              onPress={toggleCreateLoginModel}/>
            <Modal isVisible={isLoginModalVisible}>
              <View>
                <LoginScreen/>
                <View>
                  <Button title="Close" onPress={toggleLoginModal} />
                </View>
              </View>
            </Modal>
            <Modal isVisible={isCreateLoginModalVisible}>
              <View>
                <CreateAccount/>
                <View>
                  <Button title="Close" onPress={toggleCreateLoginModel} />
                </View>
              </View>
            </Modal>
        </View>
    );
}


 