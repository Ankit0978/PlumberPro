import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'user_tracking_logs';

const fetchIpAndLocation = async () => {
    try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        // Get coarse location based on IP
        const locRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const locData = await locRes.json();

        return {
            ip,
            city: locData.city,
            region: locData.region,
            country: locData.country_name,
            ip_lat: locData.latitude,
            ip_lng: locData.longitude
        };
    } catch (e) {
        console.warn('Failed to fetch IP/Location:', e);
        return null;
    }
};

const getUserName = () => {
    try {
        const userStr = localStorage.getItem('plumber_current_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.name || 'Guest';
        }
    } catch (e) { }
    return 'Guest';
};

export const logVisit = async () => {
    try {
        const ipData = await fetchIpAndLocation();
        const gpsLocation = await getUserLocation(); // Try getting GPS if permission exists
        const userName = getUserName();

        await addDoc(collection(db, COLLECTION_NAME), {
            type: 'visit',
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            path: window.location.pathname,
            referrer: document.referrer || 'direct',
            ip: ipData?.ip || 'unknown',
            ipLocation: ipData ? `${ipData.city}, ${ipData.region}, ${ipData.country}` : 'unknown',
            location: gpsLocation || (ipData ? { lat: ipData.ip_lat, lng: ipData.ip_lng, type: 'IP-based' } : 'unavailable'),
            userName: userName
        });
        console.log('Visit logged');
    } catch (e) {
        console.error('Error logging visit: ', e);
    }
};

export const logAction = async (actionType, details = {}, manualName = null) => {
    try {
        const gpsLocation = await getUserLocation(); // Precise GPS
        const ipData = await fetchIpAndLocation();   // IP Fallback
        const userName = manualName || getUserName();

        await addDoc(collection(db, COLLECTION_NAME), {
            type: 'action',
            actionType: actionType,
            details: details,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            page: window.location.pathname,
            location: gpsLocation || (ipData ? { lat: ipData.ip_lat, lng: ipData.ip_lng, type: 'IP-based' } : 'unavailable'),
            ip: ipData?.ip || 'unknown',
            ipLocation: ipData ? `${ipData.city}, ${ipData.region}, ${ipData.country}` : 'unknown',
            userName: userName
        });
        console.log(`Action ${actionType} logged for ${userName}`);
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
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    source: 'GPS'
                });
            },
            () => {
                resolve(null);
            }
        );
    });
};
