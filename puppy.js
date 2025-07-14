const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT =  "/2505-FTB-CT-WEB-PT-JodsonC"
const API = API_URL + COHORT;
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
        const response = await fetch (`${API}/players ${id}`);
        const result = await response.json();
        return result.data.players;
    } catch (err) {
        console.error(err.message);
        return[];
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

const playList = (players) => {
    const $ul = document.createElement("ul");
    $ul.classList.add("player-list");

    const $items = players.map(playerListItems);
    $ul.replaceChild(...$items);

    return $ul;
}

const renderSinglerPlayer = (player) => {
    const $selection = document.querySelector("#selected");
    $selected.innerHTML= `
    <h2>${player.name}</h2>
    <p>${player.breed}</p>
    <p>${player.status}</p>
    <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
    <section class="player-actions">
     <button class="remove-btn">Remove Player</button>
     </section>
    `;
    const $removeBtn = $selection.querySelector(".remove-btn");
    $removeBtn.addEventListener("click", async () => {
    const confirm = confirm("Please confirm. This action cannot be undone.")
    if (!confirm) return
    try{
        await removePlayerById(player.id);
        
    }
    })
}

        $removeBtn.addEventListener("click", async () => {
            try {
                const confirmRemove = confirm(`Are you sure you want to remove ${player.name} from the roster?`);
                if (!confirmRemove) return;
                showLoading();
                await removePlayerById(player.id);
                await renderAllPlayers();
            } catch (err) {
                console.error(err.message);
            } finally {
                hideLoading();
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
        showLoading();
        try {
            await renderAllPlayers();
        } catch (err) {
            console.error(err.message);
        } finally {
            hideLoading();
        }
    });
}

async function init () {
    try {
        await renderAllPlayers();
        teams = await fetchAllTeams();
    } catch (err) {
        console.error(err);
    } finally {
        hideLoading();
    }
}

$form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#new-name").value;
    const breed = document.querySelector("#new-breed").value;
    const image = document.querySelector("#new-image").value;
    
    showLoading();
    try {
        await createPlayer(name, breed, image);
        renderAllPlayers();
    } catch (err) {
        console.error(err.message);
    } finally {
        document.querySelector("#new-name").value = "";
        document.querySelector("#new-breed").value = "";
        document.querySelector("#new-image").value = "";
        hideLoading();
    }
})

init();
// createPlayer("tobey","dachshund","https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/dachshund-dog-breed-info.jpeg");
// fetchAllPlayers();
// fetchPlayerById(38967);
// removePlayerById(38967);
// fetchAllTeams();