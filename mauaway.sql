DROP DATABASE IF EXISTS mauaway;
CREATE DATABASE mauaway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mauaway;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) DEFAULT NULL,
  sobre VARCHAR(180) DEFAULT '',
  demonstracao TINYINT(1) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS locais (
  codigo VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  categoria VARCHAR(60) NOT NULL,
  bairro VARCHAR(100),
  endereco VARCHAR(180),
  descricao TEXT,
  imagem VARCHAR(255),
  fonte VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  local_codigo VARCHAR(50) NOT NULL,
  tipo ENUM('want','visited','favorite') NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY favorito_unico (usuario_id, local_codigo, tipo),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (local_codigo) REFERENCES locais(codigo) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS avaliacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  local_codigo VARCHAR(50) NOT NULL,
  nota TINYINT NOT NULL,
  comentario VARCHAR(1000) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY avaliacao_unica (usuario_id, local_codigo),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (local_codigo) REFERENCES locais(codigo) ON DELETE CASCADE
) ENGINE=InnoDB;


INSERT INTO locais (codigo,nome,categoria,bairro,endereco,descricao,imagem,fonte) VALUES ('recanto','Recanto Burguer','Hambúrguer','Vila Augusto','R. São Tomé, 92','Hambúrgueres, porções e acompanhamentos para descobrir em Vila Augusto.','assets/img/recanto.jpg','https://recantoburguer.com.br/') ON DUPLICATE KEY UPDATE nome=VALUES(nome), categoria=VALUES(categoria), bairro=VALUES(bairro), endereco=VALUES(endereco), descricao=VALUES(descricao), imagem=VALUES(imagem), fonte=VALUES(fonte);

INSERT INTO locais (codigo,nome,categoria,bairro,endereco,descricao,imagem,fonte) VALUES ('fornalenha','Fornalenha','Pizza','Matriz','Av. Dom José Gaspar, 402','Pizzas de forno a lenha, calzones e baguetes no bairro Matriz.','assets/img/fornoalenha.jpg','https://www.fornalenha.com.br/') ON DUPLICATE KEY UPDATE nome=VALUES(nome), categoria=VALUES(categoria), bairro=VALUES(bairro), endereco=VALUES(endereco), descricao=VALUES(descricao), imagem=VALUES(imagem), fonte=VALUES(fonte);

INSERT INTO locais (codigo,nome,categoria,bairro,endereco,descricao,imagem,fonte) VALUES ('konkai','Konkai Sushi','Japonesa','Mauá','Consulte a localização no site oficial','Culinária japonesa em Mauá, com canal oficial para localização e delivery.','assets/img/konkai.jpg','https://konkaisushi.com.br/maua/') ON DUPLICATE KEY UPDATE nome=VALUES(nome), categoria=VALUES(categoria), bairro=VALUES(bairro), endereco=VALUES(endereco), descricao=VALUES(descricao), imagem=VALUES(imagem), fonte=VALUES(fonte);

INSERT INTO locais (codigo,nome,categoria,bairro,endereco,descricao,imagem,fonte) VALUES ('jeronimo','Jeronimo Burger','Hambúrguer','Centro','Av. Gov. Mário Covas Júnior, 01 — Mauá Plaza','Uma opção de hamburgueria para incluir no seu passeio pelo shopping.','assets/img/jeronimo.png','https://jeronimoburger.com.br/jeronimo-shopping-maua') ON DUPLICATE KEY UPDATE nome=VALUES(nome), categoria=VALUES(categoria), bairro=VALUES(bairro), endereco=VALUES(endereco), descricao=VALUES(descricao), imagem=VALUES(imagem), fonte=VALUES(fonte);

INSERT INTO locais (codigo,nome,categoria,bairro,endereco,descricao,imagem,fonte) VALUES ('macale','Macalé Pizzas','Pizza','Vila Magine','Av. Washington Luiz, 2740','Pizzaria da Vila Magine, com cardápio disponível no site oficial.','assets/img/macale.jpg','https://macalepizzas.com.br/') ON DUPLICATE KEY UPDATE nome=VALUES(nome), categoria=VALUES(categoria), bairro=VALUES(bairro), endereco=VALUES(endereco), descricao=VALUES(descricao), imagem=VALUES(imagem), fonte=VALUES(fonte);

INSERT INTO locais (codigo,nome,categoria,bairro,endereco,descricao,imagem,fonte) VALUES ('elohim','Elohim Burger','Hambúrguer','Vila Bocaina','Rua Japão, 126','Hambúrgueres artesanais e delivery na Vila Bocaina.','assets/img/elohim.jpg','https://elohim.nobairro.club/maua') ON DUPLICATE KEY UPDATE nome=VALUES(nome), categoria=VALUES(categoria), bairro=VALUES(bairro), endereco=VALUES(endereco), descricao=VALUES(descricao), imagem=VALUES(imagem), fonte=VALUES(fonte);

INSERT INTO locais (codigo,nome,categoria,bairro,endereco,descricao,imagem,fonte) VALUES ('dalkai','Dalkai Sushi & Robata','Japonesa','Matriz','Rua Santa Cecília, 289','Restaurante japonês do bairro Matriz, listado no guia municipal.','assets/img/dalkai.jpg','https://dom.maua.sp.gov.br/public/docs/5eed40d9b11ef5e8e086938b63720bc5.pdf') ON DUPLICATE KEY UPDATE nome=VALUES(nome), categoria=VALUES(categoria), bairro=VALUES(bairro), endereco=VALUES(endereco), descricao=VALUES(descricao), imagem=VALUES(imagem), fonte=VALUES(fonte);

INSERT INTO locais (codigo,nome,categoria,bairro,endereco,descricao,imagem,fonte) VALUES ('dona-pimenta','Dona Pimenta','Restaurante','Jardim Pedroso','Rua Ribeirão Preto, 233','Uma opção de restaurante no Jardim Pedroso, listada no guia municipal.','assets/img/donapimenta.jpg','https://dom.maua.sp.gov.br/public/docs/5eed40d9b11ef5e8e086938b63720bc5.pdf') ON DUPLICATE KEY UPDATE nome=VALUES(nome), categoria=VALUES(categoria), bairro=VALUES(bairro), endereco=VALUES(endereco), descricao=VALUES(descricao), imagem=VALUES(imagem), fonte=VALUES(fonte);
