(function() {
    const s = window.PlayerState;
    const u = window.PlayerUtils;

    window.ModalSongSelect = {
        
        lastSelectedIndex: -1,
        isDragging: false,
        dragTargetState: true,
        activeTags: [],
        container: null,

        // キャッシュ管理用
        cachedSettings: null,

        init: function() {
            // コンテキストメニュー「曲を編集」
            const menuEdit = document.getElementById('menuEditSongs');
            if(menuEdit) menuEdit.addEventListener('click', this.openModal.bind(this));

            // ボタン類
            const btnCancel = document.getElementById('btnCancelSelect');
            const btnSave = document.getElementById('btnSaveSelect');
            if(btnCancel) btnCancel.addEventListener('click', this.closeModal.bind(this));
            if(btnSave) btnSave.addEventListener('click', this.saveSelection.bind(this));

            // 検索ボックス
            const search = document.getElementById('songSelectSearch');
            if(search) {
                search.addEventListener('input', (e) => this.filterSongs(e.target.value));
            }
            
            this.container = document.getElementById('songSelectListContainer');
            // ドラッグ終了検知
            document.addEventListener('mouseup', () => { this.isDragging = false; });
        },

        openModal: async function() {
            u.showLoading();
            
            const txt = document.getElementById('loadingText');
            // データ未取得の場合のみ「読み込み中」を表示
            if (!s.fullLibrary && txt) txt.textContent = "楽曲リストの読み込み中...";
            else if(txt) txt.textContent = "準備中...";

            try {
                // 1. 設定読み込み (キャッシュがあれば使う)
                if (!this.cachedSettings) {
                    this.cachedSettings = await eel.get_app_settings()();
                }
                this.activeTags = this.cachedSettings.active_tags || [];
                
                // 2. ライブラリデータ取得 (キャッシュ機構)
                if (!s.fullLibrary) {
                    // まだデータがない場合のみPythonから取得
                    console.log("[INFO] Fetching full library from Python...");
                    s.fullLibrary = await eel.get_library_data_with_meta(true)();
                } else {
                    console.log("[INFO] Using cached library data.");
                }

                // データチェック
                if (!Array.isArray(s.fullLibrary)) {
                    throw new Error("楽曲データが読み込めませんでした");
                }
                
                // 3. ターゲットのプレイリスト情報の取得
                if (s.contextTargetIndex === -1 || !s.playlists[s.contextTargetIndex]) {
                     throw new Error("プレイリストが選択されていません");
                }
                const targetPl = s.playlists[s.contextTargetIndex];
                
                // 選択済みファイルの抽出 (ファイル名ベース)
                const currentFiles = targetPl.songs ? targetPl.songs.map(so => so.musicFilename) : [];
                this.selectedSet = new Set(currentFiles);

                // 表示用リストの初期化
                this.displayList = [...s.fullLibrary];
                document.getElementById('songSelectSearch').value = '';
                this.lastSelectedIndex = -1; // リセット

                // テーブル描画
                this.renderTable(this.displayList, currentFiles);
                
                // モーダル表示
                const modal = document.getElementById('songSelectModal');
                modal.classList.add('show');
                const inp = document.getElementById('songSelectSearch');
                if (inp) {
                    inp.focus();
                }

            } catch(e) {
                console.error(e);
                u.showToast("読み込み失敗: " + e.message, true);
            } finally {
                u.hideLoading();
            }
        },

        closeModal: function() {
            document.getElementById('songSelectModal').classList.remove('show');
        },

        renderTable: function(library, selectedFiles) {
            const tbody = document.getElementById('selectTableBody');
            if (!tbody) return;
            tbody.innerHTML = '';
            
            // 初回表示などで引数がない場合はインスタンス変数を使用
            // 再描画時は Set の状態が正となる
            
            const fragment = document.createDocumentFragment();

            library.forEach((song, idx) => {
                const tr = document.createElement('tr');
                tr.className = 'select-row';
                tr.dataset.index = idx; 
                
                // 検索用テキスト生成 (キャッシュしてあれば高速だが、単純化のため毎回生成)
                let text = (song.title + " " + song.artist + " " + song.album + " " + song.genre).toLowerCase();
                this.activeTags.forEach(t => { if(song[t]) text += " " + String(song[t]).toLowerCase(); });
                tr.dataset.filterText = text;

                // チェック状態判定 (Setは高速)
                const isChecked = this.selectedSet.has(song.musicFilename);
                const artSrc = song.imageData || s.DEFAULT_ICON;

                tr.innerHTML = `
                    <td class="chk-cell">
                        <input type="checkbox" class="col-check-box" ${isChecked?'checked':''}>
                    </td>
                    <td class="col-art-small"><img src="${artSrc}" style="width:32px;height:32px;border-radius:4px;"></td>
                    <td>${u.escapeHtml(song.title)}</td>
                    <td>${u.escapeHtml(song.artist)}</td>
                    <td>${u.escapeHtml(song.album)}</td>
                    <td style="text-align:right">${u.escapeHtml(song.track||'')}</td>
                    <td>${u.escapeHtml(song.genre||'')}</td>
                `;

                if(isChecked) tr.classList.add('selected');

                tr.addEventListener('mousedown', (e) => this.onRowMouseDown(e, tr, idx));
                tr.addEventListener('mouseenter', (e) => this.onRowMouseEnter(e, tr));

                // Checkboxクリック時もUI同期
                const cb = tr.querySelector('.col-check-box');
                cb.addEventListener('click', (e) => {
                     // 既にmousedownでトグルロジックが走るため、ネイティブの変更動作と状態を同期させる
                     this.updateRowHighlight(tr, cb.checked);
                });

                fragment.appendChild(tr);
            });
            tbody.appendChild(fragment);
            
            this.updateCheckAllState();
        },

        onRowMouseDown: function(e, tr, idx) {
            if (e.button !== 0) return; // 左クリックのみ

            const checkbox = tr.querySelector('.col-check-box');
            
            // Shift + Click (範囲選択)
            if (e.shiftKey && this.lastSelectedIndex !== -1) {
                e.preventDefault(); 
                const start = Math.min(this.lastSelectedIndex, idx);
                const end = Math.max(this.lastSelectedIndex, idx);
                const rows = document.getElementById('selectTableBody').children;
                
                // 起点の状態を取得
                const anchorRow = rows[this.lastSelectedIndex];
                if (!anchorRow) return;
                const anchorCb = anchorRow.querySelector('.col-check-box');
                const targetState = anchorCb.checked;

                // 範囲内の状態を「起点」に合わせる
                for(let i=start; i<=end; i++) {
                    const row = rows[i];
                    // 表示されている行のみ対象
                    if(row.style.display !== 'none') {
                        // データセットから元のインデックスを取得して更新
                        const dataIdx = parseInt(row.dataset.index, 10);
                        const song = this.displayList[dataIdx];
                        const box = row.querySelector('.col-check-box');

                        // UI変更
                        box.checked = targetState;
                        this.updateRowHighlight(row, targetState);
                        
                        // Set更新
                        if (targetState) this.selectedSet.add(song.musicFilename);
                        else this.selectedSet.delete(song.musicFilename);
                    }
                }
                this.updateCheckAllState();
                return;
            }

            // Normal / Drag start
            this.isDragging = true;
            this.lastSelectedIndex = idx;
            
            // 行クリックで反転 (チェックボックスそのものクリックの場合は重複トグルを防ぐ)
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            
            // セット更新
            const song = this.displayList[idx];
            if (checkbox.checked) this.selectedSet.add(song.musicFilename);
            else this.selectedSet.delete(song.musicFilename);

            this.updateRowHighlight(tr, checkbox.checked);
            this.dragTargetState = checkbox.checked; // ドラッグ時に塗る状態
            
            this.updateCheckAllState();
        },

        onRowMouseEnter: function(e, tr) {
            if (this.isDragging) {
                const checkbox = tr.querySelector('.col-check-box');
                
                // ドラッグターゲット状態と異なる場合のみ更新
                if (checkbox.checked !== this.dragTargetState) {
                     checkbox.checked = this.dragTargetState;
                     this.updateRowHighlight(tr, this.dragTargetState);
                     
                     // Set更新
                     const idx = parseInt(tr.dataset.index, 10);
                     const song = this.displayList[idx];
                     if(this.dragTargetState) this.selectedSet.add(song.musicFilename);
                     else this.selectedSet.delete(song.musicFilename);
                     
                     this.updateCheckAllState();
                }
            }
        },

        updateRowHighlight: function(tr, isChecked) {
            if (isChecked) tr.classList.add('selected');
            else tr.classList.remove('selected');
        },
        
        updateCheckAllState: function() {
            const checkAll = document.getElementById('checkAllSongs');
            if (!checkAll) return;
            
            // 表示中のリストについて判定
            const rows = Array.from(document.getElementById('selectTableBody').children);
            const visibleRows = rows.filter(r => r.style.display !== 'none');
            
            if (visibleRows.length === 0) {
                checkAll.checked = false;
                checkAll.indeterminate = false;
                return;
            }

            // ★修正箇所: 変数名を定義したもの(allChecked, someChecked)と合わせました
            const allChecked = visibleRows.every(r => r.querySelector('.col-check-box').checked);
            const someChecked = visibleRows.some(r => r.querySelector('.col-check-box').checked);
            
            checkAll.checked = allChecked;
            checkAll.indeterminate = (someChecked && !allChecked);
            
            // Listener (1回だけアタッチするための簡易チェック)
            if (!checkAll.hasAttribute('data-bind')) {
                checkAll.addEventListener('click', (e) => this.toggleAll(e.target.checked));
                checkAll.setAttribute('data-bind', 'true');
            }
        },

        toggleAll: function(state) {
            // 表示されている行すべてに適用
            const rows = document.getElementById('selectTableBody').children;
            for(let r of rows) {
                if (r.style.display !== 'none') {
                    const idx = parseInt(r.dataset.index, 10);
                    const song = this.displayList[idx];
                    
                    const cb = r.querySelector('.col-check-box');
                    cb.checked = state;
                    this.updateRowHighlight(r, state);

                    if (state) this.selectedSet.add(song.musicFilename);
                    else this.selectedSet.delete(song.musicFilename);
                }
            }
        },

        filterSongs: function(term) {
            term = term.toLowerCase();
            const rows = document.getElementById('selectTableBody').children;
            for(let r of rows) {
                if (r.dataset.filterText.includes(term)) {
                    r.style.display = '';
                } else {
                    r.style.display = 'none';
                }
            }
            this.updateCheckAllState();
        },

        sortData: function(field) {
            // 現在のソート方向をトグルするか、初期化
            if (this.sortField === field) this.sortDesc = !this.sortDesc;
            else { this.sortField = field; this.sortDesc = false; }
            
            const m = this.sortDesc ? -1 : 1;
            
            this.displayList.sort((a,b) => {
                let va = a[field], vb = b[field];
                if(field === 'track') {
                    va = parseInt(va) || 0; vb = parseInt(vb) || 0;
                    return (va - vb) * m;
                }
                va = String(va || '').toLowerCase();
                vb = String(vb || '').toLowerCase();
                return va.localeCompare(vb, 'ja') * m;
            });
            
            // ソート反映のために再描画
            this.renderTable(this.displayList, []);
        },

        saveSelection: async function() {
            // 保存対象リスト作成 (filename only)
            const listToSave = Array.from(this.selectedSet).map(path => path.split(/[\\/]/).pop());

            u.showLoading();
            const txt = document.getElementById('loadingText');
            if(txt) txt.textContent = "保存中...";

            try {
                const success = await eel.update_playlist_songs(s.contextTargetIndex, listToSave)();
                
                if(success) {
                    u.showToast("プレイリストを保存しました", false);
                    
                    // Sidebar再読み込み（データ更新）
                    await window.SidebarController.loadPlaylists();
                    
                    // 表示中なら再選択してリスト更新
                    if(s.currentPlaylistIndex === s.contextTargetIndex) {
                        window.MainViewController.selectPlaylist(s.contextTargetIndex);
                    }
                    
                    this.closeModal();
                } else {
                    u.showToast("保存エラー", true);
                }
            } catch(e) {
                console.error(e);
                u.showToast("エラー発生", true);
            } finally {
                u.hideLoading();
            }
        }
    };
})();