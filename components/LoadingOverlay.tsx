import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LoadingOverlay({ visible, text }: { visible: boolean; text?: string }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <LottieView
                        source={require('@/assets/lottie/shuttlecock.json')}
                        autoPlay
                        loop
                        renderMode="HARDWARE"
                        style={styles.animation}
                    />
                    {text && <Text style={styles.text}>{text}</Text>}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: 200,
        paddingVertical: 32,
        paddingHorizontal: 32,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',

        // Android shadow
        elevation: 10,

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    animation: {
        width: 140,
        height: 140,
    },
    text: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#0a84ff',
        textAlign: 'center',
    },
});
