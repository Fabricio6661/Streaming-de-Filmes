const usuariosDb = new PouchDB("usuarios");

function exibirUsuarios() {
  usuariosDb.allDocs({ include_docs: true }).then(result => {
    const lista = document.getElementById("lista-usuarios");
    lista.innerHTML = "";
    result.rows.forEach(row => {
      const u = row.doc;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.nome}</td>
        <td>${u.email}</td>
        <td>${u.tipo_acesso}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${u._id}')">Excluir</button>
          <button class="btn btn-warning btn-sm" onclick="editarUsuario('${u._id}')">Editar</button>
        </td>
      `;
      lista.appendChild(tr);
    });
  }).catch(err => console.error("Erro ao listar usuários:", err));
}

function excluirUsuario(id) {
  usuariosDb.get(id).then(doc => {
    return usuariosDb.remove(doc);
  }).then(() => {
    alert("Usuário excluído com sucesso!");
    exibirUsuarios();
  }).catch(err => console.error("Erro ao excluir:", err));
}

function editarUsuario(id) {
  usuariosDb.get(id).then(doc => {
    document.getElementById("edit-id").value = doc._id;
    document.getElementById("edit-nome").value = doc.nome;
    document.getElementById("edit-email").value = doc.email;
    document.getElementById("edit-senha").value = doc.senha;
    document.getElementById("edit-tipo-acesso").value = doc.tipo_acesso;
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }).catch(err => console.error("Erro ao carregar para edição:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  exibirUsuarios();

  const formEdicao = document.getElementById("form-edicao-usuario");
  if (formEdicao) {
    formEdicao.addEventListener("submit", async event => {
      event.preventDefault();
      const id = document.getElementById("edit-id").value;

      try {
        const docExistente = await usuariosDb.get(id);
        const usuarioAtualizado = {
          _id: id,
          _rev: docExistente._rev,
          nome: document.getElementById("edit-nome").value,
          email: document.getElementById("edit-email").value,
          senha: document.getElementById("edit-senha").value,
          tipo_acesso: document.getElementById("edit-tipo-acesso").value
        };

        await usuariosDb.put(usuarioAtualizado);
        alert("Usuário editado com sucesso!");
        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
        exibirUsuarios();
      } catch (err) {
        console.error("Erro ao editar usuário:", err);
      }
    });
  }

  const btnVoltar = document.getElementById("voltar");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
