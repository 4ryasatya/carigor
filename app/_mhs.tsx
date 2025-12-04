import React from 'react';
import { StyleSheet, Text, View, SectionList, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const DATA = [
    {
        title: 'Kelas A',
        data: ['Pizza', 'Burger', 'Risotto'],
    },
    {
        title: 'Kelas B',
        data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
    },
    {
        title: 'Dosen',
        data: ['Water', 'Coke', 'Beer'],
    },
    {
        title: 'Asisten',
        data: ['Cheese Cake', 'Ice Cream'],
    },
];

const App = () => (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>
                            <FontAwesome5 name="user-astronaut" size={15} color="black" />
                            {item}
                        </Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
            />
        </SafeAreaView>
    </SafeAreaProvider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    item: {
        backgroundColor: '#d4dbd9ff',
        padding: 5,
        marginVertical: 8,
        borderRadius: 10,
    },
    header: {
        fontSize: 25,
        fontFamily: 'Arial',
        padding: 10,
        backgroundColor: '#3ef0f9ff',
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
    },
});

export default App;