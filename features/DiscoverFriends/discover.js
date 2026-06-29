import {db , rtdb } from "../../server/firebase.js";
import { collection, getDocs , onSnapshot} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { initAuth } from "../../server/authManager.js";
import { autoUpdateLocation } from "../../utils/locationUpadater.js";
import {  listenChatRequest, sendChatRequest } from "../chat/requests.js";



let friendsList = document.querySelector("#friendsList");

const { user, profile } = await initAuth({ requireLogin: true });
   //{currentuser,currentUserProfile}

  // updating location every 2 minute..
   autoUpdateLocation(user , 2); 

                    
   // chat request listening..
   listenChatRequest(user);



   
// Compute distance in km between two coordinates (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


async function loadNearbyFriends() {
    
  // let rawUser = await getDocs(collection(db , "users"));
  let rawUser = collection(db , "users");
  
  onSnapshot(rawUser, (snapshot) => {

    let onlineFriends = []
           
    for(const doc of snapshot.docs){
         let friend = {uid : doc.id , ...doc.data()};
         if(doc.id == user.uid) continue;

         // getting distance..
         if(friend.online && friend.location && profile?.location){          

            const distance = getDistance(
                // pass user and friend lat and long..
                profile.location.lat,
                profile.location.lon,
                friend.location.lat,
                friend.location.lon,
            );
          
        
            if(distance <= 1000){  
                onlineFriends.push({...friend , distance})
            }
            //  onlineFriends.push({...friend , distance})
         }
    }
    renderFriends(onlineFriends);
  }); 
}


function renderFriends(friends){ 
    const radarScanner = document.querySelector("#radarScanner");

    if(!friends.length){                                                  
        friendsList.innerHTML = "";
        friendsList.classList.add("hidden");
        if (radarScanner) {
            radarScanner.classList.remove("hidden");
        }
        return;
    } 

    if (radarScanner) {
        radarScanner.classList.add("hidden");
    }
    friendsList.classList.remove("hidden");
    friendsList.innerHTML = "";
    
     friends.forEach((f) => {
       const card = document.createElement("div");
       card.className = "card bg-white border border-gray-100 hover:border-green-300 shadow-md hover:shadow-xl rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between";

       const initials = f.name ? f.name.split(/\s+/).map(p => p[0]).join("").substring(0,2).toUpperCase() : "??";
       const gradientPairs = [
         "from-green-400 to-emerald-500",
         "from-teal-400 to-cyan-500",
         "from-emerald-400 to-teal-500",
         "from-lime-400 to-green-500",
         "from-green-500 to-teal-600"
       ];
       const charCodeSum = f.name ? f.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
       const gradient = gradientPairs[charCodeSum % gradientPairs.length];

       card.innerHTML = `
         <div class="flex items-start gap-4">
           <div class="relative flex-shrink-0">
             <div class="w-14 h-14 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-extrabold text-lg shadow-inner tracking-wider">
               ${initials}
             </div>
             <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full pulse-online"></span>
           </div>
           <div class="flex-1 min-w-0">
             <div class="flex items-center gap-2">
               <h3 class="text-gray-900 font-extrabold text-lg truncate">${f.name}</h3>
               <span class="badge badge-sm bg-green-50 text-green-700 font-bold border border-green-200 shrink-0">${f.age} y/o</span>
             </div>
             <div class="flex items-center gap-1 text-green-600 font-semibold text-xs mt-1">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <span>${f.distance.toFixed(2)} km away</span>
             </div>
           </div>
         </div>
         <div class="mt-4 mb-5 text-sm text-gray-500 line-clamp-2 italic leading-relaxed">
           "${f.about ? f.about : "Hello! Let's connect and chat."}"
         </div>
         <div class="flex items-center justify-end mt-auto pt-3 border-t border-gray-50">
           <button class="chatBtn flex items-center justify-center gap-1.5 px-5 py-2.5 btn btn-outline rounded-full text-sm font-bold shadow-md  transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group w-full sm:w-auto" data-id="${f.uid}">
             <span>Chat Now</span>
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
             </svg>
             <span class="loading loading-ring loading-xs hidden select-loading"></span>
           </button>
         </div>
       `;

       friendsList.appendChild(card);

       card.querySelector(".chatBtn").addEventListener("click" , async (e)=>{
             const btn = e.currentTarget;
             const loader = btn.querySelector(".select-loading");
             if (loader) loader.classList.remove("hidden");
             try {
                 await sendChatRequest( f.uid , f.name , {uid : user.uid , name : profile.name} )
             } finally {
                 if (loader) loader.classList.add("hidden");
             }
       })
     });
}

loadNearbyFriends();