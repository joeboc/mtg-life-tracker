let lifeTotals = [40, 40, 40, 40];

function changeLife(playerNumber, amount){
    lifeTotals[playerNumber-1] += amount;
    document.getElementById(`life${playerNumber}`).innerText = lifeTotals[playerNumber - 1];
}