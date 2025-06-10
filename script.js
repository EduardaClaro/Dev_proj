$(function() {
  $.getJSON('https://jsonplaceholder.typicode.com/users', function(usuarios) { 
    $('#total-usuarios').text(usuarios.length);

    usuarios.forEach(function(usuario) { 
      const card = `
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">${usuario.name}</h4>
              <p class="card-text mb-3"><strong>Email:</strong> ${usuario.email}</p>
              <p class="card-text mb-3"><strong>Telefone:</strong> ${usuario.phone}</p>
              <p class="card-text"><strong>Cidade:</strong> ${usuario.address.city}</p>
            </div>
          </div>
        </div>
      `;
      $('#lista-usuarios').append(card); 
    });
  });
});