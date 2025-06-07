const refs = {};
const P = new Pokedex.Pokedex({ cacheImages: true });
let pokemons = [];

async function init() {
    let response = await P.getPokemonsList();
    pokemons = response.results.map(function (pokemonEntry) {
        return {
            name: pokemonEntry.name,
            id: pokemonEntry.url.split("/").slice(-2, -1).pop()
        }
    });
    console.log(pokemons);
}

function search() {
    // TODO: Implement submit event for searching and displaying pokemons, that matches query.
}

const dropdownElement = document.querySelector('.btn-dropdown');
const dropdown = new bootstrap.Dropdown(dropdownElement);

function handlePokemonInput() {
    const pokemonName = document.getElementById('pokemon-query').value.toLowerCase();
    const suggestions = pokemons.filter(pokemon => pokemon.name.startsWith(pokemonName)).slice(0, 8);
    if (suggestions.length == 0 || pokemonName.length == 0) {dropdown.hide(); return;}
    renderPokemonSuggestions(suggestions);
    dropdown.show();
}

function renderPokemonSuggestions(pokemonSuggestions) {
    const container = document.getElementById('search-suggestions');
    container.innerHTML = '';
    pokemonSuggestions.forEach(pokemon => {
        container.innerHTML += getDropdownItemTemplate(pokemon);
    });
}

async function showDetails(pokemonId) {
    let pokemon = await P.getPokemonByName(pokemonId);
    console.log(pokemon);
    document.getElementById('pokemon-title').innerHTML = pokemon.name;
    renderTypeBadges(pokemon.types.map(typeObj => typeObj.type.name));
    document.getElementById('pokemon-image').src = pokemon.sprites.other['official-artwork'].front_default;
}

function renderTypeBadges(types) {
    const container = document.getElementById('badge-group');
    container.innerHTML = '';
    types.forEach(type => {
        container.innerHTML += getBadgeTemplate(type);
    });
}