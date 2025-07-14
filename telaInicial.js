document.addEventListener("DOMContentLoaded", function () {
  const filmesDb = new PouchDB("filmes");
  const container = document.getElementById("filmes-categorias");
  const generoSelect = document.getElementById("filtro-genero");

  let filmesGlobal = [];
  const filmesPorPagina = 8;
  const posicoes = {}; // posição atual no carrossel de cada gênero

  function carregarGeneros(filmes) {
    const generosUnicos = [...new Set(filmes.map(f => f.genero))];
    generoSelect.innerHTML = '<option value="todos">Todos os Gêneros</option>';
    generosUnicos.forEach(genero => {
      const option = document.createElement("option");
      option.value = genero;
      option.textContent = genero.charAt(0).toUpperCase() + genero.slice(1);
      generoSelect.appendChild(option);
    });
  }

  function criarCarrossel(filmes, genero) {
    posicoes[genero] = 0;

    const carrossel = document.createElement("div");
    carrossel.classList.add("film-category");

    carrossel.innerHTML = `
      <h3 class="category-title">${genero.charAt(0).toUpperCase() + genero.slice(1)}</h3>
      <div class="film-scroll-container position-relative">
        <button class="nav-arrow left btn btn-danger position-absolute top-50 start-0 translate-middle-y" data-genero="${genero}">&#8592;</button>
        <div class="film-scroll d-flex overflow-hidden" id="scroll-${genero}"></div>
        <button class="nav-arrow right btn btn-danger position-absolute top-50 end-0 translate-middle-y" data-genero="${genero}">&#8594;</button>
      </div>
    `;

    const scrollDiv = carrossel.querySelector(`#scroll-${genero}`);

    filmes.forEach(filme => {
      const card = document.createElement("div");
      card.classList.add("card", "film-card", "me-3");
      card.style.minWidth = "200px";
      card.style.flex = "0 0 auto";
      card.innerHTML = `
        <img src="${filme.imagem_url}" alt="${filme.titulo}" style="width: 100%; height: 280px; object-fit: contain;">
        <div class="film-info p-2" style="background-color: rgba(0,0,0,0.7); color: white;">
          <h5>${filme.titulo}</h5>
          <p style="font-size: 0.8rem; max-height: 60px; overflow: hidden;">${filme.sinopse}</p>
          <button class="btn btn-sm btn-danger" onclick="abrirTrailer('${filme.trailer_url}')">Assistir</button>
        </div>
      `;
      scrollDiv.appendChild(card);
    });

    return carrossel;
  }

  function exibirFilmesPorCategoria(filmes, filtroGenero = "todos") {
    container.innerHTML = "";
    for (const key in posicoes) {
      delete posicoes[key];
    }

    let filmesFiltrados = filmes;
    if (filtroGenero !== "todos") {
      filmesFiltrados = filmes.filter(filme => filme.genero === filtroGenero);
    }

    const filmesCategorias = {};
    filmesFiltrados.forEach(filme => {
      if (!filmesCategorias[filme.genero]) filmesCategorias[filme.genero] = [];
      filmesCategorias[filme.genero].push(filme);
    });

    for (const genero in filmesCategorias) {
      const carrossel = criarCarrossel(filmesCategorias[genero], genero);
      container.appendChild(carrossel);
      atualizarCarrossel(genero);
    }

    document.querySelectorAll(".nav-arrow").forEach(btn => {
      btn.onclick = () => {
        const genero = btn.dataset.genero;
        moverCarrossel(genero, btn.classList.contains("right"));
      };
    });
  }

  function atualizarCarrossel(genero) {
    const scrollDiv = document.getElementById(`scroll-${genero}`);
    const pos = posicoes[genero] || 0;
    const larguraCard = scrollDiv.children[0]?.offsetWidth + 12 || 212; // card + margin

    scrollDiv.scrollTo({
      left: pos * larguraCard,
      behavior: "smooth"
    });
  }

  function moverCarrossel(genero, direita) {
    const scrollDiv = document.getElementById(`scroll-${genero}`);
    const total = scrollDiv.children.length;
    let pos = posicoes[genero] || 0;

    if (direita) {
      if (pos + filmesPorPagina < total) {
        pos += filmesPorPagina;
      }
    } else {
      if (pos - filmesPorPagina >= 0) {
        pos -= filmesPorPagina;
      }
    }
    posicoes[genero] = pos;
    atualizarCarrossel(genero);
  }

  window.abrirTrailer = function (url) {
    const modal = new bootstrap.Modal(document.getElementById("trailer-modal"));
    const iframe = document.getElementById("trailer-video");
    iframe.src = url.replace("watch?v=", "embed/") + "?autoplay=1";
    modal.show();
    modal._element.addEventListener("hidden.bs.modal", () => {
      iframe.src = "";
    }, { once: true });
  };

  document.getElementById("sair").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  filmesDb.allDocs({ include_docs: true }).then(result => {
    filmesGlobal = result.rows.map(r => r.doc);
    carregarGeneros(filmesGlobal);
    exibirFilmesPorCategoria(filmesGlobal);

    generoSelect.addEventListener("change", () => {
      exibirFilmesPorCategoria(filmesGlobal, generoSelect.value);
    });
  });
});
