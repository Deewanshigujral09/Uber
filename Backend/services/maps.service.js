const axios = require("axios");

// -------------------- GET COORDINATES --------------------
module.exports.getAddressCoordinate = async (address) => {
  if (!address) return null;

  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) throw new Error("Missing GOOGLE_MAPS_API environment variable");

  const url = "https://maps.googleapis.com/maps/api/geocode/json";

  try {
    const response = await axios.get(url, {
      params: { address, key: apiKey },
    });

    const data = response.data;

    if (!data || data.status !== "OK") return null;

    const location = data.results[0].geometry.location;

    return { lat: location.lat, lng: location.lng };
  } catch (err) {
    console.log("Geocode Error:", err.message);
    return null;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) throw new Error("Missing GOOGLE_MAPS_API");

  const url = "https://maps.googleapis.com/maps/api/distancematrix/json";

  try {
    const response = await axios.get(url, {
      params: {
        origins: encodeURIComponent(origin),
        destinations: encodeURIComponent(destination),
        key: apiKey,
      },
    });

    if (response.data.status !== "OK") {
      throw new Error("Failed to fetch distance matrix");
    }

    const element = response.data.rows[0].elements[0];

    if (element.status === "ZERO_RESULTS") {
      throw new Error("No route found between locations");
    }

    return element;
  } catch (err) {
    console.log("Distance Matrix Error:", err.message);
    throw err;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }
  const apiKey = process.env.GOOGLE_MAPS_API;

  // const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent}`
  const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

  //     try{
  //         const response = await axios.get(url);
  //         if(response.data.status === 'OK'){
  //             return response.data.predictions;
  //         }
  //         else{
  //             throw new Error('Unable to fetch suggestions');
  //         }
  //     } catch(err){
  //         console.error(err);
  //         throw err;
  //     }
  // }
  const response = await axios.get(url, {
    params: {
      input,
      key: apiKey,
      components: "country:in", // 🇮🇳 IMPORTANT for India
    },
  });

  if (response.data.status !== "OK") {
    throw new Error(response.data.status);
  }

  return response.data.predictions;
};
