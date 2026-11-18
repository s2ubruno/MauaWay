window.UI = (() => {
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const labels = { want: "Quero ir", visited: "Já fui", favorite: "Favoritos" };
  let timer;
  const toast = (message) => {
    const el = document.querySelector("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove("show"), 3200);
  };
  const loginLink = () =>
    `login.html?next=${encodeURIComponent(location.pathname.split("/").pop() + location.search)}`;
  const requireUser = () => {
    if (MW.user()) return true;
    location.href = loginLink();
    return false;
  };
  const rating = (placeId) => {
    const rows = MW.reviews(placeId);
    return rows.length
      ? {
          score: rows.reduce((n, r) => n + r.rating, 0) / rows.length,
          count: rows.length,
        }
      : null;
  };
  const ratingText = (placeId) => {
    const r = rating(placeId);
    return r
      ? `<strong>★ ${r.score.toFixed(1).replace(".", ",")}</strong> · ${r.count} ${r.count === 1 ? "avaliação local" : "avaliações locais"}`
      : "☆ Ainda sem avaliações";
  };
  const card = (p) => {
    const tags = MW.tags(p.id);
    return `<article class="card"><a class="cover" href="lugar.html?id=${p.id}" aria-label="Conhecer ${esc(p.name)}"><img src="${p.image}" alt="Ilustração de ${esc(p.category.toLowerCase())}" width="360" height="280" loading="lazy"><span class="cover-label">${esc(p.category)}</span></a><div class="card-body"><div class="card-meta"><span>MAUÁ · SP</span><span>↗</span></div><h3><a href="lugar.html?id=${p.id}">${esc(p.name)}</a></h3><p class="neighborhood">⌖ ${esc(p.neighborhood)}</p><div class="rating">${ratingText(p.id)}</div><div class="card-actions"><button class="save-btn ${tags.includes("want") ? "selected" : ""}" data-place="${p.id}" data-tag="want" aria-pressed="${tags.includes("want")}" aria-label="Quero ir: ${esc(p.name)}">${tags.includes("want") ? "✓" : "＋"} Quero ir</button><button class="save-btn favorite ${tags.includes("favorite") ? "selected" : ""}" data-place="${p.id}" data-tag="favorite" aria-pressed="${tags.includes("favorite")}" aria-label="Favoritar ${esc(p.name)}">${tags.includes("favorite") ? "♥" : "♡"}</button></div></div></article>`;
  };
  const empty = (
    title,
    description,
    link = "index.html",
    action = "Explorar lugares",
  ) =>
    `<div class="empty"><span class="empty-icon" aria-hidden="true">↗</span><h3>${esc(title)}</h3><p>${esc(description)}</p><a class="button" href="${link}">${esc(action)}</a></div>`;
  const bindTags = () => {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tag]");
      if (!btn) return;
      if (!requireUser()) return;
      try {
        const tag = btn.dataset.tag;
        MW.toggle(btn.dataset.place, tag);
        const active = MW.tags(btn.dataset.place).includes(tag);
        toast(
          active
            ? `Adicionado a ${labels[tag]}.`
            : `Removido de ${labels[tag]}.`,
        );
        document.dispatchEvent(new Event("tagschange"));
      } catch (error) {
        toast(error.message);
      }
    });
  };
  const tabKeys = (container) => {
    container.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
      const tabs = [...container.querySelectorAll("[role=tab]")];
      let i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      i =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? tabs.length - 1
            : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) %
              tabs.length;
      tabs[i].click();
      tabs[i].focus();
    });
  };
  const page = location.pathname.split("/").pop() || "index.html";
  const u = MW.user();
  document.querySelector("#header").innerHTML =
    `<nav class="nav" aria-label="Navegação principal"><a class="brand" href="index.html" aria-label="MauáWay, início">mauá<span>way</span><i>↗</i></a><div class="nav-links"><a class="${page === "index.html" ? "active" : ""}" href="index.html" ${page === "index.html" ? 'aria-current="page"' : ""}>Descobrir</a><a class="${page === "perfil.html" ? "active" : ""}" href="perfil.html">Minha estante</a><a class="${page === "sobre.html" ? "active" : ""}" href="sobre.html">Sobre o projeto</a></div><span class="location">⌖ Mauá, São Paulo</span><a class="button small" href="${u ? "perfil.html" : "login.html"}">${u ? esc(u.name.split(" ")[0]) + " ↗" : "Entrar →"}</a></nav>`;
  if (!MW.available) {
    const warning = document.createElement("div");
    warning.className = "storage-alert";
    warning.textContent =
      "Armazenamento indisponível ou dados incompatíveis. Você pode explorar os lugares, mas não salvar alterações. Consulte o LEIA-ME.";
    document.querySelector("#header").after(warning);
  }
  bindTags();
  return {
    esc,
    labels,
    toast,
    card,
    empty,
    rating,
    ratingText,
    requireUser,
    loginLink,
    tabKeys,
  };
})();
