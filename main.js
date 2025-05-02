// URL do MockAPI
const mockapiUrl = 'https://672e4d71229a881691efaa8c.mockapi.io/trck/registros'; 

document.getElementById("novo").addEventListener("click", function() { 
    window.location.href = "reg.html";
});

console.log('mockapiUrl:', mockapiUrl);


async function fetchData() {
    console.log('fetchData chamado');
    try {
        const response = await fetch(mockapiUrl);
        const data = await response.json();
        const dataList = document.getElementById('data-list');
        const noDataMessage = document.getElementById('no-data-message');

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
