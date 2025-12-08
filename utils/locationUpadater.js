import { db } from "../server/firebase.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// this is used to update the location as user moves...

export async function updateUserLocation(user){
  if(!user) return;

  try{
    const position = await new Promise((res,rej)=>{
      navigator.geolocation.getCurrentPosition(res,rej);
     })
     
    const location = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
     }

     await updateDoc(doc(db , "users" , user.uid) , {location});
     console.log("✅ Location updated:" , location);
     return location;
  }
  catch(e){
    alert("could not update live location...");
  }
}


// user location update automatically in 2 minutes...
export function autoUpdateLocation(user , intervalTime = 2){
      if(!user) return;
      
      updateUserLocation(user); // initial update

      setInterval(()=>{
        updateUserLocation(user);
      } , intervalTime * 60 * 1000);
}