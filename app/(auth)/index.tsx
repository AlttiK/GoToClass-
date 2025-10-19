import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import CreateAccount from './createAccount';
import LoginScreen from './login';


const styles= StyleSheet.create({
  
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }, 
  buttons: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#39803f',
  },
  background: {
    flex: 1,
    backgroundColor: '#e3fafc', 
    justifyContent: 'center',
    alignItems: 'center',
    
  }


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
        <View style={styles.background}>
            <Text style={styles.header}> Go To Class! </Text>
              {/* <Button
                title="Log in"
                onPress={toggleLoginModal}/> */}
            <TouchableOpacity style={styles.buttons} onPress={toggleLoginModal}>
              <Text>Log in</Text>
            </TouchableOpacity>
            {/* <Button
              title="Create account"
              onPress={toggleCreateLoginModel}/> */}
              <TouchableOpacity style={styles.buttons} onPress={toggleCreateLoginModel}>
                <Text>Create account</Text>
              </TouchableOpacity>
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


 