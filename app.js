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

const YYYY = document.getElementById('YYYY');
const AA = document.getElementById('AA');
const PP = document.getElementById('PP');
const AT = document.getElementById('AT');
const DDD = document.getElementById('DDD');
const SP = document.getElementById('SP');
const ISP = document.getElementById('ISP')
const enviar = document.getElementById('gerar');
const apagar = document.getElementById('reset');
const Ret = document.getElementById('Ret');
const AAP = document.getElementById('AAP');

let rows;

// Desabilita o elemento select
const selects = document.querySelectorAll("select");
selects.forEach(select => select.disabled = true);
document.getElementById("ISP").disabled = true;

window.addEventListener('load', function() {
  document.querySelector('.box').style.display = 'flex';
  fetch('depara.json')
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response from the server
      rows = data;

      // AAP
      const AAP = document.getElementById("AAP");
      const optionsAAP = ['Atividade PGD'];
      const valuesAAP = [''];
      for (let i = 0; i < rows.length; i++) {
        const numAtividade = rows[i]['nº da atividade'];
        let atividadePGD = rows[i]['Atividade PGD'];
        if (numAtividade === undefined || atividadePGD === undefined) {
          break;
        }
        atividadePGD = fixText(atividadePGD);
        if (numAtividade && atividadePGD && !optionsAAP.includes(atividadePGD)) {
          optionsAAP.push(atividadePGD);
          valuesAAP.push(numAtividade);
        }
      }
      for (let i = 0; i < optionsAAP.length; i++) {
        const option = document.createElement("option");
        option.text = optionsAAP[i];
        option.value = valuesAAP[i];
        if (isNaN(option.value)) { option.value = ''; }
        AAP.add(option);
      }

      // Enable AAP select
      document.getElementById("AAP").disabled = false;
      document.querySelector('.box').style.display = 'none';

      // DDD
      const DDD = document.getElementById("DDD");
      AAP.addEventListener('change', function() {
        // Clear DDD options
        DDD.innerHTML = '';

        // Filter rows based on selected AAP value
        const selectedNumAtividade = AAP.value;
        const filteredRows = rows.filter(row => row['nº da atividade'] === selectedNumAtividade);

        // Populate DDD options
        const optionsDDD = ['Tipo de Demanda'];
        const valuesDDD = [''];
        for (let i = 0; i < filteredRows.length; i++) {
          const codDemanda = filteredRows[i].CodDemanda;
          let tipoDemanda = filteredRows[i]['Tipo de Demanda'];
          if (codDemanda === undefined || tipoDemanda === undefined) {
            break;
          }
          tipoDemanda = fixText(tipoDemanda);
          if (codDemanda && tipoDemanda && !optionsDDD.includes(tipoDemanda)) {
            optionsDDD.push(tipoDemanda);
            valuesDDD.push(codDemanda);
          }
        }
        for (let i = 0; i < optionsDDD.length; i++) {
          const option = document.createElement("option");
          option.text = optionsDDD[i];
          option.value = valuesDDD[i];
          if (isNaN(option.value)) { option.value = ''; }
          DDD.add(option);
        }

        // Enable DDD select
        document.getElementById("DDD").disabled = false;
      });

      document.querySelector('.box').style.display = 'none';
    });
});

AAP.addEventListener('change', function() {  
  // Clear DDD options
  DDD.innerHTML = '';

  // Clear AT options
  AT.innerHTML = '';

  // Clear PP options
  PP.innerHTML = '';

  // Clear YYYY options
  YYYY.innerHTML = '';

  // Clear AA options
  AA.innerHTML = '';

  // Clear SP options
  SP.innerHTML = '';

  // Clear ISP options
  ISP.innerHTML = '';

  // Disable AT select
  document.getElementById("AT").disabled = true;

  // Disable PP select
  document.getElementById("PP").disabled = true;

  // Disable YYYY select
  document.getElementById("YYYY").disabled = true;

  // Disable AA select
  document.getElementById("AA").disabled = true;

  // Disable SP select
  document.getElementById("SP").disabled = true;

  // Disable ISP select
  document.getElementById("ISP").disabled = true;
});

