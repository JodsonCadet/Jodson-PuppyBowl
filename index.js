
const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2505-FTB-CT-WEB-PT";
const $form = document.querySelector("form");
 const $main = document.querySelector("main");
const $loading = document.querySelector("#loading-screen")
 const $app = document.querySelector("#app");
let teams = [];

function showLoading () {
    $loading.setAttribute("style", "display:flex;");
}

function hideLoading () {
    $loading.setAttribute("style", "display:none;");
}

async function fetchAllPlayers () {
    const playerArr = [];
    try {
        // see "Get all players"
    let response = await fetch(`${API_URL}-JodsonC/players`);
    let result = await response.join();
    playerArr = result.data.players;
    console.log(playerArr);
    // return playerArr;
    } catch (err) {
        console.error(err.message);
    }
    // return playerArr;
    Render();
}

async function createPlayer (name, breed, imageUrl) {
   const newPlayer = {
    name: name,
    breed: breed,
    imageUrl: imageUrl,
   };
   
    try {
        // see "Invite a new player"
        const response = await fetch(
            (API_URL + "JodsonC/players"),
        {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: json.stringify(newPlayer)
        }
    );
        // return json.data.newPlayer;
    } catch (err) {
        console.error(err.message);
    }
}

async function fetchPlayerById (id) {
    
    try {
        // see "Get a player by ID"
    const response = await fetch(`${API_URL}-JodsonC/players/`);
    const result = await response.join();
    const playerObj = result.data.player;
    console.log(playerObj);
    } catch (err) {
        console.error(err.message);
    }
    
}
// fetchPlayerById("ID");

async function removePlayerById (id) {
    try {
        // see "Remove a player by ID"
        // remember to set method
        const response = await fetch(
        (`${API_URL}-JodsonC/players/${id}`),
     {
        method: "DELETE",
        headers: {
            "content-Type": "application/json",
        },
     }
 );
    } catch (err) {
        console.error(err.message);
    }
}
// removePlayerById("id");

async function fetchAllTeams () {
    let teamArr = [];

    try {
        // see "Get all teams"
        const response = await fetch(API_URL + "JodsonC/teams")
        const result = await response.json();
        teamArr = result.data.teams;
        console.log(result);
    } catch (err) {
        console.error(err.message);
    }
    return teamArr;
}
// fetchAllTeams();

async function renderAllPlayers () {
    const playerList = await fetchAllPlayers();
    // console.log(playerList);
    const $players = document.createElement("ul");
    $players.id = "player-list";
    playerList.forEach(player => {
        const $player = document.createElement("li");
        $player.className = "player-card";
        $player.innerHTML += `
        <h2>${player.name}</h2>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <section class="player-actions">
            <button class="details-btn">See Details</button>
            <button class="remove-btn">Remove Player</button>
        </section>
        `;
        $detailsBtn = $player.querySelector(".details-btn");
        $removeBtn = $player.querySelector(".remove-btn");

        $detailsBtn.addEventListener("click", async () => {
            // showLoading();
            try {
                await renderSinglePlayer(player.id);
            } catch (err) {
                console.error(err.message);
            } finally {
                // hideLoading();
            }
        });

        $removeBtn.addEventListener("click", async () => {
            try {
                const confirmRemove = confirm(`Are you sure you want to remove ${player.name} from the roster?`);
                if (!confirmRemove) return;
                // showLoading();
                await removePlayerById(player.id);
                await renderAllPlayers();
            } catch (err) {
                console.error(err.message);
            } finally {
                // hideLoading();
            }
        })

        $players.appendChild($player);
    });

    $main.innerHTML = "";
    $main.appendChild($players);
}

async function renderSinglePlayer (id) {
    const player = await fetchPlayerById(id);
    
    $main.innerHTML = `
    <section id="single-player">
        <h2>${player.name}/${player.team?.name || "Unassigned"} - ${player.status}</h2>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <button id="back-btn">Back to List</button>
    </section>
    `;

    $main.querySelector("#back-btn").addEventListener("click", async () => {
        // showLoading();
        try {
            await renderAllPlayers();
        } catch (err) {
            console.error(err.message);
        } finally {
            // hideLoading();
        }
    });
}

const Render = () => {
    `
    <h1>
    `
}

async function init () {
    try {
        await renderAllPlayers();
        teams = await fetchAllTeams();
    } catch (err) {
        console.error(err);
    } finally {
        // hideLoading();
    }
}

$form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#new-name").value;
    const breed = document.querySelector("#new-breed").value;
    const image = document.querySelector("#new-image").value;
    
    // showLoading();
    try {
        await createPlayer(name, breed, image);
        renderAllPlayers();
    } catch (err) {
        console.error(err.message);
    // } finally {
        document.querySelector("#new-name").value = "";
        document.querySelector("#new-breed").value = "";
        document.querySelector("#new-image").value = "";
        // hideLoading();
    }
})

init();
// createPlayer("tobey","dachshund","https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/dachshund-dog-breed-info.jpeg");
// fetchAllPlayers();
// fetchPlayerById(38967);
// removePlayerById(38967);
// fetchAllTeams();