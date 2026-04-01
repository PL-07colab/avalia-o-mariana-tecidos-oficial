import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWRu18Brpzxdv3_t7TggwQ6Dw3iSm7F5c",
  authDomain: "avaliacao-mariana-tecidos.firebaseapp.com",
  projectId: "avaliacao-mariana-tecidos",
  storageBucket: "avaliacao-mariana-tecidos.firebasestorage.app",
  messagingSenderId: "454500384305",
  appId: "1:454500384305:web:bbca001a2fa87f06959f10"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// LÓGICA DE ACESSO COM O NOVO MODAL
const SENHA_MESTRE = "Mariana1328"; 
const modal = document.getElementById('modalSenha');
const painel = document.getElementById('conteudoPainel');
const inputSenha = document.getElementById('inputSenhaMestre');
const btnEntrar = document.getElementById('btnVerificarSenha');

btnEntrar.addEventListener('click', () => {
    if (inputSenha.value === SENHA_MESTRE) {
        modal.style.display = 'none'; // Esconde o modal
        painel.style.display = 'block'; // Mostra o painel
        carregarDados(); // Carrega os dados do Firebase
    } else {
        alert("Senha incorreta!");
        inputSenha.value = "";
    }
});

// Permitir dar "Enter" no campo de senha
inputSenha.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnEntrar.click();
});

const tabelaCorpo = document.getElementById('tabelaCorpo');
const filtroVendedora = document.getElementById('filtroVendedora');
const filtroData = document.getElementById('filtroData');
const totalSpan = document.getElementById('totalAvaliacoes');

async function carregarDados() {
    const vendedoraSel = filtroVendedora.value;
    const dataSel = filtroData.value;
    tabelaCorpo.innerHTML = "<tr><td colspan='4'>Buscando dados...</td></tr>";
    
    try {
        const q = query(collection(db, "avaliacoes_mariana"), orderBy("data_envio", "desc"));
        const querySnapshot = await getDocs(q);
        tabelaCorpo.innerHTML = ""; 
        let totalContado = 0;

        querySnapshot.forEach((doc) => {
            const dados = doc.data();
            const partesData = dados.data_envio.split(',')[0].trim().split('/');
            const dataBancoISO = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

            const bateVendedora = (vendedoraSel === "todos" || dados.vendedora === vendedoraSel);
            const bateData = (dataSel === "" || dataBancoISO === dataSel);

            if (bateVendedora && bateData) {
                totalContado++;
                tabelaCorpo.innerHTML += `
                    <tr>
                        <td>${dados.data_envio}</td>
                        <td>${dados.vendedora}</td>
                        <td>${dados.nota} ⭐</td>
                        <td>${dados.comentario || '-'}</td>
                    </tr>
                `;
            }
        });
        totalSpan.innerText = totalContado;
    } catch (error) {
        console.error(error);
        tabelaCorpo.innerHTML = "<tr><td colspan='4'>Erro. Verifique as Regras no Firebase.</td></tr>";
    }
}

filtroVendedora.addEventListener('change', carregarDados);
filtroData.addEventListener('change', carregarDados);
document.getElementById('btnLimpar').addEventListener('click', () => {
    filtroVendedora.value = "todos";
    filtroData.value = "";
    carregarDados();
});