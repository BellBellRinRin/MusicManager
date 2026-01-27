document.addEventListener('DOMContentLoaded', () => {
    
    // --- 要素の取得 ---
    const artworkInput = document.getElementById('artworkInput');
    const artworkPreview = document.getElementById('artworkPreview');
    const removeArtworkBtn = document.getElementById('removeArtwork');
    const artworkDropZone = document.getElementById('artworkDropZone');

    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    const fileDropZone = document.getElementById('fileDropZone');
    
    // フォーム入力要素
    const inputTitle = document.getElementById('title');
    const inputArtist = document.getElementById('artist');
    const inputAlbum = document.getElementById('album');
    const inputGenre = document.getElementById('genre');
    const inputTrack = document.getElementById('track');

    // --- データ保持用変数 ---
    let musicFile = null;
    let artworkData = null;

    // ==========================================
    // 1. アルバムアート処理
    // ==========================================
    artworkInput.addEventListener('change', (e) => {
        handleArtwork(e.target.files[0]);
    });

    setupDragAndDrop(artworkDropZone, (file) => {
        handleArtwork(file);
    });

    function handleArtwork(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('画像ファイルを選択してください', true);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            artworkPreview.src = e.target.result;
            artworkPreview.style.display = 'block';
            removeArtworkBtn.style.display = 'block';
            artworkData = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    removeArtworkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetArtwork();
    });
    
    function resetArtwork() {
        artworkPreview.src = '';
        artworkPreview.style.display = 'none';
        removeArtworkBtn.style.display = 'none';
        artworkInput.value = ''; 
        artworkData = null;
    }

    // ==========================================
    // 2. 楽曲ファイル処理
    // ==========================================
    fileInput.addEventListener('change', (e) => {
        handleMusic(e.target.files[0]);
    });

    setupDragAndDrop(fileDropZone, (file) => {
        handleMusic(file);
    });

    function handleMusic(file) {
        if (!file) return;
        if (!(file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
            showToast('音声または動画ファイルを選択してください', true);
            return;
        }
        
        musicFile = file;
        fileNameDisplay.textContent = `選択中: ${file.name}`;
        fileNameDisplay.style.color = 'var(--primary-color)';
    }
    
    function resetMusic() {
        musicFile = null;
        fileInput.value = '';
        fileNameDisplay.textContent = "音声・動画ファイルをドラッグ＆ドロップ";
        fileNameDisplay.style.color = "var(--text-main)"; // 文字色を戻す
    }

    // ==========================================
    // 3. 送信処理
    // ==========================================
    const form = document.getElementById('addMusicForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!musicFile) {
            showToast("楽曲ファイルを選択してください。", true);
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '保存中...';

        try {
            const musicBase64 = await readFileAsBase64(musicFile);

            const payload = {
                title: inputTitle.value,
                artist: inputArtist.value,
                album: inputAlbum.value,
                genre: inputGenre.value,
                track: inputTrack.value,
                music_name: musicFile.name,
                music_data: musicBase64,
                artwork_data: artworkData
            };

            const result = await eel.save_music_data(payload)();

            if (result) {
                showToast("ライブラリに追加しました！", false);
                resetForm(); // フォームをクリアして連続入力可能に
            } else {
                showToast("保存中にエラーが発生しました。", true);
            }

        } catch (error) {
            showToast("ファイルの読み込みまたは送信に失敗しました。", true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // --- ヘルパー関数 ---
    
    // フォーム全体のリセット
    function resetForm() {
        inputTitle.value = '';
        inputArtist.value = '';
        inputAlbum.value = '';
        inputGenre.value = '';
        inputTrack.value = '';
        resetArtwork();
        resetMusic();
    }

    // トースト通知
    function showToast(message, isError) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        
        toast.className = 'toast show';
        if (isError) {
            toast.classList.add('error');
        } else {
            toast.classList.add('success');
        }

        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000); // 5秒表示
    }

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function setupDragAndDrop(element, callback) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            element.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            element.addEventListener(eventName, () => element.classList.add('dragover'), false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            element.addEventListener(eventName, () => element.classList.remove('dragover'), false);
        });

        element.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            callback(file);
        });
    }
});