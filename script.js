const refs = {
    dropdownTrigger: document.querySelector('[data-bs-toggle=dropdown]'),
    dropdownMenu: document.querySelector('.dropdown-menu'),
    pokemonModal: document.getElementById('pokemon-details-modal')
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
    const pokemonName = document.getElementById('pokemon-query').value.toLowerCase();
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
        const name = event.relatedTarget.getAttribute('data-bs-pokemon');
        const pokemon = await P.getPokemonByName(name);
        console.log(pokemon);
        updatePokemonModal(pokemon);
    })
    refs.pokemonModal.addEventListener('hide.bs.modal', async event => {
        resetPokemonModal();
    })
}

function updatePokemonModal(pokemon) {
    const pokemonImage = refs.pokemonModal.querySelector('#pokemon-image');
    pokemonImage.src = pokemon.sprites.other['official-artwork'].front_default;
    pokemonImage.onload = () => {
        handlePlaceholderClass('remove');
    }

    // const modalTitle = refs.pokemonModal.querySelector('.modal-title')
    // const modalBody = refs.pokemonModal.querySelector('.modal-body')
    // modalTitle.textContent = `New message to ${recipient}`
    // modalBodyInput.value = recipient
}

function handlePlaceholderClass(method) {
    const placeholders = refs.pokemonModal
        .querySelector('.modal-body')
        .querySelectorAll('.placeholder-target');
    placeholders.forEach(el => el.classList[method]('placeholder'));
}

function resetPokemonModal() {
    refs.pokemonModal.querySelector('#pokemon-image').removeAttribute('src');
    handlePlaceholderClass('add');
}