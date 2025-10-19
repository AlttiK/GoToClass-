import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from "react-native";


const styles= StyleSheet.create({
  center:{
    alignItems: 'center',
  },
  container:{
    flex:1,
    padding:25,
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
}
  
});


export default function Index({ navigation }: any) {
    const [activity, setActivity] = useState('Class');
    const [time, setTime] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [points, setPoints] = useState(0);
    const submitPress = () => {
        const newEntry = `Activity: ${activity}, Time Spent: ${time} hours, Points Earned: ${points}`;
        setLog((prevLog) => [...prevLog, newEntry]);
        setPoints((prevPoints) => prevPoints + 1);
    };
    return (
        <View style={styles.container}>
            <Text>
                Completed:
            </Text>
            {log.map((entry, index) => (
                <Text key={index}>{entry}</Text>
            ))}
            <Text>
                Choose the activity you participated in:
            </Text>
            <Picker
                selectedValue={activity}
                onValueChange={(chosenActivity) => setActivity(chosenActivity)}> 
                <Picker.Item label="Class" value="Class"/>
                <Picker.Item label="Studying" value="Studying"/>
            </Picker>
            <Text>
                How much time did you spend? 
            </Text>
            <Slider
                step={0.25}
                minimumValue={0}
                maximumValue={12}
                value={time}
                onValueChange={(chosenTime) => setTime(chosenTime)}>

            </Slider>
            <Text>
                {time} hours
            </Text>
            <Button
                title="Submit"
                onPress={submitPress}/>

            <View style={styles.buttonStyle}>
                <Button title="Home" onPress={() => navigation.navigate('Home')}/>
                <Button title="Input" onPress={() => navigation.navigate('Input')}/>
                <Button title="Leaderboard" onPress={() => navigation.navigate('Leader')}/>
                <Button title="Profile" onPress={() => navigation.navigate('Profile')}/>
            </View>
        </View>
    );

    // let onPressReturn = (
    //     <View style={styles.center}>
    //         {log.map((entry, index) => (
    //             <Text key={index}>{entry}</Text>
    //         ))}
    //     </View>
    // );
}