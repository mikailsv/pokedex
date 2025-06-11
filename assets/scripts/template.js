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
        <div class="col-4 text-secondary">${title}</div>
        <div class="col-8">${value}</div>
    </div>
    `;
}