(() => {
  const u = MW.user(),
    head = document.querySelector("#profile-head");
  if (!u) {
    head.innerHTML = UI.empty(
      "Sua estante começa com você.",
      "Entre ou crie uma conta para guardar os lugares que quer conhecer e os que já fazem parte da sua história.",
      "login.html?next=perfil.html",
      "Entrar na minha estante",
    );
    return;
  }
  let current = "all";
  const tabs = {
    all: "Todos",
    want: "Quero ir",
    visited: "Já fui",
    favorite: "Favoritos",
    reviews: "Avaliações",
  };
  function profileHeader() {
    const user = MW.user();
    head.innerHTML = `<div class="avatar" aria-hidden="true">${UI.esc(
      user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    )}</div><div class="profile-info"><div class="eyebrow">MINHA ESTANTE DE LUGARES</div><h1>${UI.esc(user.name)}</h1><p>${UI.esc(user.bio || "Mauá tem muito para descobrir. Por onde vamos começar?")}</p><small>⌖ Mauá, SP${user.demo ? " · Perfil de demonstração" : ""}</small></div><div class="profile-buttons"><button class="button secondary small" id="edit">Editar perfil</button><button class="button secondary small" id="logout">Sair da conta</button></div>`;
    document.querySelector("#logout").onclick = () => {
      try {
        MW.logout();
        location.href = "index.html";
      } catch (e) {
        UI.toast(e.message);
      }
    };
    document.querySelector("#edit").onclick = () => {
      const f = document.querySelector("#profile-form");
      f.elements.name.value = user.name;
      f.elements.bio.value = user.bio;
      document.querySelector("#edit-profile").showModal();
    };
  }
  function render() {
    const saved = PLACES.filter((p) => MW.tags(p.id).length),
      reviews = MW.reviews().filter((r) => r.userId === u.id);
    const counts = { all: saved.length, reviews: reviews.length };
    Object.keys(UI.labels).forEach(
      (t) =>
        (counts[t] = saved.filter((p) => MW.tags(p.id).includes(t)).length),
    );
    document.querySelector("#profile-tabs").innerHTML = Object.entries(tabs)
      .map(
        ([key, label]) =>
          `<button id="tab-${key}" role="tab" aria-controls="collection" aria-selected="${current === key}" tabindex="${current === key ? 0 : -1}" data-tab="${key}">${label}<span class="badge">${counts[key]}</span></button>`,
      )
      .join("");
    document.querySelector("#collection-title").textContent =
      current === "all" ? "Todos os seus lugares" : tabs[current];
    document.querySelector("#collection-count").textContent =
      current === "reviews"
        ? `${counts[current]} avaliações escritas por você`
        : `${counts[current]} lugares na sua coleção`;
    const collection = document.querySelector("#collection");
    collection.setAttribute("aria-labelledby", "tab-" + current);
    if (current === "reviews") {
      collection.innerHTML = reviews.length
        ? reviews
            .map((r) => {
              const p = PLACES.find((p) => p.id === r.placeId);
              return `<article class="review-card profile-review"><a href="lugar.html?id=${p.id}">${UI.esc(p.name)} ↗</a><div class="stars" aria-label="${r.rating} de 5 estrelas">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div><p>${UI.esc(r.text)}</p><a class="text-link" href="lugar.html?id=${p.id}#review-form">Editar minha avaliação</a></article>`;
            })
            .join("")
        : UI.empty(
            "Sua primeira avaliação espera por você.",
            "Abra um lugar e conte como foi sua experiência.",
          );
    } else {
      const items = saved.filter(
        (p) => current === "all" || MW.tags(p.id).includes(current),
      );
      collection.innerHTML = items.length
        ? items.map(UI.card).join("")
        : UI.empty(
            "Uma nova descoberta cabe aqui.",
            "Explore os lugares e use as tags para montar sua coleção.",
          );
    }
  }
  document.querySelector("#profile-content").hidden = false;
  profileHeader();
  render();
  const tablist = document.querySelector("#profile-tabs");
  UI.tabKeys(tablist);
  tablist.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]");
    if (b) {
      current = b.dataset.tab;
      render();
      document.querySelector("#tab-" + current).focus();
    }
  });
  document.addEventListener("tagschange", render);
  document.querySelector("#close-profile").onclick = () =>
    document.querySelector("#edit-profile").close();
  document.querySelector("#profile-form").onsubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    const name = f.elements.name.value.trim();
    if (name.length < 2) {
      UI.toast("Digite pelo menos 2 caracteres no nome.");
      return;
    }
    try {
      MW.updateProfile(name, f.elements.bio.value);
      document.querySelector("#edit-profile").close();
      profileHeader();
      UI.toast("Perfil atualizado.");
    } catch (err) {
      UI.toast(err.message);
    }
  };
})();
