import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [nearestGORs, setNearestGORs] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const firebaseConfig = {
    apiKey: 'AIzaSyDkMUXWfC2XQDLLvyEm8vNLkkn7xfMPQjE',
    authDomain: 'cari-gor-dfe83.firebaseapp.com',
    databaseURL: 'https://cari-gor-dfe83-default-rtdb.firebaseio.com',
    projectId: 'cari-gor-dfe83',
    storageBucket: 'cari-gor-dfe83.appspot.com',
    messagingSenderId: '869626611045',
    appId: '1:869626611045:web:1f87ade1a87e70cdced19d',
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  const database = getDatabase(app);

  // Hitung jarak menggunakan Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius bumi dalam km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const getNearestGORs = async () => {
      try {
        // Minta izin lokasi
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          return;
        }

        // Dapatkan lokasi pengguna
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        console.log(`User Location: ${location.coords.latitude}, ${location.coords.longitude}`);

        // Fetch GOR dari Firebase
        const pointsRef = ref(database, 'points');
        onValue(
          pointsRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const gorArray = Object.entries(data).map(([key, value]: [string, any]) => {
                // Parse koordinat dari string "lat,lon" menjadi numerik
                // Coba field 'coordinate' atau 'coordinates'
                const coordinateStr = value.coordinates;
                const coords = typeof coordinateStr === 'string' 
                  ? coordinateStr.split(',').map((c: string) => parseFloat(c.trim()))
                  : [0, 0];

                return {
                  id: key,
                  ...value,
                  latitude: coords[0],
                  longitude: coords[1],
                };
              });

              // Hitung jarak setiap GOR
              const gorWithDistance = gorArray.map((gor: any) => {
                const distance = calculateDistance(
                  location.coords.latitude,
                  location.coords.longitude,
                  gor.latitude,
                  gor.longitude
                );
                return {
                  ...gor,
                  distance,
                };
              });

              // Urutkan berdasarkan jarak dan ambil 3 terdekat
              const sorted = gorWithDistance
                .sort((a: any, b: any) => a.distance - b.distance)
                .slice(0, 3);

              setNearestGORs(sorted);
              setLoading(false);
            }
          },
          (error) => {
            console.error('Firebase error:', error);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Location error:', error);
        setLoading(false);
      }
    };

    getNearestGORs();
  }, []);

  const quotes = [
    {
      icon: 'heart',
      title: 'Kesehatan Jantung',
      text: 'Olahraga yang menggunakan raket seperti bulutangkis dan tenis ampuh menurunkan risiko kematian dini akibat penyakit kardiovaskular hingga 47%. (British Journal of Sports Medicine)',
      color: '#ff6b6b',
    },
    {
      icon: 'brain',
      title: 'Kesehatan Mental',
      text: 'Bermain bulutangkis secara rutin dapat mengurangi stres dan meningkatkan mood.',
      color: '#4299e1',
    },
    {
      icon: 'users',
      title: 'Sosial & Komunitas',
      text: 'Bulutangkis adalah olahraga tim yang membangun hubungan sosial dan kebersamaan.',
      color: '#25D366',
    },
  ];

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <ThemedView style={styles.heroBanner}>
        <Image source={require('@/assets/images/badminton.png')} style={styles.heroImage} />
        <ThemedText style={styles.heroTitle}>Selamat Datang di cariGOR</ThemedText>
        <ThemedText style={styles.heroSubtitle}>Temukan lapangan bulutangkis terbaik di sekitarmu</ThemedText>
      </ThemedView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => router.push('/(tabs)/lokasi')}
        >
          <FontAwesome5 name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
          <ThemedText style={styles.buttonText}>Cari GOR</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => router.push('/(tabs)/mapwebview')}
        >
          <FontAwesome5 name="map" size={18} color="#0a84ff" style={{ marginRight: 8 }} />
          <ThemedText style={[styles.buttonText, { color: '#0a84ff' }]}>Lihat Peta</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Nearest GORs Section */}
      <View style={styles.nearestSection}>
        <ThemedText style={styles.sectionTitle}>GOR Terdekat Dari Lokasi Anda</ThemedText>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a84ff" />
            <ThemedText style={styles.loadingText}>Mencari GOR terdekat...</ThemedText>
          </View>
        ) : nearestGORs.length > 0 ? (
          nearestGORs.map((gor: any, index: number) => (
            <View key={gor.id} style={styles.nearestGORCard}>
              <View style={styles.nearestGORIndex}>
                <ThemedText style={styles.nearestGORIndexText}>{index + 1}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.nearestGORName}>{gor.name}</ThemedText>
                <ThemedText style={styles.nearestGORDistance}>
                  <FontAwesome5 name="map-marker-alt" size={12} color="#ff6b6b" /> {gor.distance.toFixed(2)} km
                </ThemedText>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyNearestContainer}>
            <FontAwesome5 name="location-arrow" size={40} color="#ccc" />
            <ThemedText style={styles.emptyNearestText}>Tidak dapat mengakses lokasi Anda</ThemedText>
            <ThemedText style={styles.emptyNearestSubtext}>Aktifkan GPS untuk melihat GOR terdekat</ThemedText>
          </View>
        )}
      </View>

      {/* Info Section */}
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.sectionTitle}>Mengapa Bulutangkis?</ThemedText>
        <ThemedText style={styles.infoText}>
          Bulutangkis adalah olahraga yang menyenangkan, mudah dipelajari, dan memiliki banyak manfaat kesehatan untuk semua usia.
        </ThemedText>
      </ThemedView>

      {/* Research Quotes */}
      <View style={styles.quotesContainer}>
        <ThemedText style={styles.sectionTitle}>Manfaat Kesehatan</ThemedText>
        {quotes.map((quote, index) => (
          <ThemedView key={index} style={styles.quoteCard}>
            <View style={[styles.iconCircle, { backgroundColor: quote.color + '20' }]}>
              <FontAwesome5 name={quote.icon} size={24} color={quote.color} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.quoteTitle}>{quote.title}</ThemedText>
              <ThemedText style={styles.quoteText}>{quote.text}</ThemedText>
            </View>
          </ThemedView>
        ))}
      </View>

      {/* Stats Section - REMOVED FOR NEAREST GORs */}



      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroBanner: {
    backgroundColor: '#0a84ff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 9,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#e0f0ff',
    textAlign: 'center',
  },
  heroImage: {
    width: 92,
    height: 92,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#0a84ff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0a84ff',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  infoSection: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  quotesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quoteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    color: '#000',
  },
  quoteText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0a84ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  // Styles untuk Nearest GORs Section
  nearestSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  nearestGORCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#0a84ff',
  },
  nearestGORIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0a84ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearestGORIndexText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  nearestGORName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  nearestGORDistance: {
    fontSize: 12,
    color: '#ff6b6b',
  },
  emptyNearestContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyNearestText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptyNearestSubtext: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 4,
  },
  ctaSection: {
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: '#0a84ff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    color: '#e0f0ff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
