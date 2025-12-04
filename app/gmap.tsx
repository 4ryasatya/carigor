import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import MapView, { Callout, Marker } from 'react-native-maps';


// Your web app's Firebase configuration
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


interface Marker {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    price?: string;
    contact?: string;
}

export default function MapScreen() {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const pointsRef = ref(db, 'points/');

        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedMarkers = Object.keys(data)
                    .map(key => {
                        const point = data[key];
                        // Ensure coordinates is a string and not empty
                        if (typeof point.coordinates !== 'string' || point.coordinates.trim() === '') {
                            return null;
                        }
                        const [latitude, longitude] = point.coordinates.split(',').map(Number);

                        // Validate that parsing was successful
                        if (isNaN(latitude) || isNaN(longitude)) {
                            console.warn(`Invalid coordinates for point ${key}:`, point.coordinates);
                            return null;
                        }


                        return {
                            id: key,
                            name: point.name,
                            latitude,
                            longitude,
                            price: point.price || '',
                            contact: point.contact || '',
                        };
                    })
                    .filter(Boolean) as Marker[]; // Filter out any null entries from invalid data


                setMarkers(parsedMarkers);
            } else {
                setMarkers([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });


        return () => unsubscribe();
    }, []);


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Loading map data...</Text>
            </View>
        );
    }


    // Render the map on native platforms
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -7.7956, // Initial center (e.g., Yogyakarta)
                    longitude: 110.3695,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.01,
                }}
                zoomControlEnabled={true}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    >
                        <Callout>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{marker.name}</Text>
                                {marker.price ? (
                                    <Text style={styles.calloutPrice}>Rp {marker.price}/jam</Text>
                                ) : null}
                                <Text style={styles.calloutCoords}>{`${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}`}</Text>
                                {marker.contact ? (
                                    <TouchableOpacity
                                        style={styles.calloutContactButton}
                                        onPress={async () => {
                                            let raw = marker.contact || '';
                                            let phone = raw.replace(/\D/g, '');
                                            if (phone.startsWith('0')) phone = '62' + phone.slice(1);
                                            if (!phone.startsWith('62')) phone = '62' + phone;
                                            const appUrl = `whatsapp://send?phone=${phone}`;
                                            const webUrl = `https://wa.me/${phone}`;
                                            try {
                                                const canOpen = await Linking.canOpenURL(appUrl);
                                                if (canOpen) await Linking.openURL(appUrl);
                                                else await Linking.openURL(webUrl);
                                            } catch (e) {
                                                console.error('Cannot open WhatsApp', e);
                                                Alert.alert('Error', 'Tidak dapat membuka WhatsApp');
                                            }
                                        }}
                                    >
                                        <FontAwesome name="phone" size={18} color="#25D366" />
                                        <Text style={styles.calloutContactText}>Hubungi via WhatsApp</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/forminputlocation')}>
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        left: 20,
        bottom: 20,
        backgroundColor: '#0275d8',
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    callout: {
        width: 220,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    calloutTitle: {
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 4,
    },
    calloutPrice: {
        fontWeight: '600',
        fontSize: 13,
        color: '#d4680f',
        marginBottom: 4,
    },
    calloutCoords: {
        fontSize: 11,
        color: '#666',
        marginBottom: 8,
    },
    calloutContactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginTop: 4,
    },
    calloutContactText: {
        marginLeft: 8,
        color: '#25D366',
        fontWeight: '600',
        fontSize: 12,
    },
});