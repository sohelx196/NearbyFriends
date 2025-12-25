

export function showReqPopup(message) {

    return new Promise((resolve) => {
    // Create the modal overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    
    // Modal box
    const modal = document.createElement("div");
    modal.classList.add("chatModal");

    modal.innerHTML = `<p style="margin-bottom:15px;">${message}</p>
      <button id="acceptBtn" style="background:#22c55e;color:white;border:none;padding:8px 12px;border-radius:6px;margin-right:10px;">Accept</button>
      <button id="declineBtn" style="background:#ef4444;color:white;border:none;padding:8px 12px;border-radius:6px;">Decline</button> `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listeners
    modal.querySelector("#acceptBtn").onclick = () => {
      resolve(true);
      overlay.remove();
    };
    modal.querySelector("#declineBtn").onclick = () => {
      resolve(false);
      overlay.remove();
    };
  });

}