const refs = {
    dropdownTrigger: document.querySelector('[data-bs-toggle=dropdown]'),
    dropdownMenu: document.querySelector('.dropdown-menu'),
    pokemonInput: document.getElementById('pokemon-input'),
    pokemonModal: document.getElementById('pokemon-details-modal'),
    pokemonModalImage: document.getElementById('modal-image'),
    pokemonModalTitle: document.getElementById('modal-title'),
    pokemonModalBadgeGroup: document.getElementById('modal-badge-group'),
    pokemonModalAboutPanel: document.getElementById('about-panel'),
    pokemonModalStatsPanel: document.getElementById('stats-panel')
};
const P = new Pokedex.Pokedex({ cacheImages: true });
let pokemons = [];
let limit = 20;
let offset = 0;
const overlayModal = new bootstrap.Modal(document.getElementById('overlayModal'));
const dropdown = new bootstrap.Dropdown(refs.dropdownTrigger);

document.addEventListener('DOMContentLoaded', () => overlayModal.show());

async function init() {
    let response = await P.getPokemonsList();
    pokemons = response.results
        .map(function (pokemonEntry) {
            return {
                name: pokemonEntry.name,
                id: pokemonEntry.url.split("/").slice(-2, -1).pop()
            }
        });
    await initPokecardContainer();
    overlayModal.hide();
}

async function initPokecardContainer() {
    for (let i = 1 + offset; i <= limit; i++) {
        const pokemon = await P.getPokemonByName(i);
        document.getElementById('pokecard-container').innerHTML += getPokecardTemplate(pokemon);
    }
}

async function loadMorePokemons() {
    document.getElementById('more-btn').setAttribute('disabled', 'true');
    offset = limit;
    limit += 10;
    await initPokecardContainer();
    document.getElementById('more-btn').removeAttribute('disabled');
    overlayModal.hide();
}

function search() {
    // TODO: Implement submit event for searching and displaying pokemons, that matches query.
}

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
    // title & badge
    refs.pokemonModalTitle.textContent = pokemon.name;
    renderTypeBadges(pokemon.types.map(typeWrapper => typeWrapper.type.name));
    refs.pokemonModal.querySelector('.modal-title-wrapper').classList.remove('placeholder', 'content-invisible');
    // image
    refs.pokemonModalImage.src = pokemon.sprites.other['official-artwork'].front_default;
    refs.pokemonModalImage.onload = () => refs.pokemonModal.querySelector('.modal-image-wrapper').classList.remove('placeholder', 'content-invisible');
    // tab panels
    renderAboutPanel(pokemon.height, pokemon.weight, pokemon.abilities.map(a => a.ability.name));
    renderStatsPanel(pokemon.stats);
    refs.pokemonModal.querySelector('.tab-content').classList.remove('placeholder', 'content-invisible');
}

function renderTypeBadges(types) {
    refs.pokemonModalBadgeGroup.innerHTML = '';
    types.forEach(type => refs.pokemonModalBadgeGroup.innerHTML += getBadgeTemplate(type));
}

function renderAboutPanel(pokemonHeight, pokemonWeight, pokemonAbilities) {
    refs.pokemonModalAboutPanel.innerHTML = '';
    refs.pokemonModalAboutPanel.innerHTML += getAboutPanelRowTemplate('Height', formatHeightInMeters(pokemonHeight / 10));
    refs.pokemonModalAboutPanel.innerHTML += getAboutPanelRowTemplate('Weight', formatWeightInKilograms(pokemonWeight / 10));
    for (let i = 0; i < pokemonAbilities.length; i++) {
        if (i == 0) {
            refs.pokemonModalAboutPanel.innerHTML += getAboutPanelRowTemplate('Abilities', pokemonAbilities[i]);
        } else {
            refs.pokemonModalAboutPanel.innerHTML += getAboutPanelRowTemplate('', pokemonAbilities[i]);
        }
    }
}

function renderStatsPanel(stats) {
    refs.pokemonModalStatsPanel.innerHTML = '';
    stats.forEach(stat => refs.pokemonModalStatsPanel.innerHTML += getAboutPanelRowTemplate(stat.stat.name, stat.base_stat));
}

function formatHeightInMeters(h) {
    return `${h.toFixed(2)} m`;
}

function formatWeightInKilograms(w) {
    return `${w.toFixed(2)} kg`;
}

function resetPokemonModal() {
    refs.pokemonModal.querySelector('.modal-title-wrapper').classList.add('placeholder', 'content-invisible');
    refs.pokemonModal.querySelector('.modal-image-wrapper').classList.add('placeholder', 'content-invisible');
    refs.pokemonModal.querySelector('.tab-content').classList.add('placeholder', 'content-invisible');
    new bootstrap.Tab('#about-trigger-btn').show();
}