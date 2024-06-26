import fs from "fs";
import axios from "axios"

var LOC_API="http://ip-api.com/json";
var WEATHER_API="https://api.open-meteo.com/v1/forecast?";
const rawData=fs.readFileSync('WMO_code/descriptions.json')
const wmo_code=JSON.parse(rawData);

async function getIcon(ip){
    const location = await axios.get(LOC_API+`/${ip}`);
    const weather= await axios.get(WEATHER_API+`latitude=${location.data.lat}&longitude=${location.data.lon}&current=weather_code`);
    var weather_code=weather.data.current.weather_code;
    const icon=wmo_code[weather_code];
    return icon;
}

export{
    getIcon
}