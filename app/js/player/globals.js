window.PlayerState = {
    playlists: [],
    currentPlaylistIndex: -1,
    editingPlaylistIndex: -1,
    contextTargetIndex: -1,
    isSeeking: false,
    
    // --- Playback State ---
    queue: [], 
    currentIndex: -1, 
    isPlaying: false, 
    isShuffle: false, 
    loopMode: 'off', 
    originalList: [],
    
    // Song Selection
    fullLibrary: null,        // 全曲データ

    DEFAULT_ICON: "icon/MusicManager.png",
    
    // Icons
    SVG_PLAY: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" /></svg>`,
    SVG_PAUSE: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" /></svg>`,
    ICON_PLAYING: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;color:var(--primary-color);"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>`
};

// プレイリスト読み込み進捗通知
eel.expose(js_playlist_progress);
function js_playlist_progress(c, t, pl_name) {
    const el = document.getElementById('loadingText');
    const overlay = document.getElementById('playerLoadingOverlay');
    if(el && overlay && overlay.style.display !== 'none') {
        const p = Math.floor((c/t)*100);
        el.textContent = `プレイリスト読み込み中... ${c}/${t} (${p}%) - ${pl_name}`;
    }
}

// 楽曲一覧読み込み進捗通知
eel.expose(js_library_progress);
function js_library_progress(c, t) {
    const el = document.getElementById('loadingText');
    const overlay = document.getElementById('playerLoadingOverlay');
    // オーバーレイが表示されているときのみ更新
    if(el && overlay && overlay.style.display !== 'none') {
        const p = Math.floor((c/t)*100);
        // 具体的な数字とパーセントを表示
        el.textContent = `全楽曲データ読み込み中... ${c} / ${t} 曲 (${p}%)`;
    }
}