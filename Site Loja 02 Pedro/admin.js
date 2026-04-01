import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    query, 
    getDocs, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- Configuração do Firebase ---
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

// --- Segurança de Acesso ---
const SENHA_MESTRE = "Mariana1328"; 

if (prompt("Acesso Restrito: Digite a senha da Mariana Tecidos:") !== SENHA_MESTRE) {
    alert("Senha incorreta!");
    window.location.href = "index.html";
}

// --- Elementos do DOM ---
const tabelaCorpo = document.getElementById('tabelaCorpo');
const filtroVendedora = document.getElementById('filtroVendedora');
const filtroData = document.getElementById('filtroData');
const totalSpan = document.getElementById('totalAvaliacoes');

/**
 * Função principal para carregar e filtrar os dados do Firestore
 */
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
            
            // Tratamento da data para comparação com o input type="date"
            const partesData = dados.data_envio.split(',')[0].trim().split('/');
            const dataBancoISO = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

            // Lógica de Filtros
            const bateVendedora = (vendedoraSel === "todos" || dados.vendedora === vendedoraSel);
            const bateData = (dataSel === "" || dataBancoISO === dataSel);

            if (bateVendedora && bateData) {
                totalContado++;
                tabelaCorpo.innerHTML += `
                    <tr>
                        <td>${dados.data_envio}</td>
                        <td><strong>${dados.vendedora}</strong></td>
                        <td style="color: #f39c12;">${dados.nota} ⭐</td>
                        <td>${dados.comentario || '-'}</td>
                    </tr>
                `;
            }
        });

        totalSpan.innerText = totalContado;

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        tabelaCorpo.innerHTML = "<tr><td colspan='4' style='color: red;'>Erro ao carregar dados. Verifique as permissões.</td></tr>";
    }
}

// --- Event Listeners (Controles) ---

filtroVendedora.addEventListener('change', carregarDados);
filtroData.addEventListener('change', carregarDados);

document.getElementById('btnLimpar').addEventListener('click', () => {
    filtroVendedora.value = "todos";
    filtroData.value = "";
    carregarDados();
});

// Inicialização
carregarDados();