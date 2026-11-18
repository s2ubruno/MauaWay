(() => {
  let signup = false;
  const form = document.querySelector("#auth-form"),
    error = document.querySelector("#auth-error"),
    submit = document.querySelector("#auth-submit");
  const next =
    new URLSearchParams(location.search).get("next") || "perfil.html";
  // Somente páginas locais conhecidas: impede redirecionamento aberto.
  const destination = /^(index|perfil|lugar)\.html(?:\?[^#]*)?$/.test(next)
    ? next
    : "perfil.html";
  function mode(value) {
    signup = value;
    form.reset();
    error.textContent = "";
    document.querySelector("#name-field").hidden = !signup;
    form.elements.name.required = signup;
    document.querySelector("#auth-title").textContent = signup
      ? "Sua próxima descoberta começa aqui."
      : "Bom ter você por aqui.";
    document.querySelector("#auth-subtitle").textContent = signup
      ? "Crie sua estante pessoal de lugares."
      : "Entre para organizar seus lugares favoritos.";
    submit.textContent = signup ? "Criar minha conta →" : "Entrar →";
    form.elements.password.autocomplete = signup
      ? "new-password"
      : "current-password";
    ["login", "signup"].forEach((x, i) => {
      const b = document.querySelector("#" + x + "-tab");
      b.setAttribute("aria-selected", String(Boolean(i) === signup));
      b.tabIndex = Boolean(i) === signup ? 0 : -1;
    });
  }
  document.querySelector("#login-tab").onclick = () => mode(false);
  document.querySelector("#signup-tab").onclick = () => mode(true);
  UI.tabKeys(document.querySelector(".auth-card .tabs"));
  document.querySelector("#toggle-password").onclick = (e) => {
    const show = form.elements.password.type === "password";
    form.elements.password.type = show ? "text" : "password";
    e.target.textContent = show ? "Ocultar" : "Ver";
    e.target.setAttribute(
      "aria-label",
      show ? "Ocultar senha" : "Mostrar senha",
    );
  };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    error.textContent = "";
    submit.disabled = true;
    try {
      if (signup)
        await MW.signup(
          form.elements.name.value,
          form.elements.email.value,
          form.elements.password.value,
        );
      else
        await MW.login(form.elements.email.value, form.elements.password.value);
      location.href = destination;
    } catch (err) {
      error.textContent = err.message;
    } finally {
      submit.disabled = false;
    }
  });
  document.querySelector("#demo").onclick = () => {
    try {
      MW.demo();
      location.href = destination;
    } catch (err) {
      error.textContent = err.message;
    }
  };
})();
