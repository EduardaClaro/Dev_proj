// Verificador de Palíndromos

document.getElementById("verificar").addEventListener("click", function() {
    const palavra = document.getElementById("palavra").value;
    const resultado = document.getElementById("resultado");
    
    if (palavra.trim() === "") {
        resultado.textContent = "Por favor, insira uma palavra válida.";
        return;
    }
    
    // Remove espaços e caracteres especiais, converte para minúsculas
    const palavraLimpa = palavra.toLowerCase().replace(/[^a-z0-9]/g, "");
    const ehPalindromo = palavraLimpa === palavraLimpa.split("").reverse().join("");
    
    resultado.textContent = ehPalindromo ? "É um palíndromo!" : "Não é um palíndromo.";
});