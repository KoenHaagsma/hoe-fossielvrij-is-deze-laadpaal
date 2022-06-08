function getLocation() {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        switch (result.state) {
            case 'granted':
                console.log(result.state);
                break;
            case 'prompt':
                const setPosition = (position) => {
                    return { lat: position.coords.latitude, lng: position.coords.longitude };
                };

                const errorLocation = (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error('User denied the request for Geolocation.');
                            break;

                        case error.POSITION_UNAVAILABLE:
                            console.error('Location information is unavailable.');
                            break;

                        case error.TIMEOUT:
                            console.error('The request to get user location timed out.');
                            break;

                        case error.UNKNOWN_ERROR:
                            console.error('An unknown error occurred.');
                            break;
                    }
                };

                navigator.geolocation.getCurrentPosition(setPosition, errorLocation, {
                    enableHighAccuracy: true,
                });
                break;
            case 'denied':
                console.log(result.state);
                break;
        }
    });
}

export { getLocation };
