# Roteiro para a banca (5 a 7 minutos)

1. **Problema:** moradores nem sempre conhecem as opções da própria cidade e procuram lazer gastronômico em municípios vizinhos.
2. **Proposta:** descobrir estabelecimentos de Mauá e organizar uma estante pessoal de experiências.
3. **Busca:** digite `hamburguer`, sem acento. Explique o catálogo e as palavras-chave. Teste `sushi` e uma busca sem resultado.
4. **Acesso:** crie uma conta fictícia ou use a demonstração. Explique que esta versão não possui servidor.
5. **Interações:** abra Recanto Burguer, marque Quero ir, Já fui e Favoritos. Mostre que tags podem coexistir.
6. **Perfil:** percorra as abas e veja os contadores. Edite o nome e a biografia.
7. **Avaliações:** escreva um relato fictício explicitamente identificado como teste, dê uma nota, edite e exclua. As notas não são avaliações reais importadas.
8. **Responsividade:** reduza a janela ou use o modo dispositivo do navegador.
9. **Arquitetura:** HTML para estrutura semântica, CSS externo para visual/responsividade, JS para busca, estado e persistência. Mostre data.js e store.js.
10. **Limites e evolução:** dados ficam no navegador; produção exigiria backend, autenticação real, moderação e banco de dados compartilhado.

## Verificação manual

- Buscar com/sem acentos e maiúsculas; combinar busca e categoria; limpar filtros.
- Cadastrar conta, sair e entrar com senha errada e correta.
- Tentar cadastrar o mesmo e-mail.
- Marcar e desmarcar cada tag, conferir aba correspondente após recarregar.
- Criar uma segunda conta: as tags são privadas a cada perfil; as avaliações locais são visíveis aos perfis daquele navegador.
- Enviar, alterar e remover avaliação; conferir média e contadores.
- Abrir um ID inexistente: estado “Lugar não encontrado”.
- Navegar usando Tab, Enter e setas nas abas; Escape fecha diálogo.
- Confirmar que nenhuma página ultrapassa a largura do celular.
