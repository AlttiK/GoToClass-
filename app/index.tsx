import React from 'react';
import { Button, StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';
import LoginScreen from './login';

const styles= StyleSheet.create({
  center:{
    alignItems: 'center',
  },
});

export default function Index() {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    return (
        <View style={[styles.center, {top: 100}]}>
            <Text> Welcome to Go To Class! </Text>

            <Button
              title="Log in"
              onPress={toggleModal}/>
            <Button
              title="Create account"
              onPress={toggleModal}/>
            <Modal>
              isVisible={isModalVisible}
              <View>
                <LoginScreen/>
                <View>
                  <Button title="Close" onPress={toggleModal} />
                </View>
              </View>
            </Modal>
        </View>
    );
}


 