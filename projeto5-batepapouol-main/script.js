let nome;

function login() {
  nome = prompt("Qual nome você quer usar?");

  const usuario = {
    name: nome
  };

  const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);

  requisicao
    .then(() => {
      setInterval(() => {axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario)},
      5000)})
    .catch(() => {
      login();
    });
}
 
renderizaMensagens()
login();

function renderizaMensagens() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  
  setInterval(()=>{promise.then((element) => {
    element.data.forEach((value) => {
      const mensagem = document.querySelector("ul");
      if (value.type === "status") {
        mensagem.innerHTML += `<li class = "status">
             <span class="time">(${value.time})</span>
             <span class="nick">${value.from}</span> ${value.text}
           </li> `;
      } else if (value.type === "message") {
        mensagem.innerHTML += `<li>
          <span class="time">(${value.time})</span> <span class="nick">${value.from}</span> para
          <span class="to">${value.to}: </span>${value.text}
        </li>`;
      } else if (value.type === "private_message" && value.from === nome) {
        mensagem.innerHTML += `<li class="private">
          <span class="time">(${value.time})</span>
          <span class="nick">${value.from}</span> reservadamente para
          <span class="nick">${value.from}: </span>${value.text}
        </li>`;
      }
      mensagem.lastElementChild.scrollIntoView()
    });
  })
  },3000);
}


const input = document.querySelector("input");
input.addEventListener("keypress", enviarMensagem);

const menagem_digitada = document.querySelector("input");

function enviarMensagem(digitado) {
  if (digitado.key === "Enter") {
    const mensagem = {
      from: `${nome}`,
      to: "Todos",
      text: `${menagem_digitada.value}`,
      type: "message",
    };
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    menagem_digitada.value = "";
  }
}

