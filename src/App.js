import React, { useEffect, useState } from "react";

import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";

import { format } from "timeago.js";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser]= useState(null);
  const [pins, setPins] = useState([]);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
 
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace]= useState(null);
  const [viewport, setViewport] = useState({
    latitude: 47,
    longitude: 15,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  const handleMarker = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,

    }
    try{
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);

    }catch(err){
      console.log(err)
    }
  }

  const handleAddClick = (e) => {
    

   
    const lat = e.lngLat.lat; 
    
   const long = e.lngLat.lng;

    setNewPlace({
      lat: lat,
      long: long,
    });
    console.log(e)
  };
  

  return (
    <Map
      initialViewState={{
        longitude: 15,
        latitude: 47,
        zoom: 5,
      }}

     
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      transitionDuration="200"
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ width: "100vw", height: "100vh" }}
     
      onDblClick={handleAddClick}
    >
      {pins.map((p) => (
        <>
          <Marker latitude={p.lat} longitude={p.long}
          >
            <Room
              style={{  fontSize: "5em", color: currentUsername === p.username ? "tomato" : "slateblue", cursor: "pointer" }}
              onClick={() => handleMarker(p._id, p.lat, p.long)}
            />
          </Marker>
          {p._id === currentPlaceId && (
            <Popup
            key={p._id}
              longitude={p.long}
              latitude={p.lat}
              anchor="left"
              closeButton={true}
                closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                 
                {Array(p.rating).fill(<Star className="star" />)}
                 
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
        </>
      ))}
      {newPlace && (

     
      <Popup
              longitude={newPlace.long}
              latitude={newPlace.lat}
              anchor="left"
              closeButton={true}
                closeOnClick={false}
              onClose={() => setNewPlace(null)}
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)} />                 
                   <label>Review</label>
                   <textarea  placeholder="Say something about the place" onChange={(e)=>setDesc(e.target.value)}/>
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)} >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                <button className="submitBttn" type="submit">Add Pin</button>
                </form>
              </div>
            </Popup>
            )}
            {currentUsername ? (<button className="button logout" onClick={handleLogout}>Log out</button>) :
             ( <div className="buttons">
             <button className="button login" onClick={()=>setShowLogin(true)}>Log in</button>
             <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
             </div>)}
            
           {showRegister && <Register  setShowRegister={setShowRegister}/>}
           {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUsername={setCurrentUsername} />}
    </Map>
  );
}


export default App;
