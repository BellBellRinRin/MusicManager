(function() {
    const s = window.ManageState;
    const u = window.ManageUtils;

    window.ModalController = {
        init: function() {
            document.getElementById('btnCloseArtModalX').addEventListener('click', this.closeArtModal);
            document.getElementById('btnCancelArt').addEventListener('click', this.closeArtModal);
            document.getElementById('artModal').addEventListener('click', (e) => {
                if (e.target === document.getElementById('artModal')) this.closeArtModal();
            });

            document.getElementById('newArtInput').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('currentArtPreview');
                    preview.src = ev.target.result;
                    preview.style.display = 'block';
                    document.getElementById('artStatusText').textContent = "変更後の画像";
                    s.newArtBase64 = ev.target.result;
                };
                reader.readAsDataURL(file);
            });

            document.getElementById('btnExecRemoveArt').addEventListener('click', async () => {
                const item = s.libraryData[s.editingIndex];
                // ID指定で更新
                const success = await eel.update_song_artwork_by_id(item.musicFilename, null, true)();
                if (success) {
                    u.showToast("アートワークを削除しました", false);
                    await window.TableController.fetchChunk(); // リロード
                } else {
                    u.showToast("削除に失敗しました", true);
                }
                this.closeArtModal();
            });

            document.getElementById('btnSaveArt').addEventListener('click', async () => {
                if (!s.newArtBase64) {
                    this.closeArtModal();
                    return;
                }
                const item = s.libraryData[s.editingIndex];
                // ID指定で更新
                const success = await eel.update_song_artwork_by_id(item.musicFilename, s.newArtBase64, false)();
                if (success) {
                    u.showToast("アートワークを更新しました", false);
                    await window.TableController.fetchChunk();
                } else {
                    u.showToast("更新に失敗しました", true);
                }
                this.closeArtModal();
            });

            document.getElementById('btnCancelDelete').addEventListener('click', () => {
                document.getElementById('deleteModal').classList.remove('show');
            });

            document.getElementById('btnExecDelete').addEventListener('click', async () => {
                const item = s.libraryData[s.editingIndex];
                // ID指定で削除
                const success = await eel.delete_song_by_id(item.musicFilename)();
                if (success) {
                    u.showToast("削除しました", false);
                    if (s.currentPlayingIndex === s.editingIndex) {
                        window.PlayerController.stopPreview();
                        document.getElementById('playerBar').classList.remove('active');
                        s.currentPlayingIndex = -1;
                    }
                    await window.TableController.fetchChunk();
                } else {
                    u.showToast("削除に失敗しました", true);
                }
                document.getElementById('deleteModal').classList.remove('show');
            });
        },

        openArtModal: function(index) {
            s.editingIndex = index;
            const item = s.libraryData[index];
            const currentSrc = item.imageData || s.DEFAULT_ICON;

            s.newArtBase64 = null;
            document.getElementById('newArtInput').value = '';
            
            const preview = document.getElementById('currentArtPreview');
            preview.src = currentSrc;
            preview.style.display = 'block';
            
            if (item.imageData) {
                document.getElementById('artStatusText').textContent = "現在の画像";
            } else {
                document.getElementById('artStatusText').textContent = "画像なし (デフォルト)";
            }
            document.getElementById('artModal').classList.add('show');
        },

        closeArtModal: function() {
            document.getElementById('artModal').classList.remove('show');
        },

        openDeleteModal: function(index) {
            s.editingIndex = index;
            const item = s.libraryData[index];
            document.getElementById('deleteTargetName').textContent = item.title;
            document.getElementById('deleteModal').classList.add('show');
        }
    };
})();