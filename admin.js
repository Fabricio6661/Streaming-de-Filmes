window.addEventListener("DOMContentLoaded", () => {
    if (typeof PouchDB === "undefined") {
        console.error("PouchDB não foi carregado corretamente.");
        return;
    }

    const filmesDb = new PouchDB("filmes");

    // Função para cadastrar um novo filme
    const formFilme = document.getElementById("form-filme");
    if (formFilme) {
        formFilme.addEventListener("submit", function (event) {
            event.preventDefault();

            const filme = {
                _id: new Date().toISOString(),
                titulo: document.getElementById("titulo").value,
                sinopse: document.getElementById("sinopse").value,
                genero: document.getElementById("categoria").value,
                trailer_url: document.getElementById("trailer").value,
                imagem_url: document.getElementById("imagem").value
            };

            filmesDb.put(filme).then(function () {
                alert("Filme cadastrado com sucesso!");
                window.location.href = "listaFilmes.html"; // Redireciona para a lista de filmes
            }).catch(function (err) {
                console.error("Erro ao cadastrar filme:", err);
            });
        });
    }

    // Redirecionamento para a lista de filmes
    document.getElementById("btn-lista-filmes").addEventListener("click", function () {
        window.location.href = "listaFilmes.html"; // Altere para a página de lista de filmes
    });
});