// AT
DDD.addEventListener('change', function() {
  // Clear AT options
  const selectAT = document.getElementById("AT");
  selectAT.innerHTML = '';

  // Clear PP options
  const selectPP = document.getElementById("PP");
  selectPP.innerHTML = '';

  // Clear YYYY options
  const selectYYYY = document.getElementById("YYYY");
  selectYYYY.innerHTML = '';

  // Clear AA options
  const selectAA = document.getElementById("AA");
  selectAA.innerHTML = '';

  // Clear SP options
  const selectSP = document.getElementById("SP");
  selectSP.innerHTML = '';

  // Clear ISP options
  const selectISP = document.getElementById("ISP");
  selectISP.innerHTML = '';

  // Disable AT select
  document.getElementById("AT").disabled = true;

  // Disable PP select
  document.getElementById("PP").disabled = true;

  // Disable YYYY select
  document.getElementById("YYYY").disabled = true;

  // Disable AA select
  document.getElementById("AA").disabled = true;

  // Disable SP select
  document.getElementById("SP").disabled = true;

  // Disable ISP select
  document.getElementById("ISP").disabled = true;

  if (DDD.value != '' && (![12, 13, 14].includes(Number(DDD.value)))) {
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
  } else if ([12, 13, 14].includes(Number(DDD.value))) {

    fetch('ano.json')
      .then(response => response.json())
      .then(data => {
        // Use the data here
        ano = data;

        // Get the select element ano
        const selectYYYY = document.getElementById("YYYY");

        // Create and append the options to the select element
        ano.forEach(function(item) {
          const option = document.createElement("option");
          option.value = item.value;
          option.text = item.text;
          selectYYYY.add(option);
        });
      })
      .catch(error => {
        // Handle errors here
        console.error("Erro ano.json: ", error);
      });
      document.getElementById("YYYY").disabled = false;
  } else {
    // Clear AT options
    const selectAT = document.getElementById("AT");
    selectAT.innerHTML = '';

    // Enable AT select
    document.getElementById("AT").disabled = true;
  }
});

// PP
AT.addEventListener('change', function() {

  // Clear PP options
  const selectPP = document.getElementById("PP");
  selectPP.innerHTML = '';

  // Clear YYYY options
  const selectYYYY = document.getElementById("YYYY");
  selectYYYY.innerHTML = '';

  // Clear AA options
  const selectAA = document.getElementById("AA");
  selectAA.innerHTML = '';

  // Clear SP options
  const selectSP = document.getElementById("SP");
  selectSP.innerHTML = '';

  // Clear ISP options
  const selectISP = document.getElementById("ISP");
  selectISP.innerHTML = '';

  // Disable PP select
  document.getElementById("PP").disabled = true;

  // Disable YYYY select
  document.getElementById("YYYY").disabled = true;

  // Disable AA select
  document.getElementById("AA").disabled = true;

  // Disable SP select
  document.getElementById("SP").disabled = true;

  // Disable ISP select
  document.getElementById("ISP").disabled = true;

  if (DDD.value == 6 || DDD.value == 10 || DDD.value == 8 && selectAT.value == 1 || (DDD.value == 9 && [4, 5, 6].includes(Number(selectAT.value)))) {
      var ano, acao, sprint;

        fetch('ano.json')
          .then(response => response.json())
          .then(data => {
            // Use the data here
            ano = data;

            // Get the select element ano
            const selectYYYY = document.getElementById("YYYY");

            // Create and append the options to the select element
            ano.forEach(function(item) {
              const option = document.createElement("option");
              option.value = item.value;
              option.text = item.text;
              selectYYYY.add(option);
            });
          })
          .catch(error => {
            // Handle errors here
            console.error("Erro ano.json: ", error);
          });
        document.getElementById("YYYY").disabled = false;
        document.getElementById("SP").disabled = true;
        document.getElementById("AA").disabled = true;
        document.getElementById("ISP").disabled = true;
      }
  
  if ((selectAT.value !== '' && DDD.value !== '') && !(DDD.value == 6 || DDD.value == 10 || DDD.value == 8 && selectAT.value == 1 || (DDD.value == 9 && [4, 5, 6].includes(Number(selectAT.value))))) {
    // Enable PP select
    document.getElementById("PP").disabled = false;

    // Filter rows by selected DDD and AT values
    const filteredRows = rows.filter(row => row.CodDemanda == DDD.value && row.CodAtividade == this.value);

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
      selectPP.add(option);
    }
  } else {
    // Clear PP options
    const selectPP = document.getElementById("PP");
    selectPP.innerHTML = '';

    // Enable PP select
    document.getElementById("PP").disabled = true;
  }
});

