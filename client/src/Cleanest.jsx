import React, { useState, useEffect } from 'react';

export default function Cleanest() {
    const [poles, setPoles] = useState(null);
    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://localhost:4242/sr');
                const data = await response.json();

                const availableStations = data.filter((data) => {
                    return data.status == 'Available';
                });

                setPoles(availableStations);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://localhost:4242/em');
                const data = await response.json();

                setForecast(data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        console.log(poles);
    }, [poles]);

    useEffect(() => {
        console.log(forecast);
    }, [forecast]);

    return <div>Cleanest</div>;
}
