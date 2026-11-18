(() => {
  const params = new URLSearchParams(location.search);
  let category = params.get("category") || "Todos";
  const categories = [
    "Todos",
    "Hambúrguer",
    "Pizza",
    "Japonesa",
    "Restaurante",
  ];
  if (!categories.includes(category)) category = "Todos";
  const icons = {
    Todos: "✦",
    Hambúrguer: "◒",
    Pizza: "◔",
    Japonesa: "▤",
    Restaurante: "◉",
  };
  const search = document.querySelector("#search"),
    sort = document.querySelector("#sort");
  search.value = params.get("q") || "";
  sort.value = ["featured", "name", "rating"].includes(params.get("sort"))
    ? params.get("sort")
    : "featured";
  const norm = (v) =>
    v
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  function render() {
    document.querySelector("#categories").innerHTML = categories
      .map(
        (c) =>
          `<button class="chip ${c === category ? "active" : ""}" data-category="${c}" aria-pressed="${c === category}">${icons[c]} ${c === "Todos" ? "Todos os lugares" : c}</button>`,
      )
      .join("");
    const tokens = norm(search.value).split(/\s+/).filter(Boolean);
    const filtered = PLACES.filter(
      (p) =>
        (category === "Todos" || category === p.category) &&
        tokens.every((t) =>
          norm(
            [p.name, p.category, p.neighborhood, ...p.keywords].join(" "),
          ).includes(t),
        ),
    );
    if (sort.value === "name")
      filtered.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (sort.value === "rating")
      filtered.sort(
        (a, b) => (UI.rating(b.id)?.score || 0) - (UI.rating(a.id)?.score || 0),
      );
    document.querySelector("#places").innerHTML = filtered.length
      ? filtered.map(UI.card).join("")
      : UI.empty(
          "Nenhum lugar por aqui… ainda.",
          "Tente outra palavra ou remova os filtros. Busque por hambúrguer, pizza ou sushi.",
          "index.html",
          "Limpar filtros",
        );
    document.querySelector("#result-count").textContent =
      `${filtered.length} ${filtered.length === 1 ? "lugar encontrado" : "lugares encontrados"} em Mauá · capas ilustrativas`;
    const q = new URLSearchParams();
    if (search.value) q.set("q", search.value);
    if (category !== "Todos") q.set("category", category);
    if (sort.value !== "featured") q.set("sort", sort.value);
    try {
      history.replaceState(null, "", "index.html" + (q.size ? "?" + q : ""));
    } catch {
      /* file:// pode restringir o histórico. */
    }
  }
  search.addEventListener("input", render);
  sort.addEventListener("change", render);
  document.querySelector("#categories").addEventListener("click", (e) => {
    const b = e.target.closest("[data-category]");
    if (b) {
      category = b.dataset.category;
      render();
      document.querySelector(`[data-category="${category}"]`).focus();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      search.focus();
    }
  });
  document.addEventListener("tagschange", render);
  render();
})();
