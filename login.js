// Criar o banco de dados no PouchDB
const usuariosDb = new PouchDB('usuarios');

// Função para inserir usuário padrão (caso o banco esteja vazio)
function inserirUsuarioPadrao() {
    usuariosDb.allDocs({ include_docs: true }).then(function(result) {
        if (result.rows.length === 0) { // Verifica se o banco está vazio
            const usuarioPadrao = {
                _id: 'admin@horrorbrutal.com',  // ID do usuário padrão
                email: 'admin@horrorbrutal.com',
                senha: '666',
                tipo_acesso: 'admin'  // Tipo de acesso do usuário padrão (admin)
            };

            // Inserir o usuário padrão no banco de dados
            usuariosDb.put(usuarioPadrao).then(function() {
                console.log('Usuário padrão inserido no banco de dados.');
            }).catch(function(err) {
                console.error('Erro ao inserir usuário padrão:', err);
            });
        }
    }).catch(function(err) {
        console.error('Erro ao verificar o banco de dados:', err);
    });
}

// Inserir o usuário padrão, caso o banco esteja vazio
inserirUsuarioPadrao();

// Função para validar o login
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    console.log("Tentando fazer login com:", email, senha); // Debugging para checar o valor

    // Verificar se o usuário existe no banco de dados (PouchDB)
    usuariosDb.find({
        selector: { email: email, senha: senha }
    }).then(function(result) {
        console.log("Resultado da busca no banco de dados:", result); // Verificar o resultado

        if (result.docs.length > 0) {
            const usuario = result.docs[0];
            console.log("Usuário encontrado:", usuario); // Verificar usuário encontrado

            // Redirecionar com base no tipo de usuário
            if (usuario.tipo_acesso === 'admin') {
                window.location.href = 'admin.html'; // Redirecionar para a tela de administração
            } else {
                window.location.href = 'telaInicial.html'; // Redirecionar para a página inicial
            }
        } else {
            alert("Credenciais inválidas!");
        }
    }).catch(function(err) {
        console.error("Erro ao verificar login:", err);
    });
});

// Redirecionar para a tela de cadastro
document.getElementById("register-link").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que o link seja aberto normalmente
    window.location.href = "usuario.html"; // Altere para o caminho correto da tela de cadastro
});
