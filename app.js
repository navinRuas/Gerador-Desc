/*
──────────────▒███░───░████████▒
───────────█████▒░█████░▒▒▒▒▒▒█████
──────────██▒▒▒▒██████████████▒▒▒██░
─────────██▒▒▒▒███▒██▒██▒▒█████▒░▒██
─────────█░▒▒▒██▒████████████▒█▒▒▒█░
─────────█▒▒▒▒██▒▒▒░▓▓▒░▓▒▒████▒▒██
─────────█▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒█▒█░▒████
─────███████████▒▒▒▒▒▒▒▒██████▒██▓▒███
─────██▒▒▒▒▒▒█████▒▒▒▒▒▒▒▒█████▒▒▒▒▒██
───────██▒▒▒▒▒▒▒▓██████▒▒▒▒▒██▒▒▒▒▒▒███
────█████▒▒▒▒▒▒▒▒▒▒████▒▒▒██▒▒▒▒▒▒███
────██▒▒▒███▒▒▒▒▒▒▒▒▒▒▓█████▒▒▒▒▒███
────███▒▒▒▒███▒▒▒▒▒▒▒▒▒▒▒███▓▒▒███
──────█████▒▒████▒▒▒▒▒▒▒▒▒▒█████
─────────████▒▒██████▒▒▒▒█████
────────────███▒▒██████████
──────────────████▓──█▓█
────────────────────████
────────────────────█░█─────█████████
────────────────────█▓█───█████████████
──░█████████───────████──██▓███▒▓████
─█████████████─────█░███████░██████
───████░▒███▒██────█▓██████████
─────█████▓▒█████─████
─────────██████████▓█
──────────────────█▓█────████▒█▓▒█
─────────────────█▓██──█████████████
─────────────────█▓█──██▒████░█████
────────────────██████████▒██████
────────────────█▓███████████
───────────────████
───────────────█▒█
───────────────███
*/

const elements = {
  YYYY: document.getElementById('YYYY'),
  AA: document.getElementById('AA'),
  PP: document.getElementById('PP'),
  AT: document.getElementById('AT'),
  DDD: document.getElementById('DDD'),
  SP: document.getElementById('SP'),
  ISP: document.getElementById('ISP'),
  AAP: document.getElementById('AAP'),
  enviar: document.getElementById('gerar'),
  apagar: document.getElementById('reset'),
  Ret: document.getElementById('Ret')
};

// Desabilita o elemento select
const selects = document.querySelectorAll("select");
selects.forEach(select => select.disabled = true);
document.getElementById("ISP").disabled = true;

let rows;
const selectDDD = document.getElementById("DDD");

window.addEventListener('load', function() {
  document.querySelector('.box').style.display = 'flex';
  fetch('depara.json')
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response from the server
      rows = data;

      // DDD
      const optionsDDD = ['Tipo de Demanda'];
      const valuesDDD = [''];
      for (let i = 0; i < rows.length; i++) {
        const cod = rows[i].CodDemanda;
        let tipo = rows[i]['Tipo de Demanda'];
        if (cod === undefined || tipo === undefined) {
          break;
        }
        tipo = fixText(tipo);
        if (cod && tipo && !optionsDDD.includes(tipo)) {
          optionsDDD.push(tipo);
          valuesDDD.push(cod);
        }
      }
      const selectDDD = document.getElementById("DDD");
      for (let i = 0; i < optionsDDD.length; i++) {
        const option = document.createElement("option");
        option.text = optionsDDD[i];
        option.value = valuesDDD[i];
        if (isNaN(option.value)) { option.value = ''; }
        selectDDD.add(option);
      }

      // Enable DDD select
      document.getElementById("DDD").disabled = false;

      document.querySelector('.box').style.display = 'none';
    });
});

// AT
selectDDD.addEventListener('change', function() {
  clearSelectOptionsAndDisable("AT");
  clearSelectOptionsAndDisable("PP");
  clearSelectOptionsAndDisable("YYYY");
  clearSelectOptionsAndDisable("AA");
  clearSelectOptionsAndDisable("SP");
  clearSelectOptionsAndDisable("ISP");

  if (selectDDD.value != '' && (![12, 13, 14].includes(Number(selectDDD.value)))) {
    console.log('DDD selecionado: ' + selectDDD.value);
    // Enable AT select
    document.getElementById("AT").disabled = false;

    // Filter rows by selected DDD value
    const filteredRows = rows.filter(row => row.CodDemanda == this.value);

    // Populate AT options
    const optionsAT = ['Atividade'];
    const valuesAT = [''];
    for (let i = 0; i < filteredRows.length; i++) {
      const codAtividade = filteredRows[i].CodAtividade;
      let atividade = filteredRows[i].Atividade;
      if (codAtividade === undefined && atividade === undefined) {
        break;
      }
      if (atividade === '-') {
        atividade = '';
      }
      if (codAtividade === '-') {
        codAtividade = '';
      }
      if ((codAtividade && atividade !== undefined && !optionsAT.includes(atividade)) && (codAtividade !== undefined && atividade !== undefined)) {
        optionsAT.push(atividade);
        valuesAT.push(codAtividade);
      }
    }
    // Sort options by value
    const sortedOptions = optionsAT.map((option, index) => ({ text: option, value: valuesAT[index] }))
      .sort((a, b) => a.value - b.value);

    // Add sorted options to selectAT
    for (let i = 0; i < sortedOptions.length; i++) {
      const option = document.createElement("option");
      option.text = sortedOptions[i].text;
      option.value = sortedOptions[i].value;
      selectAT.add(option);
    }
  } else if ([12, 13, 14].includes(Number(selectDDD.value))) {

    fetchJsonAndPopulateSelectOptions('ano.json', 'YYYY');
    document.getElementById("YYYY").disabled = false;
  } else {
    clearSelectOptionsAndDisable("AT");
  }
});

