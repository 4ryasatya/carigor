import { FontAwesome5 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '@/components/LoadingOverlay';


const FormEditLocation = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name: initialName, price: initialPrice, contact: initialContact, coordinates: initialCoordinates, accuration: initialAccuration } = params;

    const [name, setName] = useState(initialName as string | undefined);
    const [price, setPrice] = useState(initialPrice as string | undefined);
    const [contact, setContact] = useState(initialContact as string | undefined);
    const [location, setLocation] = useState(initialCoordinates as string | undefined);
    const [accuration, setAccuration] = useState(initialAccuration as string | undefined);

    const [loading, setLoading] = useState(false);

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

    // Initialize Firebase
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getDatabase(app);

    // Alert success update
    const createOneButtonAlert = (callback: () => void) =>
        Alert.alert('Horee', 'Berhasil memperbarui data', [
            { text: 'OK', onPress: callback },
        ]);


    // Handle update
    const handleUpdate = () => {
        if (!id) {
            Alert.alert("Error", "ID lokasi tidak ditemukan.");
            return;
        }
        setLoading(true);
        const pointRef = ref(db, `points/${id}`);
        update(pointRef, {
            name: name,
            price: price,
            contact: contact,
            coordinates: location,
            accuration: accuration,
        }).then(() => {
            setTimeout(() => {
                setLoading(false);
                createOneButtonAlert(() => {
                    router.back();
                });
            }, 2000);
        }).catch((e) => {
            setLoading(false);
            console.error("Error updating document: ", e);
            Alert.alert("Error", "Gagal memperbarui data");
        });
    };

    return (
        <SafeAreaProvider style={{ backgroundColor: '#f5f5f5' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack.Screen options={{ title: 'Edit Lokasi' }} />
                
                <LoadingOverlay visible={loading} text="Menyimpan perubahan..." />

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <FontAwesome5 name="edit" size={28} color="#0a84ff" />
                        <Text style={styles.headerTitle}>Edit Lokasi GOR</Text>
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
                    </View>

                    {/* Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                        <FontAwesome5 name="save" size={18} color="#fff" />
                        <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
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
    // loadingOverlay: {
    //     flex: 1,
    //     backgroundColor: 'rgba(0, 0, 0, 0.6)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // loadingContainer: {
    //     backgroundColor: '#fff',
    //     borderRadius: 16,
    //     padding: 32,
    //     alignItems: 'center',
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 4 },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 8,
    //     elevation: 10,
    // },
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


export default FormEditLocation;