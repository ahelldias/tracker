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
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("Dados do clima recebidos:", data);
        
        if (!data.main || !data.weather) {
            console.error("Erro: Resposta inválida da API.");
            document.getElementById("weatherDisplay").textContent = "Erro ao carregar clima.";
            return;
        }

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

document.addEventListener("DOMContentLoaded", fetchData);

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

fetchData(); 
setInterval(fetchData, 30000); 

const weatherCtx = document.getElementById('weatherChart').getContext('2d');
let weatherChart = new Chart(weatherCtx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: "Ocorrência dos Climas",
            data: [],
            backgroundColor: ["blue", "grey", "yellow", "green"]
        }]
    },
    options: {
        responsive: true
    }
});

async function fetchWeatherData() {
    try {
        const response = await fetch(mockapiUrl);
        const data = await response.json();

        if (data.length > 0) {
            let climaCounts = {};

            // Conta a ocorrência de cada clima
            data.forEach(item => {
                let clima = item.clima;
                climaCounts[clima] = (climaCounts[clima] || 0) + 1;
            });

            // Atualiza os dados do gráfico
            weatherChart.data.labels = Object.keys(climaCounts);
            weatherChart.data.datasets[0].data = Object.values(climaCounts);
            weatherChart.update();
        }
    } catch (error) {
        console.error("Erro ao buscar dados para o gráfico de clima:", error);
    }
}

// Atualiza o gráfico ao carregar a página e a cada 10 segundos
document.addEventListener("DOMContentLoaded", fetchWeatherData);
setInterval(fetchWeatherData, 10000);

// Configuração inicial do gráfico de energia
const energyCtx = document.getElementById('energyChart').getContext('2d');
let energyChart = new Chart(energyCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Energia Gerada (Wh)",
            data: [],
            borderColor: "blue",
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});

async function fetchDataAndUpdateChart() {
    try {
        const response = await fetch(mockapiUrl);
        const data = await response.json();
        const power = 3;
        const time = 8;

        if (data.length > 0) {
            energyChart.data.labels = [];
            energyChart.data.datasets[0].data = [];

            data.forEach(item => {
                let chuva = item.chuva.toLowerCase();
                let fatorDeChuva = 0;

                if (chuva === "leve") {
                    fatorDeChuva = 0.2;
                } else if (chuva === "intensa") {
                    fatorDeChuva = 0.5;
                } else if (chuva === "não") {
                    fatorDeChuva = 0;
                }

                let energia = power * time * (1 - fatorDeChuva);

                energyChart.data.labels.push(item.data);
                energyChart.data.datasets[0].data.push(energia);
            });

            energyChart.update();
        }
    } catch (error) {
        console.error("Erro ao buscar dados para o gráfico:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchDataAndUpdateChart);
setInterval(fetchDataAndUpdateChart, 10000);