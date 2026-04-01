import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc 
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

// Inicialização
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Referências do DOM ---
const form = document.getElementById('evaluationForm');
const thanksMessage = document.getElementById('thanksMessage');

/**
 * Evento de envio do formulário
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura da estrela selecionada
    const estrelaSelecionada = document.querySelector('input[name="star"]:checked');

    if (!estrelaSelecionada) {
        alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
        return;
    }

    // Coleta dos valores dos campos
    const vendedora = document.getElementById('vendedora').value;
    const comentario = document.getElementById('comentario').value;
    const nota = estrelaSelecionada.value;

    try {
        // Envio para a coleção "avaliacoes_mariana" no Firestore
        await addDoc(collection(db, "avaliacoes_mariana"), {
            vendedora: vendedora,
            nota: Number(nota),
            comentario: comentario,
            loja: "Mariana Tecidos",
            data_envio: new Date().toLocaleString("pt-BR") // Formato: DD/MM/AAAA, HH:MM:SS
        });

        // Interface: Esconde o formulário e mostra a mensagem de agradecimento
        form.style.display = 'none';
        thanksMessage.style.display = 'block';
        
        // Limpa o formulário para uma próxima utilização
        form.reset();

    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
        alert("Ops! Ocorreu um erro ao enviar sua avaliação. Tente novamente em instantes.");
    }
});