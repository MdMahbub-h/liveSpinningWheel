// Configure
let gameName;
let sliceNumber;
let spinDuration;
let wheelPrizes;

const defaultWheelPrizes = [
  { name: "50$", probability: 90, value: 50 },
  { name: "10$", probability: 1, value: 10 },
  { name: "10$", probability: 1, value: 10 },
  { name: "10$", probability: 1, value: 10 },
  { name: "10$", probability: 1, value: 10 },
  { name: "20$", probability: 10, value: 20 },
  { name: "20$", probability: 10, value: 20 },
];

const savedConfig = localStorage.getItem("spinAndWinConfig");
if (savedConfig) {
  const config = JSON.parse(savedConfig);
  gameName = config.gameName;
  sliceNumber = config.sliceNumber;
  spinDuration = config.spinDuration;
  wheelPrizes = config.wheelPrizes;
}

wheelPrizes = wheelPrizes || defaultWheelPrizes;
//  0xffd700, // classic gold
//     0xffc107, // bright gold
//     0xffb300, // amber gold
//     0xffa000, // deep amber
//     0xd4af37, // metallic gold
//     0xb8860b, // dark goldenrod

//     // Golden green / emerald
//     0x9acd32, // yellow-green gold
//     0x7cb342, // olive gold
//     0x2ecc71, // emerald green
//     0x1e8449, // dark emerald
//     0x145a32, // deep green-gold shadow

//     // Golden red / ruby
//     0xe74c3c, // ruby red
//     0xc0392b, // deep ruby
//     0xb03a2e, // dark red-gold
//     0x922b21, // wine red
//     0xcd6155, // warm red highlight

//     // Bronze / copper
//     0xd68910, // bronze
//     0xb9770e, // dark bronze
//     0xa04000, // copper
//     0x873600, // deep copper

//     // Accent glow tones
//     0xffe082, // soft glow gold
//     0xffcc80, // warm glow orange

let NiceTryColors = "golden"; //"dark" or "light" or "any" or single color like black. just type "black"

const gitHubUrl = "assets/";

let width = window.innerWidth;
let height = window.innerHeight;
let isMobile = false;
if (window.innerHeight > window.innerWidth) {
  width = 700;
  height = 1250;
  isMobile = true;
}
let halfWidth = width / 2;
let halfHeight = height / 2;
const gameDiv = document.getElementById("game");
gameDiv.style.width = window.innerWidth + "px";
gameDiv.style.height = window.innerHeight + "px";
window.addEventListener("resize", () => {
  gameDiv.style.width = window.innerWidth + "px";
  gameDiv.style.height = window.innerHeight + "px";
});

const fontUrl = `/assets/fonts/font.otf`;
const myFont = new FontFace("RakeslyRG", `url(${fontUrl})`);
myFont
  .load()
  .then(function (loadedFont) {
    document.fonts.add(loadedFont);
    console.log("RakeslyRG font loaded!");
  })
  .catch(function (err) {
    console.error("Failed to load font:", err);
  });

// URL to your icon (can be online or local)
const iconUrl = `${gitHubUrl}spin/logo.png`;
let link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement("link");
  link.rel = "icon";
  document.getElementsByTagName("head")[0].appendChild(link);
}
link.href = iconUrl;
