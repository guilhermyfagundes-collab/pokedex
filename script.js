let pokemonAtual = 1;

const pokemonImg = document.getElementById("pokemonImg");
const pokemonNome = document.getElementById("pokemonNome");
const pokemonId = document.getElementById("pokemonId");

const altura = document.getElementById("altura");
const peso = document.getElementById("peso");

const tiposDiv = document.getElementById("tipos");
const habilidadesUl = document.getElementById("habilidades");

const statsContainer = document.getElementById("statsContainer");

const buscarBtn = document.getElementById("buscarBtn");
const pokemonInput = document.getElementById("pokemonInput");

const anteriorBtn = document.getElementById("anteriorBtn");
const proximoBtn = document.getElementById("proximoBtn");

const favoritosLista = document.getElementById("favoritosLista");

const listaPokemon = document.getElementById("listaPokemon");

const temaBtn = document.getElementById("temaBtn");

const coresTipos = {
    grass: "#78C850",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ground: "#E0C068",
    poison: "#A040A0",
    flying: "#A890F0",
    normal: "#A8A878",
    fighting: "#C03028",
    ice: "#98D8D8",
    dragon: "#7038F8",
    ghost: "#705898",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC"
};

async function carregarPokemon(idOuNome){

    try{

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${idOuNome}`
        );

        const pokemon = await resposta.json();

        pokemonAtual = pokemon.id;

        preencherPokemon(pokemon);

    }catch{

        alert("Pokémon não encontrado!");

    }

}

function preencherPokemon(pokemon){

    pokemonNome.innerText = pokemon.name;

    pokemonId.innerText = pokemon.id;

    pokemonImg.src =
    pokemon.sprites.other["official-artwork"].front_default;

    altura.innerText = pokemon.height;

    peso.innerText = pokemon.weight;

    carregarTipos(pokemon);

    carregarHabilidades(pokemon);

    carregarStats(pokemon);

}


function carregarTipos(pokemon){

    tiposDiv.innerHTML = "";

    pokemon.types.forEach(tipo => {

        const span = document.createElement("span");

        span.classList.add("tipo");

        span.innerText = tipo.type.name;

        span.style.background =
        coresTipos[tipo.type.name];

        tiposDiv.appendChild(span);

    });

}

function carregarHabilidades(pokemon){

    habilidadesUl.innerHTML = "";

    pokemon.abilities.forEach(habilidade => {

        const li = document.createElement("li");

        li.innerText =
        habilidade.ability.name;

        habilidadesUl.appendChild(li);

    });

}

function carregarStats(pokemon){

    statsContainer.innerHTML = "";

    pokemon.stats.forEach(stat => {

        const div = document.createElement("div");

        div.classList.add("stat");

        div.innerHTML = `
            <div class="stat-info">
                <span>${stat.stat.name}</span>
                <span>${stat.base_stat}</span>
            </div>

            <div class="barra">
                <div
                    class="preenchimento"
                    style="width:${stat.base_stat}%">
                </div>
            </div>
        `;

        statsContainer.appendChild(div);

    });

}

buscarBtn.addEventListener("click", () => {

    const valor =
    pokemonInput.value.toLowerCase();

    carregarPokemon(valor);

});

pokemonInput.addEventListener("keypress", e => {

    if(e.key === "Enter"){

        buscarBtn.click();

    }

});

proximoBtn.addEventListener("click", () => {

    pokemonAtual++;

    carregarPokemon(pokemonAtual);

});

anteriorBtn.addEventListener("click", () => {

    if(pokemonAtual > 1){

        pokemonAtual--;

        carregarPokemon(pokemonAtual);

    }

});

let favoritos =
JSON.parse(
localStorage.getItem("favoritos")
) || [];

function criarBotaoFavorito(){

    let botaoExistente =
    document.querySelector(".btn-favorito");

    if(botaoExistente){

        botaoExistente.remove();

    }

    const botao =
    document.createElement("button");

    botao.classList.add("btn-favorito");

    botao.innerText =
    "⭐ Adicionar aos Favoritos";

    botao.addEventListener("click", () => {

        if(!favoritos.includes(pokemonAtual)){

            favoritos.push(pokemonAtual);

            localStorage.setItem(
                "favoritos",
                JSON.stringify(favoritos)
            );

            mostrarFavoritos();

        }

    });

    document
    .querySelector(".pokemon-card")
    .appendChild(botao);

}

async function mostrarFavoritos(){

    favoritosLista.innerHTML = "";

    for(let id of favoritos){

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        const pokemon =
        await resposta.json();

        const div =
        document.createElement("div");

        div.classList.add("favorito-card");

        div.innerText =
        pokemon.name;

        div.addEventListener("click", () => {

            carregarPokemon(id);

        });

        favoritosLista.appendChild(div);

    }

}

async function carregarListaPokemon(){

    for(let i = 1; i <= 151; i++){

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${i}`
        );

        const pokemon =
        await resposta.json();

        const card =
        document.createElement("div");

        card.classList.add("pokemon-item");

        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}">
            <h4>${pokemon.name}</h4>
            <p>#${pokemon.id}</p>
        `;

        card.addEventListener("click", () => {

            carregarPokemon(i);

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        });

        listaPokemon.appendChild(card);

    }

}

if(localStorage.getItem("tema") === "dark"){

    document.body.classList.add("dark");

    temaBtn.innerText =
    "☀️ Modo Claro";

}

temaBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem(
            "tema",
            "dark"
        );

        temaBtn.innerText =
        "☀️ Modo Claro";

    }else{

        localStorage.setItem(
            "tema",
            "light"
        );

        temaBtn.innerText =
        "🌙 Modo Escuro";

    }

});

carregarPokemon(1);

mostrarFavoritos();

carregarListaPokemon();

setTimeout(() => {

    criarBotaoFavorito();

}, 1000);