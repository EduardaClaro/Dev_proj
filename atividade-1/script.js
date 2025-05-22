// Define the maximum number of Pokémon to fetch (e.g., first 151 Pokémon)
const maxPokemon = 151;

// Array to store Pokémon data
let pokemonData = [];

// Function to fetch data for a single Pokémon by ID
function fetchPokemon(id) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch Pokémon with ID ${id}`);
            }
            return response.json();
        });
}

// Function to fetch data for all Pokémon
function fetchAllPokemon() {
    const promises = [];
    for (let i = 1; i <= maxPokemon; i++) {
        promises.push(fetchPokemon(i));
    }

    Promise.all(promises)
        .then(results => {
            pokemonData = results.map(data => ({
                id: data.id,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                image: data.sprites.front_default,
                types: data.types.map(type => type.type.name).join(', '),
                height: data.height / 10 + ' m',
                weight: data.weight / 10 + ' kg',
                abilities: data.abilities.map(ability => ability.ability.name).join(', ')
            }));

            pokemonData.sort((a, b) => a.id - b.id);
            populateTable();
        })
        .catch(error => {
            console.error('Error fetching Pokémon data:', error);
            $('.loading').html('<p class="text-danger">Error loading Pokémon data. Please try again later.</p>');
        });
}

// Function to populate the HTML table with Pokémon data
function populateTable() {
    const $tableBody = $('#pokemonTableBody');
    $tableBody.empty();

    pokemonData.forEach(pokemon => {
        const row = `
            <tr>
                <td>${pokemon.id}</td>
                <td>${pokemon.name}</td>
                <td><img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-img"></td>
                <td>${pokemon.types}</td>
                <td>${pokemon.height}</td>
                <td>${pokemon.weight}</td>
                <td>${pokemon.abilities}</td>
            </tr>
        `;
        $tableBody.append(row);
    });

    $('.loading').addClass('d-none');
    $('.pokemon-table').removeClass('d-none');
}

// Start fetching Pokémon data
fetchAllPokemon();