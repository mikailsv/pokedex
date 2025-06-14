function getDropdownItemTemplate(pokemon) {
    return `
    <li 
    class="dropdown-item cursor-pointer text-capitalize"
    data-bs-toggle="modal"
    data-bs-pokemon="${pokemon.name}"
    data-bs-target="#pokemon-details-modal">${pokemon.name}</li>
    `;
}

function getBadgeTemplate(type) {
    return `
    <span class="badge rounded-pill text-capitalize bg-${type}">${type}</span>
    `;
}

function getAboutPanelRowTemplate(title, value) {
    return `
    <div class="row mb-2">
        <div class="col-4 text-secondary text-capitalize">${title}</div>
        <div class="col-8">${value}</div>
    </div>
    `;
}

function getPokecardTemplate(pokemon) {
    return `
    <div class="col-6 col-md-4">
        <div 
        class="card position-relative p-2" 
        style="height: 100px;"
        data-bs-toggle="modal"
        data-bs-pokemon="${pokemon.name}"
        data-bs-target="#pokemon-details-modal">
            <h6 class="card-title">${pokemon.name}</h6>
            <img class="position-absolute top-50 end-0 translate-middle-y"
            src="${pokemon.sprites.front_default}" alt="pokemon image">
        </div>
    </div>
    `;
}