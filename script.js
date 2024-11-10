const discordWebHook = 'https://discord.com/api/webhooks/1304660115999293492/lpGS7iNAgnpDMEJus-_BlrpPWlfeoYddOtDXz-lsuYXuhDeV5SUFgKjApePyee6CyTTi';
var confessions = "";
var ipsOnCooldown = [];

// Function to fetch the IP address
async function getIpAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'IP not found';
  }
}

postButton.onclick = async function () {
  const ipAddress = await getIpAddress();

  if (ipsOnCooldown.includes(ipAddress)) {
    alert("You are on cooldown. Please wait 5 minutes before posting again!");
  } else {
    var newConfession = confessionInput.value;

    if (newConfession.trim() === "") {
      console.log("Blank Is Not Accepted");
    } else {
      if (confessions === "") {
        confessions = newConfession;
      } else {
        confessions = confessions + "<br><br>" + newConfession;
      }

      document.getElementById("confessions").innerHTML = confessions;
      confessionInput.value = "";

      ipsOnCooldown.push(ipAddress);
      console.log("Cooldown list:", ipsOnCooldown);

      setTimeout(() => {
        const index = ipsOnCooldown.indexOf(ipAddress);
        if (index !== -1) {
          ipsOnCooldown.splice(index, 1);
          console.log(`Removed ${ipAddress} from cooldown list.`);
        }
      }, 3000);

      sendConfessionToDiscord(newConfession, ipAddress);
    }
  }
};

function sendConfessionToDiscord(newConfession, ipAddress) {
  const messageContent = `Confession: ${newConfession}\nIP Address: ${ipAddress}`;

  fetch(discordWebHook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: messageContent })
  });
}
