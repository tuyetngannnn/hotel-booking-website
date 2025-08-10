import React, { useEffect } from 'react';
import HotelMarker from '../../assets/Icons/location_marker.png';
import './Map.css'

const Map = () => {
    const initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: { lat: 10.80920706651552, lng: 106.66495988213573 },
            restriction: {
                latLngBounds: {
                    north: 11.2,
                    south: 10.3,
                    east: 107.2,
                    west: 105.8,
                },
                strictBounds: false
            }
        });

        const locations = [
            { lat: 10.80920706651552, lng: 106.66495988213573, title: "32 Trường Sơn, Phường 2, Quận Tân Bình, Thành phố Hồ Chí Minh, Việt Nam." },
            { lat: 10.77606853048206, lng: 106.66737083410698, title: "828 Sư Vạn Hạnh, Phường 13, Quận 10, Thành phố Hồ Chí Minh, Việt Nam." },
            { lat: 10.865683136636582, lng: 106.6006264956298, title: "806 QL22, ấp Mỹ Hoà 3, Quận Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam." },
        ];

        const hotelIconUrl = HotelMarker;
        let currentInfoWindow = null;

        locations.forEach((location) => {
            const marker = new window.google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                title: location.title,
                icon: hotelIconUrl,
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: location.title,
            });

            const openDirections = () => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
                window.open(url, '_blank');
            };

            marker.addListener('click', () => {
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }

                infoWindow.open(map, marker);
                currentInfoWindow = infoWindow;
                openDirections();
            });
        });
    };

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAJ1toNeB0qo2JECFMJUhyjvQlJSBKmCU&callback=initMap`;
            script.async = true;
            script.defer = true;
            window.initMap = initMap;
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();

        return () => {
            if (window.google && window.google.maps) {
                delete window.google.maps;
            }
        };
    }, []);

    return <div id="map" className='maphotel' />;
};

export default Map;