// PP
const selectAT = document.getElementById("AT");
selectAT.addEventListener('change', function() {
  clearSelectOptionsAndDisable("PP");
  clearSelectOptionsAndDisable("YYYY");
  clearSelectOptionsAndDisable("AA");
  clearSelectOptionsAndDisable("SP");
  clearSelectOptionsAndDisable("ISP");

  if (shouldFetchAnoJson(selectDDD.value, selectAT.value)) {
    fetchJsonAndPopulateSelectOptions('ano.json', 'YYYY');
    document.getElementById("YYYY").disabled = false;
    document.getElementById("SP").disabled = true;
    document.getElementById("AA").disabled = true;
    document.getElementById("ISP").disabled = true;
  }

  if ((selectAT.value !== '' && selectDDD.value !== '') && !shouldFetchAnoJson(selectDDD.value, selectAT.value)) {
    // Enable PP select
    document.getElementById("PP").disabled = false;

    // Filter rows by selected DDD and AT values
    const filteredRows = rows.filter(row => row.CodDemanda == selectDDD.value && row.CodAtividade == this.value);

    // Populate PP options
    const optionsPP = ['Produto'];
    const valuesPP = [''];
    for (let i = 0; i < filteredRows.length; i++) {
      const codProduto = filteredRows[i].CodProduto;
      let produto = filteredRows[i].Produto;
      if (codProduto === undefined && produto === undefined) {
        break;
      }
      if (produto === '-') {
        produto = '';
      }
      if (codProduto === '-') {
        codProduto = '';
      }
      if ((codProduto && produto !== undefined && !optionsPP.includes(produto)) && (codProduto !== undefined && produto !== undefined)) {
        optionsPP.push(produto);
        valuesPP.push(codProduto);
      }
    }

    // Add empty option if PP would be empty
    if (optionsPP.length === 1) {
      optionsPP.push('');
      valuesPP.push('');
    }

    // Sort options by value
    const sortedOptions = optionsPP.map((option, index) => ({ text: option, value: valuesPP[index] }))
      .sort((a, b) => a.value - b.value);

    // Add sorted options to selectPP
    for (let i = 0; i < sortedOptions.length; i++) {
      const option = document.createElement("option");
      option.text = sortedOptions[i].text;
      option.value = sortedOptions[i].value;
      PP.add(option);
    }
  } else {
    clearSelectOptionsAndDisable("PP");
  }
});

elements.PP.addEventListener('change', function() {
  clearSelectOptionsAndDisable("YYYY");
  clearSelectOptionsAndDisable("AA");
  clearSelectOptionsAndDisable("SP");
  clearSelectOptionsAndDisable("ISP");

  if (elements.PP.value !== '' && elements.AT.value !== '' && elements.DDD.value !== '') {

    if ([1, 2, 3, 4].includes(Number(elements.DDD.value))) {

      fetchJsonAndPopulateSelectOptions('sprint.json', 'SP');
      fetchJsonAndPopulateSelectOptions('ano.json', 'YYYY');

      if (elements.DDD.value == 1) {
        document.getElementById("YYYY").disabled = false;
        document.getElementById("SP").disabled = true;
      }
      if ([2, 3, 4].includes(Number(elements.DDD.value))) {
        document.getElementById("YYYY").disabled = false;
        document.getElementById("SP").disabled = false;
      }
    } else if (elements.DDD.value == 5) {
      document.getElementById("YYYY").disabled = false;
      document.getElementById("SP").disabled = true;
      let tasksSelect = document.getElementById("IPP");
      fetchJsonAndPopulateSelectOptions('ano.json', 'YYYY');
      fetch('idEaudMonitoramento.json')
        .then(response => response.json())
        .then(data => {
          // Populate select element with data from JSON file
          for (let task in data) {
            let option = document.createElement("option");
            option.text = task;
            tasksSelect.add(option);
          }
        });
      document.getElementById("IPP").disabled = false;
    }
  } else {
    clearSelectOptionsAndDisable("YYYY");
    clearSelectOptionsAndDisable("AA");
    clearSelectOptionsAndDisable("SP");
  }

  if ([2, 3, 4].includes(Number(elements.DDD.value))) {
    document.getElementById("ISP").disabled = false;
  } else if (elements.DDD.value === 5) {
    document.getElementById("ISP").disabled = false;
  } else { document.getElementById("ISP").disabled = true; }
});

