document.addEventListener("DOMContentLoaded", function () {
    const filmesDb = new PouchDB("filmes");

    const listaFilmes = document.getElementById("lista-filmes");

    function carregarFilmes() {
        filmesDb.allDocs({ include_docs: true }).then(result => {
            listaFilmes.innerHTML = "";
            result.rows.forEach(row => {
                const filme = row.doc;

                const card = document.createElement("div");
                card.className = "card mb-3";
                card.innerHTML = `
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${filme.imagem_url}" class="img-fluid rounded-start" alt="${filme.titulo}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${filme.titulo}</h5>
                                <p class="card-text">${filme.sinopse}</p>
                                <p class="card-text"><small class="text-muted">${filme.genero}</small></p>
                                <a href="${filme.trailer_url}" class="btn btn-sm btn-primary" target="_blank">Assistir Trailer</a>
                                <button class="btn btn-sm btn-warning ms-2 btn-editar" data-id="${filme._id}">Editar</button>
                                <button class="btn btn-sm btn-danger ms-2 btn-excluir" data-id="${filme._id}" data-rev="${filme._rev}">Excluir</button>
                            </div>
                        </div>
                    </div>
                `;
                listaFilmes.appendChild(card);
            });

            // Adiciona eventos de clique
            document.querySelectorAll(".btn-editar").forEach(btn => {
                btn.addEventListener("click", abrirFormularioEdicao);
            });

            document.querySelectorAll(".btn-excluir").forEach(btn => {
                btn.addEventListener("click", excluirFilme);
            });
        });
    }

    function abrirFormularioEdicao(e) {
        const id = e.target.dataset.id;
        filmesDb.get(id).then(filme => {
            const novoTitulo = prompt("Novo título:", filme.titulo);
            const novaSinopse = prompt("Nova sinopse:", filme.sinopse);
            const novoGenero = prompt("Novo gênero:", filme.genero);
            const novaImagem = prompt("Nova URL da imagem:", filme.imagem_url);
            const novoTrailer = prompt("Nova URL do trailer:", filme.trailer_url);

            if (novoTitulo && novaSinopse && novoGenero && novaImagem && novoTrailer) {
                filme.titulo = novoTitulo;
                filme.sinopse = novaSinopse;
                filme.genero = novoGenero;
                filme.imagem_url = novaImagem;
                filme.trailer_url = novoTrailer;

                return filmesDb.put(filme);
            }
        }).then(() => {
            alert("Filme editado com sucesso!");
            carregarFilmes();
        }).catch(err => {
            console.error("Erro ao editar filme:", err);
        });
    }

    function excluirFilme(e) {
        const id = e.target.dataset.id;
        const rev = e.target.dataset.rev;

        if (confirm("Tem certeza que deseja excluir este filme?")) {
            filmesDb.remove(id, rev).then(() => {
                alert("Filme excluído com sucesso!");
                carregarFilmes();
            }).catch(err => {
                console.error("Erro ao excluir filme:", err);
            });
        }
    }

    // Botões de navegação
    document.getElementById("retorna").addEventListener("click", () => {
        window.history.back();
    });

    document.getElementById("inicio").addEventListener("click", () => {
        window.location.href = "telaInicial.html";
    });

    carregarFilmes();
});
