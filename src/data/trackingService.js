import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'user_tracking_logs';

export const logVisit = async () => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            type: 'visit',
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            path: window.location.pathname,
            referrer: document.referrer || 'direct',
        });
        console.log('Visit logged');
    } catch (e) {
        console.error('Error logging visit: ', e);
    }
};

export const logAction = async (actionType, details = {}) => {
    try {
        const location = await getUserLocation(); // Try to get location if possible

        await addDoc(collection(db, COLLECTION_NAME), {
            type: 'action',
            actionType: actionType, // 'call_click', 'booking_click', 'contact_submit'
            details: details,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            page: window.location.pathname,
            location: location || 'permission_denied_or_unavailable'
        });
        console.log(`Action ${actionType} logged`);
    } catch (e) {
        console.error(`Error logging action ${actionType}: `, e);
    }
};

const getUserLocation = () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            () => {
                resolve(null);
            }
        );
    });
};
