import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, RefreshControl, SectionList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// get route from useRouter
const router = useRouter();

export default function LokasiScreen() {
    const [sections, setSections] = useState<{ title: string; data: any[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [allData, setAllData] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handlePress = (coordinates) => {
        const [latitude, longitude] = coordinates.split(',').map(coord => coord.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const handleDelete = (id) => {
        if (Platform.OS === 'web') {
            if (confirm("Apakah Anda yakin ingin menghapus GOR ini?")) {
                const pointRef = ref(db, `points/${id}`);
                remove(pointRef);
            }
        } else {
            Alert.alert(
                "Hapus GOR",
                "Apakah Anda yakin ingin menghapus GOR ini?",
                [
                    {
                        text: "Batal",
                        style: "cancel"
                    },
                    {
                        text: "Hapus",
                        onPress: () => {
                            const pointRef = ref(db, `points/${id}`);
                            remove(pointRef);
                        },
                        style: "destructive"
                    }
                ]
            );
        }
    }

    const handleEdit = (item) => {
        router.push({
            pathname: "/formeditlocation",
            params: {
                id: item.id,
                name: item.name,
                price: item.price || '',
                contact: item.contact || '',
                coordinates: item.coordinates,
                accuration: item.accuration || ''
            }
        });
    };

    const getFilteredSections = () => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) {
            return allData.length > 0 ? [{ title: "Lokasi Tersimpan", data: allData }] : [];
        }

        const matched = allData.filter(item => item.name && item.name.toLowerCase().includes(q));
        const others = allData.filter(item => !(item.name && item.name.toLowerCase().includes(q)));

        // Put matched items first, then the rest
        const ordered = [...matched, ...others];
        return ordered.length > 0 ? [{ title: `Hasil Pencarian (${matched.length})`, data: ordered }] : [];
    };



    useEffect(() => {
        const pointsRef = ref(db, "points/");

        // Listen for data changes
        const unsubscribe = onValue(
            pointsRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Transform the Firebase object into an array
                    const pointsArray = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));

                    // Keep raw array for searching and ordering
                    setAllData(pointsArray);

                    // Format for SectionList (default view)
                    const formattedData = [
                        {
                            title: "GOR Tersimpan",
                            data: pointsArray,
                        },
                    ];
                    setSections(formattedData);
                } else {
                    setSections([]);
                }
                setLoading(false);
            },
            (error) => {
                console.error(error);
                setLoading(false);
            }
        );

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Since Firebase provides real-time data, we can simulate a refresh
        // for UX purposes. A real data refetch isn't strictly necessary unless
        // you want to force a re-read from the server.
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={16} color="#666" style={styles.searchIcon} />
                <TextInput
                    placeholder="Cari GOR..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    returnKeyType="search"
                />
            </View>
            {sections.length > 0 ? (
                <SectionList
                    sections={getFilteredSections()}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <TouchableOpacity style={styles.itemContent} onPress={() => handlePress(item.coordinates)}>
                                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                <ThemedText style={styles.itemPrice}>Rp{item.price || '-'}/jam</ThemedText>
                                
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                                <FontAwesome5 name="edit" size={20} color="#ffb10aff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                                <FontAwesome5 name="trash" size={20} color="red" />
                            </TouchableOpacity>
                        </View>

                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <ThemedText style={styles.header}>{title}</ThemedText>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }

                />
            ) : (
                <ThemedView style={styles.container}>
                    <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
                </ThemedView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
container: {
flex: 1,
paddingTop: 22,
backgroundColor: '#f5f5f5',
},
searchContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#fff',
marginHorizontal: 16,
marginVertical: 12,
paddingHorizontal: 12,
paddingVertical: 8,
borderRadius: 12,
borderWidth: 1,
borderColor: '#e0e0e0',
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 4,
elevation: 2,
},
searchIcon: { marginRight: 8 },
searchInput: { flex: 1, fontSize: 16, color: '#000' },
item: {
backgroundColor: '#fff',
padding: 12,
marginVertical: 6,
marginHorizontal: 16,
borderRadius: 12,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.1,
shadowRadius: 3,
elevation: 2,
borderLeftWidth: 4,
borderLeftColor: '#0a84ff',
},
itemContent: { flex: 1, paddingRight: 10 },
itemName: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 4 },
itemPrice: { fontSize: 14, fontWeight: '600', color: '#d4680f', marginBottom: 4 },
itemCoords: { fontSize: 12, color: '#666' },
actionButtons: { flexDirection: 'row' },
editButton: {
padding: 8,
borderRadius: 8,
backgroundColor: '#e3f2fd',
justifyContent: 'center',
alignItems: 'center',
marginRight: 8,
},
deleteButton: {
padding: 8,
borderRadius: 8,
backgroundColor: '#ffebee',
justifyContent: 'center',
alignItems: 'center',
},
header: {
fontSize: 18,
fontWeight: '700',
backgroundColor: '#0a84ff',
color: '#fff',
paddingVertical: 12,
paddingHorizontal: 16,
marginTop: 8,
marginBottom: 8,
borderRadius: 8,
marginHorizontal: 16,
},
emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
emptyText: { fontSize: 16, color: '#999', marginTop: 12, textAlign: 'center' },
});