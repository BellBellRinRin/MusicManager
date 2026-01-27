document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面遷移の設定 ---

    // 1. 曲を追加
    const btnAddMusic = document.getElementById('btnAddMusic');
    if (btnAddMusic) {
        btnAddMusic.addEventListener('click', () => {
            window.location.href = 'add-music.html';
        });
    }

    // 2. データベースを管理
    const btnManage = document.getElementById('btnManage');
    if (btnManage) {
        btnManage.addEventListener('click', () => {
            window.location.href = 'manage.html';
        });
    }

    // 3. エクスポート
    const btnExport = document.getElementById('btnExport');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            window.location.href = 'export.html';
        });
    }

    // 4. インポート
    const btnImport = document.getElementById('btnImport');
    if (btnImport) {
        btnImport.addEventListener('click', () => {
            window.location.href = 'import.html';
        });
    }

    // 5. 音楽を再生
    const btnPlayer = document.getElementById('btnPlayer');
    if (btnPlayer) {
        btnPlayer.addEventListener('click', () => {
            window.location.href = 'player.html';
        });
    }

    // 6. 設定 (修正: 遷移先をsettings.htmlへ)
    const btnSettings = document.getElementById('btnSettings');
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            window.location.href = 'settings.html';
        });
    }
});