elements.YYYY.addEventListener('change', function() {
  clearSelectOptionsAndDisable("AA");

  if (!shouldFetchAnoJson(elements.DDD.value, elements.AT.value)) {
    if ((elements.AT.value == 3 || elements.AT.value == 2) && elements.DDD.value == 1) {
      document.getElementById("AA").disabled = true;
    } else {
      if (![12, 13, 14].includes(Number(elements.DDD.value))) {
        fetchJsonAndPopulateSelectOptions('acao.json', 'AA');
        document.getElementById("AA").disabled = false;
      }
    }
  }
});

elements.enviar.addEventListener("click", function(event) {
  event.preventDefault();

  const PAA = elements.AA.value;
  const PYYYY = elements.YYYY.value;
  const PPP = elements.PP.value;
  const PDDD = elements.DDD.value;
  const PAT = elements.AT.value;
  const PSP = elements.SP.value;
  const PISP = elements.ISP.value;

  elements.Ret.value = ('<demanda>' + PDDD + '</demanda><atividade>' + PAT + '</atividade><produto>' + PPP + '</produto><idEaud>' + PISP + '</idEaud><anoAcao>' + PYYYY + '</anoAcao><idAcao>' + PAA + '</idAcao><idSprint>' + PSP + '</idSprint>');

  fetch('depara.json')
    .then(response => response.json())
    .then(data => {
      // Filter rows by selected DDD, AT and PP values
      const filteredRows = data.filter(row => row.CodDemanda == PDDD && row.CodAtividade == PAT && row.CodProduto == PPP);

      // Get the Atividade2 and nº da atividade values from the filtered rows
      let atividadePGDText = '';
      if (filteredRows.length === 0) {
        atividadePGDText = 'A descrição abaixo não corresponde com nenhuma atividade do PGD';
      } else {
        atividadePGDText = 'Sua descrição se encaixa na(s) seguinte(s) Atividade(s) do PGD: ';
        atividadePGDText += filteredRows.map(row => `${row.Atividade2}-${row['nº da atividade']} Atividade PGD`).join(', ');
      }

      // Show the atividadePGDText in an alert
      alert(atividadePGDText);
    });
});

elements.apagar.addEventListener("click", event => {
  event.preventDefault()
  clearInputValue('AA');
  clearInputValue('YYYY');
  clearInputValue('PP');
  clearInputValue('DDD');
  clearInputValue('AT');
  clearInputValue('SP');
  clearInputValue('ISP');
  clearInputValue('Ret');

  clearSelectOptionsAndDisable("AT");
  clearSelectOptionsAndDisable("PP");
  clearSelectOptionsAndDisable("YYYY");
  clearSelectOptionsAndDisable("AA");
  clearSelectOptionsAndDisable("SP");
  clearSelectOptionsAndDisable("ISP");

  // Desabilita o elemento select
  const selects = document.querySelectorAll("select");
  selects.forEach(select => select.disabled = true);
  document.getElementById("ISP").disabled = true;
  document.getElementById("DDD").disabled = false;
});

function copiarResultado() {
  if (elements.Ret.value == "") return;

  elements.Ret.select();
  navigator.clipboard.writeText(elements.Ret.value);
}

function fixText(text) {
  // Define a dictionary of special characters to replace
  const replacements = {
    'Ã¡': 'á',
    'Ã¢': 'â',
    'Ã£': 'ã',
    'Ã©': 'é',
    'Ãª': 'ê',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ã´': 'ô',
    'Ãµ': 'õ',
    'Ãº': 'ú',
    'Ã§': 'ç'
  };

  // Replace any occurrences of special characters in the text
  for (const [old, newChar] of Object.entries(replacements)) {
    text = text.split(old).join(newChar);
  }

  return text;
}

<<<<<<< HEAD
function clearElement(element) {
  element.innerHTML = '';
  element.disabled = true;
=======
function clearInputValue(inputId) {
  document.getElementById(inputId).value = '';
}

function clearSelectOptionsAndDisable(selectId) {
  const selectElement = document.getElementById(selectId);
  selectElement.innerHTML = '';
  selectElement.disabled = true;
}

function shouldFetchAnoJson(selectDDDValue, selectATValue) {
  return selectDDDValue == 6 || selectDDDValue == 10 || selectDDDValue == 8 && selectATValue == 1 || (selectDDDValue == 9 && [4, 5, 6].includes(Number(selectATValue)));
}

function fetchJsonAndPopulateSelectOptions(jsonFile, selectId) {
  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById(selectId);
      data.forEach(function(item) {
        const option = document.createElement("option");
        option.value = item.value;
        option.text = item.text;
        selectElement.add(option);
      });
    })
    .catch(error => {
      console.error(`Erro ${jsonFile}: `, error);
    });
>>>>>>> parent of e5ae606... Update app.js
}