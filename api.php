<?php
// API simples do MauáWay. O navegador conversa com este arquivo.
session_start();
header('Content-Type: application/json; charset=utf-8');

function resposta($dados, $status = 200) {
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}
function exigir_login() {
    if (empty($_SESSION['usuario'])) resposta(['erro' => 'Você precisa entrar na sua conta.'], 401);
    return $_SESSION['usuario'];
}
function texto($valor, $maximo = 1000) {
    return mb_substr(trim((string)$valor), 0, $maximo, 'UTF-8');
}

try {
    $pdo = new PDO(
        'mysql:host=127.0.0.1;dbname=mauaway;charset=utf8mb4',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    $entrada = json_decode(file_get_contents('php://input'), true) ?? [];
    $acao = $entrada['acao'] ?? $_GET['acao'] ?? '';

    switch ($acao) {
        case 'me':
            if (empty($_SESSION['usuario'])) resposta(['usuario' => null]);
            $st = $pdo->prepare('SELECT id, nome, email, sobre, demonstracao FROM usuarios WHERE id = ?');
            $st->execute([$_SESSION['usuario']]);
            $u = $st->fetch();
            if (!$u) { session_destroy(); resposta(['usuario' => null]); }
            resposta(['usuario' => ['id'=>(int)$u['id'], 'name'=>$u['nome'], 'email'=>$u['email'], 'bio'=>$u['sobre'], 'demo'=>(bool)$u['demonstracao']]]);
        case 'signup':
            $nome = texto($entrada['name'] ?? '', 100);
            $email = mb_strtolower(texto($entrada['email'] ?? '', 150), 'UTF-8');
            $senha = (string)($entrada['password'] ?? '');
            if (mb_strlen($nome, 'UTF-8') < 2) resposta(['erro'=>'Digite um nome com pelo menos 2 caracteres.'], 422);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) resposta(['erro'=>'Digite um e-mail válido.'], 422);
            if (strlen($senha) < 6 || strlen($senha) > 128) resposta(['erro'=>'A senha precisa ter entre 6 e 128 caracteres.'], 422);
            try {
                $st=$pdo->prepare('INSERT INTO usuarios (nome,email,senha) VALUES (?,?,?)');
                $st->execute([$nome,$email,password_hash($senha, PASSWORD_DEFAULT)]);
            } catch (PDOException $e) {
                if ($e->getCode() === '23000') resposta(['erro'=>'Este e-mail já possui uma conta.'], 409);
                throw $e;
            }
            session_regenerate_id(true); $_SESSION['usuario']=(int)$pdo->lastInsertId();
            resposta(['ok'=>true]);
        case 'login':
            $email=mb_strtolower(texto($entrada['email'] ?? '',150),'UTF-8');
            $st=$pdo->prepare('SELECT id,senha FROM usuarios WHERE email=? AND demonstracao=0');
            $st->execute([$email]); $u=$st->fetch();
            if (!$u || !password_verify((string)($entrada['password'] ?? ''),$u['senha'])) resposta(['erro'=>'E-mail ou senha incorretos.'], 401);
            session_regenerate_id(true); $_SESSION['usuario']=(int)$u['id'];
            resposta(['ok'=>true]);
        case 'demo':
            $email='demo@mauaway.local';
            $st=$pdo->prepare('SELECT id FROM usuarios WHERE email=?'); $st->execute([$email]); $id=$st->fetchColumn();
            if (!$id) {
                $st=$pdo->prepare('INSERT INTO usuarios (nome,email,sobre,demonstracao) VALUES (?,?,?,1)');
                $st->execute(['Explorador de Mauá',$email,'Minha próxima descoberta está aqui.']); $id=$pdo->lastInsertId();
            }
            session_regenerate_id(true); $_SESSION['usuario']=(int)$id; resposta(['ok'=>true]);
        case 'logout':
            $_SESSION=[]; session_destroy(); resposta(['ok'=>true]);
        case 'profile_update':
            $uid=exigir_login(); $nome=texto($entrada['name'] ?? '',100); $bio=texto($entrada['bio'] ?? '',180);
            if (mb_strlen($nome,'UTF-8')<2) resposta(['erro'=>'Digite um nome com pelo menos 2 caracteres.'],422);
            $st=$pdo->prepare('UPDATE usuarios SET nome=?, sobre=? WHERE id=?'); $st->execute([$nome,$bio,$uid]); resposta(['ok'=>true]);
        case 'tags':
            $uid=exigir_login(); $st=$pdo->prepare('SELECT local_codigo,tipo FROM favoritos WHERE usuario_id=?'); $st->execute([$uid]);
            $tags=[]; foreach($st as $r) $tags[$r['local_codigo']][]=$r['tipo'];
            resposta(['tags'=>$tags]);
        case 'toggle':
            $uid=exigir_login(); $local=texto($entrada['placeId'] ?? '',50); $tipo=$entrada['tag'] ?? '';
            if (!in_array($tipo,['want','visited','favorite'],true)) resposta(['erro'=>'Tipo de favorito inválido.'],422);
            $st=$pdo->prepare('SELECT codigo FROM locais WHERE codigo=?'); $st->execute([$local]); if(!$st->fetch()) resposta(['erro'=>'Lugar não encontrado.'],404);
            $st=$pdo->prepare('SELECT id FROM favoritos WHERE usuario_id=? AND local_codigo=? AND tipo=?'); $st->execute([$uid,$local,$tipo]); $id=$st->fetchColumn();
            if($id){$st=$pdo->prepare('DELETE FROM favoritos WHERE id=?');$st->execute([$id]);$ativo=false;}
            else{$st=$pdo->prepare('INSERT INTO favoritos (usuario_id,local_codigo,tipo) VALUES (?,?,?)');$st->execute([$uid,$local,$tipo]);$ativo=true;}
            resposta(['ativo'=>$ativo]);
        case 'reviews':
            $uid=$_SESSION['usuario'] ?? 0; $local=texto($_GET['placeId'] ?? '',50);
            $sqlq='SELECT a.id,a.local_codigo AS placeId,a.usuario_id AS userId,a.nota AS rating,a.comentario AS text,a.atualizado_em AS date,u.nome AS author FROM avaliacoes a JOIN usuarios u ON u.id=a.usuario_id';
            if($local!==''){ $st=$pdo->prepare($sqlq.' WHERE a.local_codigo=? ORDER BY a.atualizado_em DESC');$st->execute([$local]);}
            else {$st=$pdo->prepare($sqlq.' WHERE a.usuario_id=? ORDER BY a.atualizado_em DESC');$st->execute([$uid]);}
            $rows=$st->fetchAll(); foreach($rows as &$r){$r['id']=(string)$r['id'];$r['userId']=(int)$r['userId'];$r['rating']=(int)$r['rating'];$r['date']=str_replace(' ','T',$r['date']);} unset($r);
            resposta(['reviews'=>$rows]);
        case 'save_review':
            $uid=exigir_login(); $local=texto($entrada['placeId'] ?? '',50); $nota=(int)($entrada['rating'] ?? 0); $comentario=texto($entrada['text'] ?? '',1000);
            if($nota<1||$nota>5||mb_strlen($comentario,'UTF-8')<10) resposta(['erro'=>'Escolha de 1 a 5 estrelas e escreva pelo menos 10 caracteres.'],422);
            $st=$pdo->prepare('SELECT codigo FROM locais WHERE codigo=?');$st->execute([$local]);if(!$st->fetch())resposta(['erro'=>'Lugar não encontrado.'],404);
            $st=$pdo->prepare('INSERT INTO avaliacoes (usuario_id,local_codigo,nota,comentario) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE nota=VALUES(nota),comentario=VALUES(comentario),atualizado_em=CURRENT_TIMESTAMP');
            $st->execute([$uid,$local,$nota,$comentario]); resposta(['ok'=>true]);
        case 'delete_review':
            $uid=exigir_login(); $id=(int)($entrada['reviewId'] ?? 0);
            $st=$pdo->prepare('DELETE FROM avaliacoes WHERE id=? AND usuario_id=?');$st->execute([$id,$uid]);resposta(['ok'=>true]);
        default: resposta(['erro'=>'Ação não reconhecida.'],404);
    }
} catch (Throwable $e) {
    error_log($e->getMessage());
    resposta(['erro'=>'Não foi possível concluir. Confira se o MySQL está ligado e se o banco mauaway foi importado.'],500);
}
