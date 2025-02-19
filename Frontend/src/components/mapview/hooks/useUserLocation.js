    // hooks/useUserLocation.js
    import { useState, useEffect } from 'react';

    export function useUserLocation(defaultCenter = [-34.6037, -58.3816]) {
    const [position, setPosition] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        setError(true);
        setLoading(false);
        return;
        }

        navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude, longitude, accuracy } = pos.coords;
            setPosition([latitude, longitude]);
            setAccuracy(accuracy);
            setLoading(false);
        },
        err => {
            console.error('Error getting location:', err);
            setError(true);
            setLoading(false);
        }
        );
    }, []);

    // Si no hay posición (o error), devolvemos el center por defecto
    const center = position || defaultCenter;

    return { center, position, accuracy, error, loading };
    }
