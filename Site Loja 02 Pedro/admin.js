import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth(app);

const EMAIL_ADM = "admin2864@gmail.com"; 

const modal = document.getElementById('modalSenha');
const painel = document.getElementById('conteudoPainel');
const inputSenha = document.getElementById('inputSenhaMestre');
const btnEntrar = document.getElementById('btnVerificarSenha');
const tabelaCorpo = document.getElementById('tabelaCorpo');
const filtroVendedora = document.getElementById('filtroVendedora');
const filtroData = document.getElementById('filtroData');
const totalSpan = document.getElementById('totalAvaliacoes');

btnEntrar.addEventListener('click', async () => {
    const senhaDigitada = inputSenha.value;
    btnEntrar.innerText = "Verificando...";
    btnEntrar.disabled = true;

    try {
        await signInWithEmailAndPassword(auth, EMAIL_ADM, senhaDigitada);
        modal.style.display = 'none';
        painel.style.display = 'block';
        carregarDados();
    } catch (error) {
        alert("Acesso Negado: Senha incorreta.");
        inputSenha.value = "";
    } finally {
        btnEntrar.innerText = "Entrar";
        btnEntrar.disabled = false;
    }
});

inputSenha.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnEntrar.click();
});

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
        tabelaCorpo.innerHTML = "<tr><td colspan='4'>Erro de permissão.</td></tr>";
    }
}

filtroVendedora.addEventListener('change', carregarDados);
filtroData.addEventListener('change', carregarDados);
document.getElementById('btnLimpar').addEventListener('click', () => {
    filtroVendedora.value = "todos";
    filtroData.value = "";
    carregarDados();
});