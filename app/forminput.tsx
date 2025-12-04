import React from 'react';
import { StyleSheet, TextInput, Text, Button, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

const TextInputExample = () => {
    const [text, onChangeText] = React.useState('Useless Text');
    const [number, onChangeNumber] = React.useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Stack.Screen options={{ title: 'Form Input' }} />
                <Text style={styles.inputTitle}>Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    placeholder="Fill in your Name"
                // value={text}
                />
                <Text style={styles.inputTitle}>Student ID</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    placeholder="Fill in your Student ID"
                    keyboardType="numeric"
                />
                <Text style={styles.inputTitle}>Class</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    placeholder="Which class are you in?"
                    keyboardType="numeric"
                />
                <View style={styles.button}>
                    <Button
                        title='Send'
                    />
                </View>

            </SafeAreaView>
        </SafeAreaProvider>


    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
    },
    inputTitle: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 12,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 10,
        marginHorizontal: 12,
        overflow: 'hidden',
    },
});

export default TextInputExample;