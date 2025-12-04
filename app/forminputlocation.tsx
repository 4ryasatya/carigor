import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [contact, setContact] = useState('');
    const [location, setLocation] = useState('');
    const [accuration, setAccuration] = useState('');
    const [loading, setLoading] = useState(false);

    const getCoordinates = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }


        let location = await Location.getCurrentPositionAsync({});
        const coords = location.coords.latitude + ',' + location.coords.longitude;
        setLocation(coords);


        const accuracy = location.coords.accuracy;
        setAccuration(accuracy + ' m');
    };


    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyAY0LyfLwUDtbAjjSZw_wPGgZ_-U9ZuOdU",
        authDomain: "pgpbl-react-native.firebaseapp.com",
        databaseURL: "https://pgpbl-react-native-default-rtdb.firebaseio.com",
        projectId: "pgpbl-react-native",
        storageBucket: "pgpbl-react-native.firebasestorage.app",
        messagingSenderId: "464134735159",
        appId: "1:464134735159:web:e3ea55dc8c08215920c6b2",
        measurementId: "G-LBD1MNSHQM"
    };

    // Initialize Firebase (guard against duplicate initialization)
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getDatabase(app);

    return (
        <SafeAreaProvider style={{ backgroundColor: '#f5f5f5' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack.Screen options={{ title: 'Tambahkan Lokasi GOR' }} />
                {/* Loading Modal */}
                <Modal transparent visible={loading} animationType="fade">
                    <View style={styles.loadingOverlay}>
                        <View style={styles.loadingContainer}>
                            <LottieView
                                source={require('@/assets/lottie/shuttlecock.json')}
                                autoPlay
                                loop
                                style={styles.lottieAnimation}
                            />
                            <Text style={styles.loadingText}>Menyimpan data...</Text>
                        </View>
                    </View>
                </Modal>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <FontAwesome5 name="plus-circle" size={28} color="#0a84ff" />
                        <Text style={styles.headerTitle}>Tambah Lokasi GOR</Text>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Nama GOR</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Isikan nama GOR'
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#bbb"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Harga Sewa / Jam (Rp)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Contoh: 50000'
                                value={price}
                                onChangeText={setPrice}
                                keyboardType='numeric'
                                placeholderTextColor="#bbb"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Nomor Handphone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Contoh: 08123456789'
                                value={contact}
                                onChangeText={setContact}
                                keyboardType='phone-pad'
                                placeholderTextColor="#bbb"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Koordinat</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: -6.200000,106.816666"
                                value={location}
                                onChangeText={setLocation}
                                placeholderTextColor="#bbb"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputTitle}>Akurasi</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Akurasi lokasi akan muncul di sini"
                                value={accuration}
                                onChangeText={setAccuration}
                                editable={false}
                                placeholderTextColor="#bbb"
                            />
                        </View>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity style={styles.getLocationButton} onPress={getCoordinates}>
                        <FontAwesome5 name="location-arrow" size={18} color="#fff" />
                        <Text style={styles.getLocationButtonText}>Dapatkan Lokasi Saat Ini</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            setLoading(true);
                            const locationsRef = ref(db, 'points/');
                            push(locationsRef, {
                                name: name,
                                price: price,
                                contact: contact,
                                coordinates: location,
                                accuration: accuration,
                            }).then(() => {
                                setTimeout(() => {
                                    setLoading(false);
                                    Alert.alert('Sukses', 'Lokasi GOR berhasil ditambahkan!', [
                                        { text: 'OK', onPress: () => {
                                            setName('');
                                            setPrice('');
                                            setContact('');
                                            setLocation('');
                                            setAccuration('');
                                        }}
                                    ]);
                                }, 2000);
                            }).catch((e) => {
                                setLoading(false);
                                console.error("Error adding document: ", e);
                                Alert.alert("Error", "Gagal menyimpan data");
                            });
                        }}
                    >
                        <FontAwesome5 name="save" size={18} color="#fff" />
                        <Text style={styles.saveButtonText}>Simpan</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 18,
    },
    inputTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    input: {
        height: 50,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#000',
        backgroundColor: '#f9f9f9',
    },
    getLocationButton: {
        backgroundColor: '#25D366',
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 12,
        shadowColor: '#25D366',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    getLocationButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    saveButton: {
        backgroundColor: '#0a84ff',
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#0a84ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    lottieAnimation: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0a84ff',
        textAlign: 'center',
    },
});


export default App;