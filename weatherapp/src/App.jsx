import { useEffect, useState } from 'react'

import './App.css';
import PropTypes from "prop-types";
// Images
import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png"
import windIcon from "./assets/wind.png"
import snowIcon from "./assets/snow.png"
import humidityIcon from "./assets/humidity.png"



const WeatherDetails= ({icon,temp,city,country,lat,log,humidity,wind}) => {
  return(<>
    <div className='image'>
      <img src={icon} alt="Image" />
    </div>
    <div className="temp">{temp}°C
    </div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className='lat'>latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='log'>longitude</span>
        <span>{log}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt="humidity" className='icon'/>
        <div className="data">
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt="wind" className='icon'/>
        <div className="data">
          <div className="wind-percent">{wind} Km/h</div>
          <div className="text">wind Speed</div>
        </div>
      </div>
    </div>
    </>)
};


WeatherDetails.propTypes={
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity:PropTypes.number.isRequired,
}
function App() {
  // let api_key="62486a4d83c52cef515d90bf1b7a314f";
  const[text, setText]=useState("Chennai");

  const [icon, setIcon]=useState(snowIcon);
  const [temp, setTemp]=useState(0);
  const [city, setCity]=useState("Chennai");
  const [country, setCountry]=useState("IN");
  const [lat, setLat]=useState(0);
  const [log, setLog]=useState(0);
  const [humidity, setHumidity]=useState(0);
  const [wind, setWind]=useState(0);

  const[cityNotFound, setCityNotFound]=useState(false);
  const [loading, setLoading]=useState(false);
  const [error, setError]=useState(null);
  
  const weatherIconMap={
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    '02n':cloudIcon,
    "03d":cloudIcon,
    "03n":clearIcon,
    "04d":cloudIcon,
    "04n":cloudIcon,
    "09d":drizzleIcon,
    "09n":drizzleIcon,
    "10d":rainIcon,
    "13d":snowIcon,
    "11d":rainIcon,
    "11n":rainIcon,
    "13n":snowIcon,
  };
  
  const search=async ()=>{
    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=27adc638e851b6f98817a8259107093a`;

    try{
      let res = await fetch(url);
      let data =await res.json();
      // console.log(data)
      if (data.cod==="404"){
        console.error("City Not Found");
        setCityNotFound(true);
        setLat(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp - 273.15));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);

    }catch(error){
      console.error("An Error Occurred:",error.message);
      setError("An Error Occured While Fetching Data.");
    }finally{
      setLoading(false);
    }
  };

  const handleCity =(e)=>{
    setText(e.target.value);
  };
  const handleCityKeyDown=(e)=>{
    if (e.key ==="Enter"){
      search();
    }
  };
  useEffect(function(){
    search();
  },[]);
  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text"
          className='cityinput'
          placeholder='Search City' 
          onChange={handleCity}value={text} onKeyDown={handleCityKeyDown}/>
          <div className='search-icon'onClick={()=>search()}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>
        {!loading && !cityNotFound && !error&& <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}
        {loading && <div className='loading-message'>Loading...</div>}
       { error && <div className='error-message'>{error}</div>}
        {cityNotFound&&<div className="city-not-found">City Not Found</div>}
        <p className='copyright'>&copy;<span>raghul_codes</span></p>
        <p className="social">
        <a href="https://github.com/IamRaghul18" target='_blank'><i class="fab fa-github"></i></a>
        <a href="https://www.linkedin.com/in/raghulprasad-/"target='_blank' ><i class="fab fa-linkedin"></i></a>
        <a href="https://twitter.com/raghul_codes" target='_blank'><i class="fab fa-twitter"></i></a>
        <a href="https://raghul018-portfolio.netlify.app/" target='_blank'><i class="fas fa-globe"></i></a>
        <a href="https://www.instagram.com/iam_raghul18/?hl=en"target='_blank'><i class="fab fa-instagram"></i></a>
        <a href="mailto:rghlprsd@gmail.com"target='_blank'><i class="fas fa-envelope"></i></a>
        </p>
      </div>
      
    </>
  )
}

export default App
