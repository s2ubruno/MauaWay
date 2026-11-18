<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=mauaway;charset=utf8mb4', 'root', '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $locais = $pdo->query('SELECT COUNT(*) FROM locais')->fetchColumn();
    $tabelas = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo '<!doctype html><html lang="pt-br"><meta charset="utf-8"><title>Teste MauáWay</title>';
    echo '<body style="font:16px Arial;max-width:650px;margin:50px auto;line-height:1.6">';
    echo '<h1>Conexão funcionando! ✅</h1><p>O PHP conseguiu conversar com o MySQL.</p>';
    echo '<p>Lugares cadastrados: <strong>'.(int)$locais.'</strong></p><p>Tabelas: '.htmlspecialchars(implode(', ', $tabelas)).'</p>';
    echo '<p><a href="index.html">Abrir o MauáWay</a></p></body></html>';
} catch (Throwable $e) {
    http_response_code(500);
    echo '<h1>Não conectou ainda.</h1><p>Ligue o MySQL no Laragon e importe mauaway.sql pelo phpMyAdmin.</p>';
}
