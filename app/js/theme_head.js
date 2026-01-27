(function() {
    // LocalStorageから色を取得 (同期処理なので即時適用される)
    const savedPrimary = localStorage.getItem('theme_primary_color');
    if (savedPrimary) {
        const root = document.documentElement;
        
        // メインカラー適用
        root.style.setProperty('--primary-color', savedPrimary);
        
        // ダークカラー計算ロジック (theme.jsと同じもの)
        function adjustColorBrightness(hex, amount) {
            let usePound = false;
            if (hex[0] == "#") { hex = hex.slice(1); usePound = true; }
            let num = parseInt(hex, 16);
            let r = (num >> 16) + amount; if (r > 255) r = 255; else if (r < 0) r = 0;
            let b = ((num >> 8) & 0x00FF) + amount; if (b > 255) b = 255; else if (b < 0) b = 0;
            let g = (num & 0x0000FF) + amount; if (g > 255) g = 255; else if (g < 0) g = 0;
            return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
        }
        
        const dark = adjustColorBrightness(savedPrimary, -20);
        root.style.setProperty('--primary-color-dark', dark);
    }
})();