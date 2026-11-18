# Validação desta entrega

## Verificações executadas

- Sintaxe de todos os arquivos JavaScript validada com `node --check`.
- Referências locais dos documentos HTML e estrutura XML das ilustrações SVG verificadas.
- Ausência de `<style>` e de atributos `style` nos documentos: todo CSS está em arquivo externo.
- Teste automatizado da camada de dados: cadastro, rejeição de e-mail duplicado, login correto/incorreto, três tags simultâneas, isolamento das tags entre contas, edição de perfil, criação/edição/exclusão de avaliação, persistência após nova inicialização e conta demonstrativa.
- Testes do catálogo e da busca: oito estabelecimentos, três resultados para “hamburguer”, um para “HAMBÚRGUER centro”, dois para “pizza” e dois para “sushi”.

## Limitação da validação

Não foi possível executar a inspeção visual e os testes de interface em navegador nesta entrega: o navegador de automação não estava disponível e seu download falhou. O CSS inclui layouts para desktop, tablet e celular, mas a renderização final deve ser conferida no navegador usando o checklist em APRESENTACAO.md. Não se afirma validação visual concluída.
