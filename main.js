// URL do MockAPI
const mockapiUrl = 'https://672e4d71229a881691efaa8c.mockapi.io/trck/registros'; 

// Botão para adicionar novo registro
document.getElementById("novo").addEventListener("click", function() { 
    window.location.href = "reg.html";
});

console.log('mockapiUrl:', mockapiUrl); // Verifica se a URL está definida corretamente

// Função para buscar dados e exibir todos os registros
async function fetchData() {
    console.log('fetchData chamado');
    try {
        const response = await fetch(mockapiUrl);
        const data = await response.json();
        const dataList = document.getElementById('data-list');
        const noDataMessage = document.getElementById('no-data-message');

        if (data.length > 0) {
            dataList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            // Exibir todos os registros na lista
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `Registro: ${item.id}, Data: ${item.data}, Horas: ${item.horas}, Clima: ${item.clima}`;
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

    const selectedWeather = weatherSelect.value;
    const date = dateInput.value;
    const hours = hoursInput.value;

    if (!selectedWeather || !date || !hours) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const data = {
        clima: selectedWeather,
        data: date,
        horas: hours
    };

    console.log('Dados a serem enviados:', data);

    try {
        const response = await fetch(mockapiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Dados enviados com sucesso!');
            fetchData(); 
            window.location.href = "hist.html"; 
        } else {
            const errorText = await response.text();
            console.error('Erro ao enviar os dados:', errorText);
            alert(`Erro ao enviar os dados: ${errorText}`);
        }
    } catch (error) {
        console.error('Erro ao enviar os dados para o MockAPI:', error);
        alert(`Erro ao enviar os dados: ${error.message}`);
    }
}

// Carrega os dados assim que o script é executado
fetchData(); 
