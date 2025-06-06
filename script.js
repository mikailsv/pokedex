const refs = {};
const P = new Pokedex.Pokedex();
let pokemons = [];

async function init() {
    let response = await P.getPokemonsList();
    pokemons = response.results.map(function (pokemonEntry) {
        return {
            name: pokemonEntry.name,
            id: getPokemonIdByUrl(pokemonEntry.url)
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
    const pokemonName = document.getElementById('pokemon-query').value;
    if (pokemonName.length < 1) {dropdown.hide(); return;}
    const suggestions = pokemons.filter(pokemon => pokemon.name.startsWith(pokemonName)).slice(0, 8);
    if (suggestions.length == 0) {dropdown.hide(); return;}
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

function getPokemonIdByUrl(url) {
    return url.split("/").slice(-2, -1).pop();
}