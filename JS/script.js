let lifeTotals = [40, 40, 40, 40];

function changeLife(playerNumber, amount){
    lifeTotals[playerNumber - 1] += amount;
    document.getElementById(`life${playerNumber}`).innerText = lifeTotals[playerNumber - 1];
}

function resetLife(){
    for (let i = 0; i < lifeTotals.length; i++){
        lifeTotals[i] = 40;
        document.getElementById(`life${i+1}`).innerText = 40;
    }
}

function loseTheGame(playerNumber){
    const playerBox = document.getElementById(`player${playerNumber}`);
    const img1 = commanderImages[`p${playerNumber}c1`];
    const img2 = commanderImages[`p${playerNumber}c2`];

    playerBox.style.background = `
    linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)),
    ${img1 && img2 ? `
    url('${img1}') left center / 50% auto no-repeat,
    url('${img2}') right center / 50% auto no-repeat
    ` : img1 ? `
    url('${img1}') center center / cover no-repeat
    ` : ""}
`;

playerBox.style.backgroundBlendMode = "multiply";
    playerBox.style.opacity = "0.5";
    playerBox.style.filter = "grayscale(100%)";
    playerBox.style.pointerEvents = "none"; // optional: disables interaction
    playerBox.innerHTML = `<h2 style="color: white; font-size: 24px;">Player ${playerNumber} Has Lost</h2>`;
}
 
let commanderDamage = {
    1: { 2 : 0, 3 : 0, 4 : 0 },
    2: { 1 : 0, 3 : 0, 4 : 0 },
    3: { 1 : 0, 2 : 0, 4 : 0 },
    4: { 1 : 0, 2 : 0, 3: 0 }
};

function toggleCommanderDamage(playerNum){
    const section = document.getElementById(`commander-damage${playerNum}`);
    section.style.display = section.style.display === "none" ? "block" : "none";
} 

function changeCommander(target, attacker, amount){
    if (!commanderDamage[target].hasOwnProperty(attacker)) return;

    commanderDamage[target][attacker] += amount;
    if (commanderDamage[target][attacker] < 0) commanderDamage[target][attacker] = 0;

    const span = document.getElementById(`cmdr${target}from${attacker}`);
    if(span) {
        span.innerText = commanderDamage[target][attacker];
    }
}

async function fetchCommanders(){
    let url = "https://api.scryfall.com/cards/search?q=is:legendary+type:creature+legal:commander";
    let allCards = [];
    while (url) {
    const response = await fetch(url);
    const data = await response.json();
    allCards = allCards.concat(data.data);
    url = data.has_more ? data.next_page : null;
    }
    return allCards;
}

function populateCommanderDatalist(cards) {
    const datalist = document.getElementById("commander-list");
    datalist.innerHTML = "";

    cards.forEach(card => {
        const option = document.createElement("option");
        option.value = card.name;
        datalist.appendChild(option);
    });
}

let commanderImages = {};

function setCommanderBackground(playerNum){
    const playerBox = document.getElementById(`player${playerNum}`);
    const img1 = commanderImages[`p${playerNum}c1`];
    const img2 = commanderImages[`p${playerNum}c2`];

    if(img1 && img2) {
        playerBox.style.background = `
            linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
            url('${img1}') left center / 50% auto no-repeat,
            url('${img2}') right center / 50% auto no-repeat
        `;
    } else if (img1) {
        playerBox.style.background = `
            linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)),
            url('${img1}') center center / cover no-repeat
        `;
    } else {
        playerBox.style.background = "";
    }

    playerBox.style.backgroundBlendMode = "multiply";
    playerBox.style.color = "white";
}

async function updateCommanderInput(playerNum, slot) {
    const name = document.getElementById(`commander${slot}p${playerNum}`).value;
    console.log(`Player ${playerNum} selected Commander ${slot}: ${name}`);

    try {
        const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
        const data = await response.json();

        console.log("Image URL:", data.image_uris?.art_crop);

        const commanderKey = `p${playerNum}c${slot}`;
        commanderImages[commanderKey] = data.image_uris?.art_crop || null;
        setCommanderBackground(playerNum);
    } catch (error) {
        console.error("Commander not found:", name);
    }
}

async function confirmCommanderSelection(playerNum) {
    const input1 = document.getElementById(`commander1p${playerNum}`);
    const input2 = document.getElementById(`commander2p${playerNum}`);
    const name1 = input1.value.trim();
    const name2 = input2.value.trim();

    if (!name1) {
        alert("Please enter a valid commander name.");
        return;
    }

    try {
        const res1 = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name1)}`);
        const data1 = await res1.json();
        commanderImages[`p${playerNum}c1`] = data1.image_uris?.art_crop || null;

        if (name2) {
            const res2 = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name2)}`);
            const data2 = await res2.json();
            commanderImages[`p${playerNum}c2`] = data2.image_uris?.art_crop || null;
        }

        setCommanderBackground(playerNum);

        document.getElementById(`commander-select${playerNum}`).style.display = "none";
    } catch (error) {
        console.error("Error loading commander(s):", error);
        alert("One or both commander names could not be found.");
    }
}

// Load commanders into datalist on page load
fetchCommanders().then(cards => {
    const commanderCards = cards.filter(c => c.legalities.commander === "legal");
    populateCommanderDatalist(commanderCards);
});
