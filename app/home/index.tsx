import React from 'react';
import { Text, View } from "react-native";



// const styles= StyleSheet.create({
//   center:{
//     alignItems: 'center',
//   },
//   container:{
//     flex:1,
//     padding:25,
//   }
// });

// function HomeScreen() {
//     const navigation = useNavigation();
// };

export default function Index() {
    return (
        <View>
            <Text>Accomplishments:</Text>
            
            
        </View>
    );
}

// export default function Index() {
//     const [activity, setActivity] = useState('Class');
//     const [time, setTime] = useState(0);
//     const [log, setLog] = useState<string[]>([]);
//     const[points, setPoints] = useState(0);
//     const submitPress = () => {
//         const newEntry = `Activity: ${activity}, Time Spent: ${time} hours, Points Earned: ${points}`;
//         setLog((prevLog) => [...prevLog, newEntry]);
//         setPoints((prevPoints) => prevPoints + 1);
//     };
//     return (
//         <View style={styles.container}>
//             <Text>
//                 Completed:
//             </Text>
//             {log.map((entry, index) => (
//                 <Text key={index}>{entry}</Text>
//             ))}
//             <Text>
//                 Choose the activity you participated in:
//             </Text>
//             <Picker
//                 selectedValue={activity}
//                 onValueChange={(chosenActivity) => setActivity(chosenActivity)}> 
//                 <Picker.Item label="Class" value="Class"/>
//                 <Picker.Item label="Studying" value="Studying"/>
//             </Picker>
//             <Text>
//                 How much time did you spend? 
//             </Text>
//             <Slider
//                 step={0.25}
//                 minimumValue={0}
//                 maximumValue={12}
//                 value={time}
//                 onValueChange={(chosenTime) => setTime(chosenTime)}>

//             </Slider>
//             <Text>
//                 {time} hours
//             </Text>
//             <Button
//                 title="Submit"
//                 onPress={submitPress}/>
//         </View>
//     );
// }
 