async function buscarStatusChuva() {
  try {
    const resposta = await fetch('http://localhost:3000/status');
    const dados = await resposta.json();
    document.getElementById("chuvaStatus").textContent = `${dados.status}`;
  } catch (erro) {
    console.error('Erro ao buscar status:', erro);
    document.getElementById("chuvaStatus").textContent = "Erro ao carregar status";
  }
}

window.onload = buscarStatusChuva;
setInterval(buscarStatusChuva, 10000);
const mockapiUrl = 'https://672e4d71229a881691efaa8c.mockapi.io/trck/registros'; 

async function submitData() {
    const weatherSelect = document.getElementById('weatherSelect');
    const dateInput = document.getElementById('dateInput');
    const hoursInput = document.getElementById('hoursInput');
    const rainInput = document.getElementById('rainInput');

    const selectedWeather = weatherSelect.value;
    const date = dateInput.value;
    const hours = hoursInput.value;
    const rain = rainInput.value;

    console.log('Valores capturados:', { selectedWeather, date, hours, rain });

    if (!selectedWeather || !date || !hours || !rain) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const data = {
        clima: selectedWeather,
        data: date,
        horas: hours,
        chuva: rain
    };

    try {
        const response = await fetch(mockapiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Dados enviados com sucesso!');
            window.location.href = "grafico.html";
        } else {
            const errorText = await response.text();
            console.error('Erro ao enviar:', errorText);
            alert(`Erro ao enviar: ${errorText}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert(`Erro na requisição: ${error.message}`);
    }
}

