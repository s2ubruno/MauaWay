document.querySelector("#sources").innerHTML = PLACES.map(
  (p) =>
    `<div class="source-row"><div><strong>${UI.esc(p.name)}</strong><br><small>${UI.esc(p.address)} · ${UI.esc(p.neighborhood)}</small></div><a href="${p.source}" target="_blank" rel="noopener noreferrer">Consultar referência ↗</a></div>`,
).join("");
