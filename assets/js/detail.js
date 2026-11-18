(() => {
  const p = PLACES.find(
    (p) => p.id === new URLSearchParams(location.search).get("id"),
  );
  const root = document.querySelector("#place-detail");
  if (!p) {
    root.innerHTML = UI.empty(
      "Lugar não encontrado.",
      "Escolha um estabelecimento no catálogo para continuar.",
    );
    return;
  }
  document.title = p.name + " | MauáWay";
  function tags() {
    return Object.entries(UI.labels)
      .map(
        ([key, label]) =>
          `<button class="tag-toggle ${MW.tags(p.id).includes(key) ? "selected" : ""}" data-place="${p.id}" data-tag="${key}" aria-pressed="${MW.tags(p.id).includes(key)}">${MW.tags(p.id).includes(key) ? "✓" : "＋"} ${label}</button>`,
      )
      .join("");
  }
  root.innerHTML = `<section class="detail-hero"><div><img class="detail-cover" src="${p.image}" alt="Ilustração de ${UI.esc(p.category)}" width="360" height="280"><p class="image-caption">Capa ilustrativa · não é foto do estabelecimento</p></div><div><div class="eyebrow">${UI.esc(p.category.toUpperCase())} · MAUÁ, SP</div><h1>${UI.esc(p.name)}</h1><div class="rating" id="detail-rating"></div><p class="lead">${UI.esc(p.description)}</p><p>⌖ ${UI.esc(p.address)}<br>${UI.esc(p.neighborhood)} · Mauá, São Paulo</p><div class="detail-actions" id="detail-tags">${tags()}</div><div class="detail-info"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " " + p.address + " Mauá SP")}" target="_blank" rel="noopener noreferrer">Ver no mapa ↗</a><a href="${p.source}" target="_blank" rel="noopener noreferrer">Consultar fonte ↗</a></div><div class="keywords">${p.keywords
    .slice(0, 5)
    .map(
      (k) =>
        `<a href="index.html?q=${encodeURIComponent(k)}">#${UI.esc(k)}</a>`,
    )
    .join(
      "",
    )}</div></div></section><section class="review-layout"><div><div class="eyebrow">EXPERIÊNCIAS QUE CONECTAM</div><h2>Avaliações do lugar</h2><p>Experiências registradas neste navegador.</p><div id="reviews"></div></div><aside class="review-form-box" id="review-box"></aside></section><p class="local-notice">Informações consultadas em 05/10/2026. Confirme funcionamento, endereço e cardápio diretamente com o estabelecimento antes de ir.</p><dialog id="delete-dialog"><h2>Excluir sua avaliação?</h2><p>O texto e a nota serão removidos deste navegador.</p><div class="detail-actions"><button class="button secondary" id="cancel-delete">Cancelar</button><button class="button danger" id="confirm-delete">Excluir avaliação</button></div></dialog>`;
  function renderReviews() {
    const rows = MW.reviews(p.id).sort((a, b) => b.date.localeCompare(a.date));
    document.querySelector("#detail-rating").innerHTML = UI.ratingText(p.id);
    document.querySelector("#reviews").innerHTML = rows.length
      ? rows
          .map(
            (r) =>
              `<article class="review-card"><header><strong>${UI.esc(r.author)}</strong><span class="stars" aria-label="${r.rating} de 5 estrelas">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span></header><p>${UI.esc(r.text)}</p><time datetime="${r.date}">${new Date(r.date).toLocaleDateString("pt-BR")}</time>${r.userId === MW.user()?.id ? `<div class="review-own-actions"><button id="edit-review">Editar</button><button data-delete="${r.id}">Excluir</button></div>` : ""}</article>`,
          )
          .join("")
      : '<div class="empty"><span class="empty-icon">☆</span><h3>Você pode ser o primeiro.</h3><p>Já conhece este lugar? Conte sua experiência.</p></div>';
    document.querySelector("#edit-review")?.addEventListener("click", () => {
      document.querySelector("#review-text").focus();
    });
    document.querySelector("[data-delete]")?.addEventListener("click", (e) => {
      document.querySelector("#confirm-delete").dataset.review =
        e.target.dataset.delete;
      document.querySelector("#delete-dialog").showModal();
    });
  }
  function renderForm() {
    const u = MW.user(),
      box = document.querySelector("#review-box");
    if (!u) {
      box.innerHTML = `<h3>Sua experiência importa.</h3><p>Entre para avaliar este lugar e compartilhar suas descobertas.</p><a class="button" href="${UI.loginLink()}">Entrar para avaliar →</a>`;
      return;
    }
    const own = MW.reviews(p.id).find((r) => r.userId === u.id);
    box.innerHTML = `<h3>${own ? "Sua avaliação" : "Como foi a sua visita?"}</h3><form id="review-form"><fieldset class="star-picker"><legend>Sua nota (de 1 a 5 estrelas)</legend><div class="star-buttons">${[1, 2, 3, 4, 5].map((n) => `<label><input type="radio" name="rating" value="${n}" required aria-label="${n} ${n === 1 ? "estrela" : "estrelas"}" ${own?.rating === n ? "checked" : ""}><span aria-hidden="true">${n}</span></label>`).join("")}</div></fieldset><label for="review-text">Conte sua experiência</label><textarea id="review-text" name="text" required minlength="10" maxlength="1000" placeholder="O que você gostou? O que vale a pena saber?">${UI.esc(own?.text || "")}</textarea><small id="char-count"></small><p class="form-error" id="review-error" role="alert"></p><button class="button full" type="submit">${own ? "Salvar alterações" : "Publicar avaliação"}</button><p class="local-notice">A avaliação fica disponível apenas neste navegador. Evite informações pessoais no texto.</p></form>`;
    const input = document.querySelector("#review-text"),
      counter = document.querySelector("#char-count");
    const update = () =>
      (counter.textContent = `${input.value.length}/1000 caracteres · mínimo de 10`);
    input.oninput = update;
    update();
    document.querySelector("#review-form").onsubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        MW.saveReview(
          p.id,
          Number(new FormData(form).get("rating")),
          input.value,
        );
        renderReviews();
        renderForm();
        UI.toast("Avaliação salva. Obrigado por compartilhar!");
      } catch (err) {
        document.querySelector("#review-error").textContent = err.message;
      }
    };
  }
  document.addEventListener("tagschange", () => {
    const focused = document.activeElement?.dataset.tag;
    document.querySelector("#detail-tags").innerHTML = tags();
    if (focused) document.querySelector(`[data-tag="${focused}"]`)?.focus();
  });
  document.querySelector("#cancel-delete").onclick = () =>
    document.querySelector("#delete-dialog").close();
  document.querySelector("#confirm-delete").onclick = (e) => {
    try {
      MW.deleteReview(e.target.dataset.review);
      document.querySelector("#delete-dialog").close();
      renderReviews();
      renderForm();
      UI.toast("Avaliação excluída.");
    } catch (err) {
      UI.toast(err.message);
    }
  };
  renderReviews();
  renderForm();
})();
