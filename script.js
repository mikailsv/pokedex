const refs = {
    dropdownTrigger: document.querySelector('[data-bs-toggle=dropdown]'),
    dropdownMenu: document.querySelector('.dropdown-menu'),
    pokemonInput: document.getElementById('pokemon-input'),
    pokemonModal: document.getElementById('pokemon-details-modal'),
    pokemonModalImage: document.getElementById('pokemon-image'),
    pokemonModalTitle: document.getElementById('modal-title')
};
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
}

function search() {
    // TODO: Implement submit event for searching and displaying pokemons, that matches query.
}

const dropdown = new bootstrap.Dropdown(refs.dropdownTrigger);

function handlePokemonInput() {
    const pokemonName = refs.pokemonInput.value.toLowerCase();
    const suggestions = pokemons.filter(pokemon => pokemon.name.startsWith(pokemonName)).slice(0, 4);
    if (suggestions.length == 0 || pokemonName.length == 0) { dropdown.hide(); return; }
    renderPokemonSuggestions(suggestions);
    dropdown.show();
}

function renderPokemonSuggestions(pokemonSuggestions) {
    refs.dropdownMenu.innerHTML = '';
    pokemonSuggestions.forEach(pokemon => refs.dropdownMenu.innerHTML += getDropdownItemTemplate(pokemon));
}

if (refs.pokemonModal) {
    refs.pokemonModal.addEventListener('show.bs.modal', async event => {
        clearPokemonInput();
        const name = event.relatedTarget.getAttribute('data-bs-pokemon');
        try {
            const pokemon = await P.getPokemonByName(name);
            console.log(pokemon);
            updatePokemonModal(pokemon);
        } catch (error) {
            // TODO: handle error 
        }
    })
    refs.pokemonModal.addEventListener('hide.bs.modal', event => {
        resetPokemonModal();
    })
}

function clearPokemonInput() {
    refs.pokemonInput.value = '';
}

function updatePokemonModal(pokemon) {
    refs.pokemonModalImage.src = pokemon.sprites.other['official-artwork'].front_default;
    refs.pokemonModalImage.onload = () => {
        togglePlaceholderClass('remove');
        refs.pokemonModalImage.classList.remove('invisible');
    }
}

function togglePlaceholderClass(method) {
    const placeholders = refs.pokemonModal
        .querySelector('.modal-body')
        .querySelectorAll('.placeholder-target');
    placeholders.forEach(el => el.classList[method]('placeholder'));
}

function resetPokemonModal() {
    refs.pokemonModalImage.removeAttribute('src');
    refs.pokemonModalImage.classList.add('invisible')
    togglePlaceholderClass('add');
}