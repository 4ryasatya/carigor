import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [gorCount, setGorCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getDatabase(app);

  useEffect(() => {
    const pointsRef = ref(db, "points/");
    const unsubscribe = onValue(pointsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const points = Object.keys(data);
        setGorCount(points.length);
        const total = points.reduce((sum, key) => {
          const price = parseInt(data[key].price) || 0;
          return sum + price;
        }, 0);
        setTotalPrice(total);
      } else {
        setGorCount(0);
        setTotalPrice(0);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Header Section */}
      <ThemedView style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="user-circle" size={80} color="#0a84ff" />
        </View>
        <ThemedText style={styles.userName}>Demas Aryasatya</ThemedText>
        <ThemedText style={styles.subtitle}>GOR Enthusiast • Atlet Kalcer</ThemedText>
      </ThemedView>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        {/* Total GOR Visited */}
        <ThemedView style={styles.statCard}>
          <FontAwesome5 name="map-marker-alt" size={24} color="#0a84ff" style={{ marginBottom: 8 }} />
          <ThemedText style={styles.statValue}>{gorCount}</ThemedText>
          <ThemedText style={styles.statLabel}>GOR Tersimpan</ThemedText>
        </ThemedView>

        {/* Badge */}
        <ThemedView style={styles.statCard}>
          <FontAwesome5 name="medal" size={24} color="#FFD700" style={{ marginBottom: 8 }} />
          <ThemedText style={styles.statValue}>Owner GOR</ThemedText>
          <ThemedText style={styles.statLabel}>Status</ThemedText>
        </ThemedView>

        {/* GOR Termurah */}
        <ThemedView style={styles.statCard}>
          <FontAwesome5 name="tag" size={24} color="#d4680f" style={{ marginBottom: 8 }} />
          <ThemedText style={styles.statValue}>Pogung Lor</ThemedText>
          <ThemedText style={styles.statLabel}>GOR Termurah</ThemedText>
        </ThemedView>


      </View>

      {/* Last Visited Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Terakhir Dikunjungi</ThemedText>
        <View style={styles.activityCard}>
          <FontAwesome5 name="location-arrow" size={16} color="#0a84ff" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.activityTitle}>GSG Pogung Lor</ThemedText>
            <ThemedText style={styles.activitySubtitle}>Rp50.000 per 3 jam</ThemedText>
          </View>
        </View>
        <View style={styles.activityCard}>
          <FontAwesome5 name="location-arrow" size={16} color="#4299e1" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.activityTitle}>GOR Area</ThemedText>
            <ThemedText style={styles.activitySubtitle}>Rp75.000 per jam</ThemedText>
          </View>
        </View>
        <View style={styles.activityCard}>
          <FontAwesome5 name="location-arrow" size={16} color="#25D366" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.activityTitle}>GOR Purbayan</ThemedText>
            <ThemedText style={styles.activitySubtitle}>Rp20.000 per jam</ThemedText>
          </View>
        </View>
        <View style={[styles.activityCard, { borderBottomWidth: 0 }]}>
          <FontAwesome5 name="location-arrow" size={16} color="#ff6b6b" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.activityTitle}>GOR Lembah UGM</ThemedText>
            <ThemedText style={styles.activitySubtitle}>Rp35.000 per jam</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* About Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Tentang Aplikasi</ThemedText>
        <ThemedText style={styles.aboutText}>
          cariGOR adalah aplikasi untuk menemukan dan memesan lapangan bulutangkis terdekat. Nikmati pengalaman bermain bulutangkis yang lebih mudah!
        </ThemedText>
        <ThemedText style={styles.versionText}>Versi 1.0.0</ThemedText>
        
        {/* Social Links */}
        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/demas-wistaryasatya/')}
          >
            <FontAwesome5 name="linkedin" size={20} color="#0A66C2" />
            <ThemedText style={styles.socialText}>LinkedIn</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => Linking.openURL('https://github.com/4ryasatya')}
          >
            <FontAwesome5 name="github" size={20} color="#333" />
            <ThemedText style={styles.socialText}>GitHub</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 50,
    padding: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#0a84ff',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  sectionContainer: {
    marginHorizontal: 12,
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  activityCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
});
