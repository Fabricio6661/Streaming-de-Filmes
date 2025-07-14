window.addEventListener("DOMContentLoaded", () => {
    if (typeof PouchDB === "undefined") {
        console.error("PouchDB não foi carregado corretamente.");
        return;
    }

    const usuariosDb = new PouchDB("usuarios");

    // Função para cadastrar um novo usuário
    const formUsuario = document.getElementById("form-usuario");
    if (formUsuario) {
        formUsuario.addEventListener("submit", function (event) {
            event.preventDefault();

            const usuario = {
                _id: new Date().toISOString(),
                nome: document.getElementById("nome").value,
                email: document.getElementById("email").value,
                senha: document.getElementById("senha").value,
                tipo_acesso: document.getElementById("tipo-acesso").value
            };

            usuariosDb.put(usuario).then(function () {
                alert("Usuário cadastrado com sucesso!");
                window.location.href = "index.html"; // Redireciona para a página principal
            }).catch(function (err) {
                console.error("Erro ao cadastrar usuário:", err);
            });
        });
    }

    // Redirecionamento para a lista de usuários
    document.getElementById("btn-lista-usuarios").addEventListener("click", function () {
        window.location.href = "listausuarios.html"; // Altere para a página de lista de usuários
    });
});
