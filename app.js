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
const IPP = document.getElementById('IPP')
const ISP = document.getElementById('ISP')
const enviar = document.getElementById('gerar');
const apagar = document.getElementById('reset');
const Ret = document.getElementById('Ret');

var primeiraColuna = document.getElementById('DDD');
var segundaColuna = document.getElementById('AT');
var terceiraColuna = document.getElementById('PP');
var acaoColuna = document.getElementById('AA');
var eaudColuna = document.getElementById('IPP');

// Desabilita o elemento select
const selects = document.querySelectorAll("select");
selects.forEach(select => select.disabled = true);

window.addEventListener('load', function() {
  document.querySelector('.box').style.display = 'flex';
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText); // Log the response from the server
      const rows = JSON.parse(this.responseText);
      const codIndex = rows[0].indexOf("CodDemanda");
      const tipoIndex = rows[0].indexOf("Tipo de Demanda");
      const codAtividadeIndex = rows[0].indexOf("CodAtividade");
      const atividadeIndex = rows[0].indexOf("Atividade");
      const codProdutoIndex = rows[0].indexOf("CodProduto");
      const produtoIndex = rows[0].indexOf("Produto");

      // DDD
      const optionsDDD = [];
      const valuesDDD = [];
      for (let i = 1; i < rows.length; i++) {
        const cod = rows[i][codIndex];
        const tipo = rows[i][tipoIndex];
        if (cod === undefined || tipo === undefined) {
          break;
        }
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
        if (isNaN(option.value)){option.value = '';}
        selectDDD.add(option);
      }

      // AT
      selectDDD.addEventListener('change', function() {
        // Clear AT options
        const selectAT = document.getElementById("AT");
        selectAT.innerHTML = '';
        
        // Filter rows by selected DDD value
        const filteredRows = rows.filter(row => row[codIndex] == this.value);
        
        // Populate AT options
        const optionsAT = [];
        const valuesAT = [];
        for (let i = 0; i < filteredRows.length; i++) {
          const codAtividade = filteredRows[i][codAtividadeIndex];
          const atividade = filteredRows[i][atividadeIndex];
          if (codAtividade === undefined && atividade === undefined) {
            break;
          }
          if ((codAtividade && atividade && !optionsAT.includes(atividade)) && (codAtividade !== undefined && atividade !== undefined)) {
            optionsAT.push(atividade);
            valuesAT.push(codAtividade);
          }
        }
        for (let i = 0; i < optionsAT.length; i++) {
          const option = document.createElement("option");
          option.text = optionsAT[i];
          option.value = valuesAT[i];
          selectAT.add(option);
        }
        
        // Trigger change event to populate PP options
        selectAT.dispatchEvent(new Event('change'));
      });

      // PP
      const selectAT = document.getElementById("AT");
      selectAT.addEventListener('change', function() {
        // Clear PP options
        const selectPP = document.getElementById("PP");
        selectPP.innerHTML = '';
        
        // Filter rows by selected DDD and AT values
        const filteredRows = rows.filter(row => row[codIndex] == selectDDD.value && row[codAtividadeIndex] == this.value);
        
        // Populate PP options
        const optionsPP = [];
        const valuesPP = [];
        for (let i = 0; i < filteredRows.length; i++) {
          const codProduto = filteredRows[i][codProdutoIndex];
          const produto = filteredRows[i][produtoIndex];
          if (codProduto === undefined && produto === undefined) {
            break;
          }
          if ((codProduto && produto && !optionsPP.includes(produto)) && (codProduto !== undefined && produto !== undefined)) {
            optionsPP.push(produto);
            valuesPP.push(codProduto);
          }
        }
        for (let i = 0; i < optionsPP.length; i++) {
          const option = document.createElement("option");
          option.text = optionsPP[i];
          option.value = valuesPP[i];
          selectPP.add(option);
        }
      });
      
      // Trigger change event to populate AT and PP options
      selectDDD.dispatchEvent(new Event('change'));
      
      document.querySelector('.box').style.display = 'none';
    }
  };
  xhr.open("GET", "get_data.php", true);
  xhr.send();
});