PP.addEventListener('change', function() {

  var selectAT = document.getElementById("AT");
  var selectPP = document.getElementById("PP");

  // Clear YYYY options
  const selectYYYY = document.getElementById("YYYY");
  selectYYYY.innerHTML = '';

  // Clear AA options
  const selectAA = document.getElementById("AA");
  selectAA.innerHTML = '';

  // Clear SP options
  const selectSP = document.getElementById("SP");
  selectSP.innerHTML = '';

  // Clear ISP options
  const selectISP = document.getElementById("ISP");
  selectISP.innerHTML = '';

  // Disable YYYY select
  document.getElementById("YYYY").disabled = true;

  // Disable AA select
  document.getElementById("AA").disabled = true;

  // Disable SP select
  document.getElementById("SP").disabled = true;

  // Disable ISP select
  document.getElementById("ISP").disabled = true;

  if (selectPP.value !== '' && selectAT.value !== '' && DDD.value !== '') {

    var ano, acao, sprint;

    if ([1, 2, 3, 4].includes(Number(DDD.value))) {

      fetch('sprint.json')
        .then(response => response.json())
        .then(data => {
          // Use the data here
          sprint = data;
          // Get the select element ano
          const selectSP = document.getElementById("SP");

          // Create and append the options to the select element
          sprint.forEach(function(item) {
            const option = document.createElement("option");
            option.value = item.value;
            option.text = item.text;
            selectSP.add(option);
          });

        })
        .catch(error => {
          // Handle errors here
          console.error("Erro sprint.json: ", error);
        });

      fetch('ano.json')
        .then(response => response.json())
        .then(data => {
          // Use the data here
          ano = data;

          // Get the select element ano
          const selectYYYY = document.getElementById("YYYY");

          // Create and append the options to the select element
          ano.forEach(function(item) {
            const option = document.createElement("option");
            option.value = item.value;
            option.text = item.text;
            selectYYYY.add(option);
          });
        })
        .catch(error => {
          // Handle errors here
          console.error("Erro ano.json: ", error);
        });
      if (DDD.value == 1) {
        document.getElementById("YYYY").disabled = false;
        document.getElementById("SP").disabled = true;
      }
      if ([2, 3, 4].includes(Number(DDD.value))) {
        document.getElementById("YYYY").disabled = false;
        document.getElementById("SP").disabled = false;
      }
    } else if (DDD.value == 5) {
      document.getElementById("YYYY").disabled = false;
      document.getElementById("SP").disabled = true;
      let tasksSelect = document.getElementById("IPP");
      fetch('ano.json')
        .then(response => response.json())
        .then(data => {
          // Use the data here
          ano = data;

          // Get the select element ano
          const selectYYYY = document.getElementById("YYYY");

          // Create and append the options to the select element
          ano.forEach(function(item) {
            const option = document.createElement("option");
            option.value = item.value;
            option.text = item.text;
            selectYYYY.add(option);
          });
        })
        .catch(error => {
          // Handle errors here
          console.error("Erro ano.json: ", error);
        });
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
    // Clear YYYY options
    const selectYYYY = document.getElementById("YYYY");
    selectYYYY.innerHTML = '';
    document.getElementById("YYYY").disabled = true;
    // Clear AA options
    const selectAA = document.getElementById("AA");
    selectAA.innerHTML = '';
    document.getElementById("AA").disabled = true;
    // Clear SP options
    const selectSP = document.getElementById("SP");
    selectSP.innerHTML = '';
    document.getElementById("SP").disabled = true;
  }

  document.getElementById("ISP").disabled = true;

  // Clear ISP options
  selectISP.innerHTML = '';

  // Disable ISP select
  document.getElementById("ISP").disabled = true;

  if (([2, 3, 4].includes(Number(DDD.value)))) {
    document.getElementById("ISP").disabled = false;
  } else if (DDD.value === 5) {
    document.getElementById("ISP").disabled = false;
  } else { document.getElementById("ISP").disabled = true; }
});

YYYY.addEventListener('change', function() {
  // Clear YYYY options
  const selectAA = document.getElementById("AA");
  selectAA.innerHTML = '';
  if (!(DDD.value == 6 || DDD.value == 10 || DDD.value == 8 && selectAT.value == 1 || (DDD.value == 9 && [4, 5, 6].includes(Number(selectAT.value))))){
  if ((selectAT.value == 3 || selectAT.value == 2) && DDD.value == 1) {
    document.getElementById("AA").disabled = true;
  } else {
    if (![12, 13, 14].includes(Number(DDD.value))) {
    fetch('acao.json')
      .then(response => response.json())
      .then(data => {
        // Use the data here
        acao = data;
        // Get the select elements
        const selectAA = document.getElementById("AA");
        const selectYYYY = document.getElementById("YYYY");

        // Filter acao by selected YYYY value
        const filteredAcao = acao.filter(item => item.year == selectYYYY.value);

        // Create and append the options to the AA select element
        filteredAcao.forEach(function(item) {
          const option = document.createElement("option");
          option.value = item.value;
          option.text = item.text;
          selectAA.add(option);
        });
        document.getElementById("AA").disabled = false;
      })
      .catch(error => {
        // Handle errors here
        console.error("Erro acao.json: ", error);
      });
    }
  }
}
});

// Adiciona um evento de clique 
enviar.addEventListener("click", function(event) { // Previne o comportamento padrão do botão 
  event.preventDefault();

  // Aqui começa o seu código 
  const PAA = AA.value; const PYYYY = YYYY.value; const PPP = PP.value; const PDDD = DDD.value; const PAT = AT.value; const PSP = SP.value; const PISP = ISP.value

  Ret.value = ('<demanda>' + PDDD + '</demanda><atividade>' + PAT + '</atividade><produto>' + PPP + '</produto><idEaud>' + PISP + '</idEaud><anoAcao>' + PYYYY + '</anoAcao><idAcao>' + PAA + '</idAcao><idSprint>' + PSP + '</idSprint>')
});

apagar.addEventListener("click", event => {
  event.preventDefault()
  AA.value = ''
  YYYY.value = ''
  PP.value = ''
  DDD.value = ''
  AT.value = ''
  SP.value = ''
  ISP.value = ''
  Ret.value = ''
  AT.text = 'Atividade'
  PP.text = 'Produto'
  // Clear AT options
  const selectAT = document.getElementById("AT");
  selectAT.innerHTML = '';

  // Clear PP options
  const selectPP = document.getElementById("PP");
  selectPP.innerHTML = '';

  // Clear YYYY options
  const selectYYYY = document.getElementById("YYYY");
  selectYYYY.innerHTML = '';

  // Clear AA options
  const selectAA = document.getElementById("AA");
  selectAA.innerHTML = '';

  // Clear SP options
  const selectSP = document.getElementById("SP");
  selectSP.innerHTML = '';

  // Clear ISP options
  const selectISP = document.getElementById("ISP");
  selectISP.innerHTML = '';

  // Disable AT select
  document.getElementById("AT").disabled = true;

  // Disable PP select
  document.getElementById("PP").disabled = true;

  // Disable YYYY select
  document.getElementById("YYYY").disabled = true;

  // Disable AA select
  document.getElementById("AA").disabled = true;

  // Disable SP select
  document.getElementById("SP").disabled = true;

  // Disable ISP select
  document.getElementById("ISP").disabled = true;


  // Desabilita o elemento select
  const selects = document.querySelectorAll("select");
  selects.forEach(select => select.disabled = true);
  document.getElementById("ISP").disabled = true;
  document.getElementById("DDD").disabled = false;
});

function copiarResultado() {
  if (Ret.value == "") return;

  Ret.select();
  navigator.clipboard.writeText(Ret.value);
}

function fixText(text) {
  // Define a dictionary of special characters to replace
  const replacements = {
    'Ã¡': 'á',
    'Ã¢': 'â',
    'Ã£': 'ã',
    'Ã©': 'é',
    'Ãª': 'ê',
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
