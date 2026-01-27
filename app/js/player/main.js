document.addEventListener('DOMContentLoaded', async () => {
    try {
        // UI・機能コンポーネントの初期化
        window.HeaderController.init();
        window.SidebarController.init();
        window.MainViewController.init();
        window.PlayerController.init();
        window.ModalSongSelect.init();

        // データの読み込み
        await window.SidebarController.loadPlaylists();

    } catch (e) {
        console.error("Initialization Error:", e);
    }
});