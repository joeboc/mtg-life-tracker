let lifeTotals = [40, 40, 40, 40];

function changeLife(playerNumber, amount){
    lifeTotals[playerNumber-1] += amount;
    document.getElementById(`life${playerNumber}`).innerText = lifeTotals[playerNumber - 1];
}

function resetLife(){
    for (let i = 0; i < lifeTotals.length; i++){
        lifeTotals[i] = 40;
        document.getElementById(`life${i+1}`).innerText = 40;
    }
}

let commanderDamage = { //commanderDamage[target][attacker]
    1: { 2 : 0, 3 : 0, 4 : 0 },
    2: { 1 : 0, 3 : 0, 4 : 0 },
    3: { 1 : 0, 2 : 0, 4 : 0 },
    4: { 1 : 0, 2 : 0, 3: 0}
};

function toggleCommanderDamage(playerNum){
    const section = document.getElementById(`commander${playerNum}`);
    section.style.display = section.style.display === "none" ? "block" : "none";
}

function changeCommander(target, attacker, amount){
    console.log(`Changing commander damage to player ${target} from player ${attacker} by ${amount}`);
    if (!commanderDamage[target].hasOwnProperty(attacker)) return;

    commanderDamage[target][attacker] += amount;
    if (commanderDamage[target][attacker] < 0) commanderDamage[target][attacker] = 0;

    const span = document.getElementById(`cmdr${target}from${attacker}`);
    if(span) {
        span.innerText = commanderDamage[target][attacker];
    }
}