primeiraColuna.addEventListener('change', function() {

  var selectDDD = document.getElementById("DDD");
  var selectAT = document.getElementById("AT");
  var selectPP = document.getElementById("PP");

  document.getElementById("AT").disabled = true;
  document.getElementById("PP").disabled = true;
  document.getElementById("AA").disabled = true;
  document.getElementById("YYYY").disabled = true;
  document.getElementById("SP").disabled = true;
  document.getElementById("IPP").disabled = true;

  AA.value = ''
  YYYY.value = ''
  SP.value = ''
  IPP.value = ''
  Array.from(selectPP.options).forEach(function(option) {
    if (isNaN(option.value)) {
      PP.value = option.value;
    }
  });
  Array.from(selectAT.options).forEach(function(option) {
    if (isNaN(option.value)) {
      AT.value = option.value;
    }
  });

  if (selectDDD.value !== '') {
    // Filter options displayed based on data-ddd of selectElement equals the DDD selected on primeiraColuna change
    let hasMatch = false;
    Array.from(selectAT.options).forEach(function(option) {
      if ((option.getAttribute('data-ddd') === selectDDD.value)) {
        option.style.display = 'block';
        hasMatch = true;
      } else {
        option.style.display = 'none';
      }
    });
    if (!hasMatch) {
      let blankOption = document.createElement('option');
      blankOption.text = '';
      blankOption.value = '';
      selectAT.add(blankOption);
    }
    document.getElementById("AT").disabled = false;
  } else {
    document.getElementById("AT").disabled = true;
  }

});

segundaColuna.addEventListener('change', function() {

  var selectDDD = document.getElementById("DDD");
  var selectAT = document.getElementById("AT");
  var selectPP = document.getElementById("PP");

  document.getElementById("PP").disabled = true;
  document.getElementById("AA").disabled = true;
  document.getElementById("YYYY").disabled = true;
  document.getElementById("SP").disabled = true;
  document.getElementById("IPP").disabled = true;

  AA.value = ''
  YYYY.value = ''
  SP.value = ''
  IPP.value = ''
  Array.from(selectPP.options).forEach(function(option) {
    if (isNaN(option.value)) {
      PP.value = option.value;
    }
  });

  if (selectDDD.value !== '') {
    // Filter options displayed based on data-ddd of selectElement equals the DDD selected on primeiraColuna change
    let hasMatch = false;
    Array.from(selectPP.options).forEach(function(option) {
      if ((option.getAttribute('data-ddd') === selectDDD.value && option.getAttribute('data-at') === selectAT.value)) {
        option.style.display = 'block';
        hasMatch = true;
      } else {
        option.style.display = 'none';
      }
    });
    if (!hasMatch) {
      let blankOption = document.createElement('option');
      blankOption.text = '';
      blankOption.value = '';
      selectPP.add(blankOption);
    }
    document.getElementById("PP").disabled = false;
  } else {
    document.getElementById("PP").disabled = true;
  }
});

