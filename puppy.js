const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT =  "/2505-FTB-CT-WEB-PT-JodsonC"
const API = API_URL + COHORT;
const $form = document.querySelector("form"); 
const $app = document.querySelector("#app");
let teams = [];


async function fetchAllPlayers () {
    try {
        const response = await fetch (`${API}/players`);
        const result = await response.json();
        return result.data.players;
    } catch (err) {
        console.error(err.message);
        return [];
    }
}

async function fetchPlayerById (id) {
    try {
        const response = await fetch (`${API}/players/${id}`);
        const result = await response.json();
        return result.data.player;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}
const playerListItems = (player) => {
    const $li = document.createElement("li");
    $li.innerHTML=`
    <a href=#selected">
    <h3>${player.name}</h3>
    <img src="${player.imageUrl}" alt="picture of ${player.name}" stylesheet=width: 100px; height: auto;" />
    </a>`;
    $li.addEventListener("click", async ()=> {
        const fullPlayer = await fetchPlayerById(player.id)
        renderSinglePlayer(fullPlayer)
    });
    return $li; 
}
// This function resizes the player images in the list to a smaller size
// to fit better in the layout.
// const resizePlayerImages = () => {
//     const images = document.querySelectorAll(".player-list img");
//     images.forEach(img => {
//         img.style.width = "10px";
//         img.style.height = "auto";
//         img.style.objectFit = "cover";
//     });
// };

const playerList = (players) => {
    const $ul = document.createElement("ul");
    $ul.classList.add("player-list");

    const $items = players.map(playerListItems);
    $ul.replaceChildren(...$items);

    return $ul;
}

const renderSinglePlayer = (player) => {
    const $selected = document.querySelector("#selected");
    $selected.innerHTML= `
    <h2>${player.name}</h2>
    <p>${player.breed}</p>
    <p>${player.status}</p>
    <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
    <section class="player-actions">
     <button class="remove-btn">Remove Player</button>
     </section>
    `;
    const $removeBtn = $selected.querySelector(".remove-btn");
    $removeBtn.addEventListener("click", async () => {
        const confirmed = window.confirm("Please confirm. This action cannot be undone.");
        if (!confirmed) return;
        try{
            await removePlayerById(player.id);
            await init();
        } catch (error) {
            console.log(error);
        }
    });
}
async function removePlayerById(id) {
    try {
        const response = await fetch(`${API}/players/${id}`, {
            method: "DELETE",
        });
        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.error || "Failed to remove player.");
        }
    } catch (err) {
        console.error("Error deleting player:", err);
        return null;
    }
}
       
    const addNewPlayer = () => {
    const $form = document.createElement("form");
     $form.innerHTML = `<div class="form-group">
    <label for = "playerName">Player Name</label>
    <input class="form-control" id="newPlayerName" placeholder="Rollo, Ragner, Bjorn">
 </div>
   <div class="form-group">
    <label for="Breed">Breed</label>
    <input class="form-control" id="newPlayerBreed" placeholder="French, Norwegian, English">
  </div>
   <div class="form-group">
    <label for="status">Status:</label>
    <select id="status" name="status">
    <option value="null">-Select one-</option>
    <option value="field">Field</option>
    <option value="bench">Benched</option>
    </select>
  </div>
   <div class="form-group">
    <label for="imgURL">Picture</label>
    <input class="form-control" id="newPlayerImage" placeholder="https://image.com">
  </div>
  <button type="submit" class="btn btn-primary">Invite Puppy</button>`;
    return $form;

    }
const newPlayer = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const breed = e.target[1].value;
    const status = e.target[2].value;
    const imageURL = e.target[3].value;
    const obj = {name, breed, status, imageURL};

    try {
        const response = await fetch(`${API}/players`, {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });
        const data = await response.json();
        console.log("New player created:", data);
    } catch (error) {
        console.error("error creating player:", error);
    }
    await init();
};

const render = async () => {
    $app.innerHTML = `
        <h1>Puppy Bowl</h1>
        <main>
            <section id="player-selection">
                <h2>Players</h2>
                <p id="player-message">Please select a player to see more details.</p>
                <div id="player-list"></div>
            </section>
            <section id="selected">
                <h2>Player Details</h2>
            </section>
            <section id="newPlayer">
                <h2>Add a new player:</h2>
                <form id="newPlayerForm"></form>
            </section>
        </main>
    `;

    const players = await fetchAllPlayers();
    const $list = playerList(players);
    const $playerListContainer = document.querySelector("#player-list");
    $playerListContainer.replaceWith($list);

    const $form = addNewPlayer(newPlayer);
    $form.addEventListener("submit", newPlayer);
    const $formContainer = document.querySelector("#newPlayerForm");
    $formContainer.replaceWith($form);
};


const init = async () => {
    await render();
};

init();
// createPlayer("tobey","dachshund","https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/dachshund-dog-breed-info.jpeg");
// fetchAllPlayers();
// fetchPlayerById(38967);
// removePlayerById(38967);
// fetchAllTeams();