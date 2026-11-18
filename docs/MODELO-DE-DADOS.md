# Modelo de dados do MauáWay

O catálogo de lugares continua em `assets/js/data.js`. Contas, sessão, tags e avaliações agora são armazenadas no MySQL por meio de `api.php`.

## Tabelas MySQL
- `usuarios`: nome, e-mail, hash da senha, descrição do perfil e conta demonstrativa.
- `locais`: catálogo de estabelecimentos, usando o código textual do lugar como chave.
- `favoritos`: usuário, lugar e tipo de marcação (`want`, `visited` ou `favorite`).
- `avaliacoes`: usuário, lugar, nota de 1 a 5 e comentário. Cada usuário pode manter uma avaliação por lugar.

## Funcionamento
As páginas continuam usando a camada `MW` em `assets/js/store.js`. Essa camada envia as operações para `api.php`, que valida os dados e conversa com o MySQL usando PDO e consultas preparadas. As senhas são protegidas com `password_hash` e verificadas com `password_verify`. A sessão de login é mantida pelo PHP.

Para instalar, siga `LEIA-ME-INSTALACAO.txt`. O projeto deve ser aberto por `http://localhost/MauaWay/`, com Apache e MySQL iniciados no Laragon.