terceiraColuna.addEventListener('change', function() {

  var selectDDD = document.getElementById("DDD");
  var selectAT = document.getElementById("AT");
  var selectPP = document.getElementById("PP");

  var ano, acao, sprint;

  if ([1, 2, 3, 4].includes(Number(selectDDD.value))) {
    fetch('acao.json')
      .then(response => response.json())
      .then(data => {
        // Use the data here
        acao = data;
        // Get the select element ano
        const selectAA = document.getElementById("AA");

        // Create and append the options to the select element
        acao.forEach(function(item) {
          const option = document.createElement("option");
          option.value = item.value;
          option.text = item.text;
          selectAA.add(option);
    });
      })
      .catch(error => {
        // Handle errors here
        console.error("Erro acao.json: ", error);
      });

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
    console.log("texto teste ",selectDDD.value)
    if (selectDDD.value == 1){
      document.getElementById("YYYY").disabled = false;
      document.getElementById("AA").disabled = true;
      document.getElementById("SP").disabled = true;
    }
    if ([2, 3, 4].includes(Number(selectDDD.value))){
      document.getElementById("YYYY").disabled = false;
      document.getElementById("AA").disabled = false;
      document.getElementById("SP").disabled = false;
    }
  } else if (selectDDD.value == 5){
      document.getElementById("YYYY").disabled = false;
      document.getElementById("AA").disabled = false;
      document.getElementById("SP").disabled = true;
      let tasksSelect = document.getElementById("IPP");
      fetch('acao.json')
      .then(response => response.json())
      .then(data => {
        // Use the data here
        acao = data;
        // Get the select element ano
        const selectAA = document.getElementById("AA");

        // Create and append the options to the select element
        acao.forEach(function(item) {
          const option = document.createElement("option");
          option.value = item.value;
          option.text = item.text;
          selectAA.add(option);
    });
      })
      .catch(error => {
        // Handle errors here
        console.error("Erro acao.json: ", error);
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
});

acaoColuna.addEventListener('change', function() {
  var selectAA = document.getElementById("AA");
  var selectDDD = document.getElementById("DDD");

  ISP.options.length = 0;

  document.getElementById("ISP").disabled = true;

  if (selectAA.value !== '' && ([2, 3, 4].includes(Number(selectDDD.value)))) {
    let tasksSelect = document.getElementById("IPP");
    fetch('idEaud.json')
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
  } else if (selectDDD.value === 5) {
    let tasksSelect = document.getElementById("IPP");
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
    } else if (selectDDD.value == 5) {document.getElementById("IPP").disabled = false;} else {document.getElementById("IPP").disabled = true;}
});

eaudColuna.addEventListener('click', function() {
  var selectIPP = document.getElementById("IPP");

  // Clear options of ISP select element
  let ISP = document.getElementById("ISP");
  while (ISP.options.length > 0) {
    ISP.remove(0);
  }
  ISP.options.length = 0;

  if (selectIPP.text !== '' && selectDDD != 5) {
    let tasksSelect = document.getElementById("IPP");
    let subtasksSelect = document.getElementById("ISP");

    // Assign onchange property outside of fetch function
    tasksSelect.onchange = function() {
      subtasksSelect.options.length = 0;
      let selectedTask = tasksSelect.options[tasksSelect.selectedIndex].text;
      fetch('idEaud.json')
      .then(response => response.json())
      .then(data => {
        // Populate select element with data from JSON file
        for (let subtask of data[selectedTask]) {
          // Check if option already exists
          let optionExists = false;
          for (let i = 0; i < subtasksSelect.options.length; i++) {
            if (subtasksSelect.options[i].text === subtask) {
              optionExists = true;
              break;
            }
          }
          // Add option if it doesn't already exist
          if (!optionExists) {
            let option = document.createElement("option");
            option.text = subtask;
            subtasksSelect.add(option);
          }
        }
      });
    }

    tasksSelect.onchange();
    document.getElementById("ISP").disabled = false;
  } else {document.getElementById("ISP").disabled = true;}
});

/*
// Adiciona um evento de mudança de valor 
IPP.addEventListener('change', function() { 
  // Obtém o valor do input 
  var valor = IPP.value;
  // Verifica se o valor é um número e tem menos de 7 dígitos 
  if (isNaN(valor) === false && valor.length < 7) { 
    // Mostra um alerta 
    alert("O número tem menos de 7 dígitos"); 
  }
});
*/

/*
IPP.addEventListener('input', function() {
  if (this.value.length > 7) {
    this.value = this.value.slice(0, 7);
  }
});
*/

/*
YYYY.addEventListener('change', ()=> {
   let arr = []
   let str = ''
   
   possibilidades.forEach(element => {
      if(element.ano == YYYY.value || element.ano == '') arr.push(element)
   });

   arr.map(item => str += `<option value="${item.value}">${item.text}</option>`)

   AA.innerHTML = str
});
*/

// Adiciona um evento de clique 
enviar.addEventListener("click", function(event) { // Previne o comportamento padrão do botão 
  event.preventDefault();

  // Aqui começa o seu código 
  const PAA = AA.value; const PYYYY = YYYY.value; const PPP = PP.value; const PDDD = DDD.value; const PAT = AT.value; const PSP = SP.value; const PIPP = IPP.value; const PISP = ISP.value

  Ret.value = ('<demanda>'+PDDD+'</demanda><atividade>'+PAT+'</atividade><produto>'+PPP+'</produto><idEaud>'+PIPP+'</idEaud><idSubEaud>'+PISP+'</idSubEaud><anoAcao>'+PYYYY+'</anoAcao><idAcao>'+PAA+'</idAcao><idSprint>'+PSP+'</idSprint>') 
});

apagar.addEventListener("click", event => {
  event.preventDefault()
  AA.value = ''
  YYYY.value = ''
  PP.value = ''
  DDD.value = ''
  AT.value = ''
  SP.value = ''
  IPP.value = ''
  ISP.value = ''
  Ret.value = '' 
  AT.text = 'Atividade'
  PP.text = 'Produto'

  // Clear options of select elements
  YYYY.options.length = 0;
  AA.options.length = 0;
  SP.options.length = 0;
  IPP.options.length = 0;
  ISP.options.length = 0;

  // Desabilita o elemento select
  const selects = document.querySelectorAll("select");
  selects.forEach(select => select.disabled = true);
  document.getElementById("DDD").disabled = false;
});

function copiarResultado() {
   if(Ret.value == "") return;

   Ret.select();
   navigator.clipboard.writeText(Ret.value); 
}