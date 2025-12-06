import { useState, useEffect } from 'react';

export default function DeviceInfo() {
    const [deviceType, setDeviceType] = useState('');

    useEffect(() => {
        const userAgent = navigator.userAgent;
        let type = 'Desconhecido';

        if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
            type = 'Mobile';
        } else if (/Mac|Macintosh/i.test(userAgent)) {
            type = 'Mac';
        } else if (/Windows|Win32/i.test(userAgent)) {
            type = 'Windows';
        } else if (/Linux/i.test(userAgent)) {
            type = 'Linux';
        } else {
            type = 'Computador'; // Assume ‘desktop’ se não for mobile
        }

        setDeviceType(type);
    }, []);

    return deviceType;
}
