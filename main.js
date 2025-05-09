const apiKey = "c0891ee6f0e1a6064136e7add57a94d3";

// Obtém a localização automaticamente
function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log(`Localização obtida: Latitude ${latitude}, Longitude ${longitude}`);

                document.getElementById("locationDisplay").textContent = `Localização: ${latitude}, ${longitude}`;

                await getWeather(latitude, longitude); // Chama a função de clima com localização
            },
            (error) => {
                console.error("Erro ao obter localização:", error.message);
                alert("Não foi possível obter sua localização.");
            }
        );
    } else {
        alert("Geolocalização não está disponível no seu navegador.");
    }
}

// Obtém dados do clima usando OpenWeather
async function getWeather(latitude, longitude) {
    const apiKey = "c0891ee6f0e1a6064136e7add57a94d3"; // Coloque sua chave da OpenWeather
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Verifica se os dados foram recebidos corretamente
        console.log("Dados do clima recebidos:", data);
        
        if (!data.main || !data.weather) {
            console.error("Erro: Resposta inválida da API.");
            document.getElementById("weatherDisplay").textContent = "Erro ao carregar clima.";
            return;
        }

        // Atualiza os elementos no HTML com os dados corretos
        document.getElementById("weatherDisplay").textContent = `Temperatura: ${data.main.temp}°C`;
        document.getElementById("weatherDetails").textContent = `Condição: ${data.weather[0].description}, Umidade: ${data.main.humidity}%`;
    } catch (error) {
        console.error("Erro ao buscar clima:", error);
        document.getElementById("weatherDisplay").textContent = "Erro ao obter clima.";
    }
}

// Chama a função de localização ao carregar a página
getUserLocation();

const mockapiUrl = 'https://672e4d71229a881691efaa8c.mockapi.io/trck/registros'; 

document.getElementById("novo").addEventListener("click", function() { 
    window.location.href = "reg.html";
});

console.log('mockapiUrl:', mockapiUrl);


async function fetchData() {
    console.log('fetchData chamado');

    const dataList = document.getElementById('data-list');
    const noDataMessage = document.getElementById('no-data-message');

    if (!dataList || !noDataMessage) {
        console.warn("Elementos não encontrados nesta página. Pulando fetchData()");
        return;
    }

    try {
        const response = await fetch(mockapiUrl);
        const data = await response.json();

        if (data.length > 0) {
            dataList.innerHTML = ''; 
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `Registro: ${item.id}, Data: ${item.data}, Horas: ${item.horas}, Clima: ${item.clima}, Chuva: ${item.chuva}`;
                dataList.appendChild(listItem);
            });
            noDataMessage.style.display = 'none';
        } else {
            noDataMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao buscar os dados do MockAPI:', error);
    }
}

// Só chama fetchData() se estiver na página certa
document.addEventListener("DOMContentLoaded", fetchData);

// Função para enviar dados
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
        const response = await fetch('https://672e4d71229a881691efaa8c.mockapi.io/trck/registros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Dados enviados com sucesso!');
            window.location.href = "hist.html";
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

// Carrega os dados assim que o script é executado
fetchData(); 
setInterval(fetchData, 30000); 
