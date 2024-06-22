import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";
import "./App.css";

const googleMapsApiKey = 'ADD_YOUR_API_KEY';

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100%",
};

const App = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [response, setResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [error, setError] = useState("");

  const originRef = useRef(null);
  const destinationRef = useRef(null);
 

  const handlePlaceChanged = (ref, setState) => {
    const place = ref.current.getPlace();
    if (place && place.formatted_address) {
      setState(place.formatted_address);
    }
  };

  

  const calculateRoute = () => {
    if (origin !== "" && destination !== "") {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setResponse(result);
            setDistance(result.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000);
            setError("");
          } else {
            setError(`Error fetching directions: ${status}`);
            setResponse(null);
          }
        }
      );
    } else {
      setError("Please enter both origin and destination.");
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries}
    >
    <img src="logo.png" alt="Graviti" className="logo" />
    <p className="title">Let's calculate <b>&nbsp;distance&nbsp;</b>  from Google maps</p>

      <div className="app-container">
        <div className="left-container">
          <div className="input-container">
           
            <div className="input-group">
              <label htmlFor="originInput">Origin</label>
              <Autocomplete
                onLoad={(autocomplete) => (originRef.current = autocomplete)}
                onPlaceChanged={() => handlePlaceChanged(originRef, setOrigin)}
              >
                <input
                  id="originInput"
                  type="text"
                  placeholder="Enter origin"
                />
              </Autocomplete>
            </div>
            <div className="input-group">
              <label htmlFor="destinationInput">Destination</label>
              <Autocomplete
                onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
                onPlaceChanged={() => handlePlaceChanged(destinationRef, setDestination)}
              >
                <input
                  id="destinationInput"
                  type="text"
                  placeholder="Enter destination"
                />
              </Autocomplete>
            </div>
            <button className="calculate-button" onClick={calculateRoute}>
              Calculate
            </button>
            {error && <p className="error-message">{error}</p>}
            {distance && (
              <div className="distance-container">
                
                <p className="distance-value"><strong className="strong"><b>Distance</b></strong>{distance} kms</p>
                <p>The Distance between <strong>{origin}</strong> and <strong>{destination}</strong> via the selected route is <strong>{distance}</strong> kms.</p>
              </div>
            )}
          </div>
        </div>
        <div className="right-container">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={6}
            center={{ lat: 20.5937, lng: 78.9629 }} // Center of India
          >
            {response !== null && (
              <DirectionsRenderer directions={response} />
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

export default App;
