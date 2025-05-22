// Selecionar elementos do formulário e da área de resultado
const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordInput');
const resultDiv = document.getElementById('result');

// Adicionar listener para o evento de submissão do formulário
passwordForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Impedir o comportamento padrão do formulário
    const password = passwordInput.value; // Obter o valor da senha
    const validationResult = checkPasswordStrength(password); // Verificar a força da senha
    displayResult(validationResult); // Exibir o resultado
});

// Função para verificar a força da senha
function checkPasswordStrength(password) {
    // Definir critérios de validação
    const minLength = 8;
    const hasNumber = /\d/; // Pelo menos um número
    const hasLowercase = /[a-z]/; // Pelo menos uma letra minúscula
    const hasUppercase = /[A-Z]/; // Pelo menos uma letra maiúscula
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // Pelo menos um caractere especial

    // Objeto para armazenar o resultado da validação
    const result = {
        isValid: true,
        messages: []
    };

    // Verificar cada critério
    if (password.length < minLength) {
        result.isValid = false;
        result.messages.push('A senha deve ter pelo menos 8 caracteres.');
    }

    if (!hasNumber.test(password)) {
        result.isValid = false;
        result.messages.push('A senha deve conter pelo menos um número.');
    }

    if (!hasLowercase.test(password)) {
        result.isValid = false;
        result.messages.push('A senha deve conter pelo menos uma letra minúscula.');
    }

    if (!hasUppercase.test(password)) {
        result.isValid = false;
        result.messages.push('A senha deve conter pelo menos uma letra maiúscula.');
    }

    if (!hasSpecialChar.test(password)) {
        result.isValid = false;
        result.messages.push('A senha deve conter pelo menos um caractere especial (@, #, $, etc.).');
    }

    return result;
}

// Função para exibir os resultados da validação
function displayResult(validationResult) {
    resultDiv.innerHTML = ''; // Limpar resultados anteriores

    if (validationResult.isValid) {
        resultDiv.style.color = 'green';
        resultDiv.textContent = 'Senha forte! Atende a todos os critérios.';
    } else {
        resultDiv.style.color = 'red';
        const ul = document.createElement('ul');
        validationResult.messages.forEach(message => {
            const li = document.createElement('li');
            li.textContent = message;
            ul.appendChild(li);
        });
        resultDiv.appendChild(ul);
    }
}