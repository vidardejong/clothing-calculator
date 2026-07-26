const walkBtn = document.getElementById("walkBtn");
const jogBtn = document.getElementById("jogBtn");
const runBtn = document.getElementById("runBtn");

function setActivity(level){
    [walkBtn, jogBtn, runBtn].forEach(btn => btn.classList.remove("active"));

    // Add active class to selected button
    if (level === "low") walkBtn.classList.add("active");
    if (level === "medium") jogBtn.classList.add("active");
    if (level === "high") runBtn.classList.add("active");
}