/* O site mantém a mesma interface, mas agora grava tudo no MySQL pelo PHP. */
window.MW = (() => {
  let currentUser = null;
  let tagCache = {};
  let available = false;

  function request(action, data = {}, method = "POST") {
    const xhr = new XMLHttpRequest();
    const url = "api.php" + (method === "GET" ? "?acao=" + encodeURIComponent(action) +
      (data.placeId ? "&placeId=" + encodeURIComponent(data.placeId) : "") : "");
    xhr.open(method, url, false); // síncrono para manter o projeto original simples
    if (method === "POST") xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(method === "POST" ? JSON.stringify({ acao: action, ...data }) : null);
    let result = {};
    try { result = JSON.parse(xhr.responseText || "{}"); }
    catch { throw Error("Resposta do servidor inválida. Confira se abriu o projeto pelo Laragon."); }
    if (xhr.status < 200 || xhr.status >= 300) throw Error(result.erro || "Ocorreu um erro.");
    return result;
  }

  try {
    currentUser = request("me", {}, "GET").usuario;
    available = true;
    tagCache = currentUser ? request("tags", {}).tags : {};
  } catch (e) {
    console.error(e);
    available = false;
  }

  return {
    get available() { return available; },
    user: () => currentUser,
    signup(name, email, password) {
      request("signup", { name, email, password });
      currentUser = request("me", {}, "GET").usuario;
      tagCache = {};
    },
    login(email, password) {
      request("login", { email, password });
      currentUser = request("me", {}, "GET").usuario;
      tagCache = request("tags", {}).tags;
    },
    demo() {
      request("demo");
      currentUser = request("me", {}, "GET").usuario;
      tagCache = request("tags", {}).tags;
    },
    logout() {
      request("logout");
      currentUser = null;
      tagCache = {};
    },
    updateProfile(name, bio) {
      if (!currentUser) throw Error("Entre para editar seu perfil.");
      request("profile_update", { name, bio });
      currentUser = request("me", {}, "GET").usuario;
    },
    tags(placeId) {
      return currentUser ? (tagCache[placeId] || []).slice() : [];
    },
    toggle(placeId, tag) {
      if (!currentUser) throw Error("Entre para salvar lugares.");
      request("toggle", { placeId, tag });
      tagCache = request("tags", {}).tags;
      return true;
    },
    reviews(placeId) {
      const rows = request("reviews", placeId ? { placeId } : {}, "GET").reviews;
      return rows;
    },
    saveReview(placeId, rating, text) {
      if (!currentUser) throw Error("Entre para avaliar.");
      request("save_review", { placeId, rating, text });
    },
    deleteReview(reviewId) {
      request("delete_review", { reviewId });
    }
  };
})();
