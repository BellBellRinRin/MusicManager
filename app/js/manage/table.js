// Pythonから呼び出される進捗通知関数
eel.expose(js_manage_progress);
function js_manage_progress(current, total) {
    const detail = document.getElementById('loadingDetail');
    if (detail) {
        // 例: "データ処理中... 120 / 450 曲 (26%)"
        const percent = Math.floor((current / total) * 100);
        detail.textContent = `データ処理中... ${current} / ${total} 曲 (${percent}%)`;
    }
}

// テーブル描画 & 編集 & ソート
(function() {
    const s = window.ManageState;
    const u = window.ManageUtils;

    // ローディング制御ヘルパー
    function showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        const detail = document.getElementById('loadingDetail');
        
        // 初期文言を設定
        if (detail) detail.textContent = "データを準備中...";
        
        if (overlay) overlay.style.display = 'flex';
    }

    function hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    window.TableController = {
        loadTableData: async function() {
            showLoading(); 
            
            // 描画のために非同期で遅延実行
            setTimeout(async () => {
                try {
                    // 1. 設定 & タグ情報取得
                    const settings = await eel.get_app_settings()();
                    s.itemsPerPage = settings.items_per_page;
                    s.activeTags = settings.active_tags || ['title','artist','album','genre','track'];

                    // タグ定義（日本語ラベル）取得
                    const avail = await eel.get_available_tags()();
                    s.tagLabels = {};
                    avail.forEach(t => s.tagLabels[t.key] = t.label);

                    // 2. 総数取得
                    s.totalItems = await eel.get_library_count()();

                    // 3. データ取得
                    await this.fetchChunk();
                    
                } catch (e) {
                    console.error(e);
                    u.showToast("データの読み込みに失敗しました", true);
                } finally {
                    hideLoading();
                }
            }, 50);
        },

        // チャンク取得 (ソート・ページング反映)
        fetchChunk: async function() {
            // "すべて表示" の場合は limit=0
            const limit = s.isShowAll ? 0 : s.itemsPerPage;
            
            // "すべて表示" の時だけ進捗通知(notify)をONにする
            const notify = (limit === 0);

            // loadingDetailの表示をリセット
            const detail = document.getElementById('loadingDetail');
            if(detail && notify) detail.textContent = "データの取得を開始します...";

            s.libraryData = await eel.get_library_chunk(
                s.currentPage, 
                limit, 
                s.sortState.field, 
                s.sortState.direction === 'desc',
                notify
            )();

            // 完了後はテーブル描画
            this.renderHeader();
            this.renderTable();
            this.renderPagination();
        },

        renderHeader: function() {
            const headerRow = document.getElementById('tableHeaderRow');
            if (!headerRow) return;
            headerRow.innerHTML = '';

            // 1. Art
            let th = document.createElement('th');
            th.className = 'col-art';
            headerRow.appendChild(th);

            // 2. 再生
            th = document.createElement('th');
            th.className = 'col-play';
            th.textContent = '再生';
            headerRow.appendChild(th);

            // 3. 設定されたタグ
            s.activeTags.forEach(key => {
                const label = s.tagLabels[key] || key;
                th = document.createElement('th');
                th.className = `sortable col-${key}`;
                th.textContent = label;
                th.onclick = () => this.sortData(key);
                
                const span = document.createElement('span');
                span.className = 'sort-icon';
                span.id = `sort-${key}`;
                th.appendChild(span);
                
                headerRow.appendChild(th);
            });

            // 4. 時間
            th = document.createElement('th');
            th.className = 'col-time sortable';
            th.textContent = '時間';
            th.onclick = () => this.sortData('duration');
            th.innerHTML += ' <span class="sort-icon" id="sort-duration"></span>';
            headerRow.appendChild(th);

            // 5. 操作
            th = document.createElement('th');
            th.className = 'col-action';
            th.textContent = '操作';
            headerRow.appendChild(th);
        },

        sortData: function(field) {
            showLoading();
            
            setTimeout(async () => {
                try {
                    if (!s.sortState) s.sortState = { field: null, direction: 'asc' };

                    if (s.sortState.field === field) {
                        s.sortState.direction = s.sortState.direction === 'asc' ? 'desc' : 'asc';
                    } else {
                        s.sortState.field = field;
                        s.sortState.direction = 'asc';
                    }

                    s.currentPage = 1; // ページリセット
                    
                    if (s.currentPlayingIndex !== -1) {
                        window.PlayerController.stopPreview();
                        document.getElementById('playerBar').classList.remove('active');
                        s.currentPlayingIndex = -1;
                    }

                    await this.fetchChunk();
                    this.updateHeaderIcons();
                    
                    const wrapper = document.querySelector('.table-wrapper');
                    if(wrapper) wrapper.scrollTop = 0;

                } catch (e) {
                    console.error("Sort failed", e);
                    u.showToast("並び替えに失敗しました", true);
                } finally {
                    hideLoading();
                }
            }, 50);
        },

        updateHeaderIcons: function() {
            const icons = document.querySelectorAll('.sort-icon');
            icons.forEach(icon => icon.textContent = '');

            if (s.sortState && s.sortState.field) {
                const targetIcon = document.getElementById(`sort-${s.sortState.field}`);
                if (targetIcon) {
                    targetIcon.textContent = s.sortState.direction === 'asc' ? '▲' : '▼';
                }
            }
        },

        applySort: function(field, direction) { },

        renderTable: function() {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';
            
            const fragment = document.createDocumentFragment();

            s.libraryData.forEach((item, index) => {
                const tr = document.createElement('tr');
                const artSrc = item.imageData || s.DEFAULT_ICON;
                const isPlayingThis = (index === s.currentPlayingIndex && !document.getElementById('previewPlayer').paused);
                const iconHtml = isPlayingThis ? s.SVG_PAUSE : s.SVG_PLAY;
                const btnClass = isPlayingThis ? "btn-play playing" : "btn-play";

                let html = `<td class="col-art"><img src="${artSrc}" class="thumb-art"></td>` +
                           `<td class="col-play"><button class="${btnClass}" id="btnPlay_${index}" onclick="window.PlayerController.playPreview(${index})">${iconHtml}</button></td>`;

                s.activeTags.forEach(key => {
                    const val = (item[key] !== undefined && item[key] !== null) ? item[key] : '';
                    html += `<td class="editable col-${key}" onclick="window.TableController.showEditHint()" ondblclick="window.TableController.startEdit(this, ${index}, '${key}')">${u.escapeHtml(val)}</td>`;
                });

                html += `<td class="col-time">${item.duration || '--:--'}</td>` +
                    `<td class="col-action"><div class="action-btns">` +
                    `<button class="btn-icon" title="アートワーク編集" onclick="window.ModalController.openArtModal(${index})"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></button>` +
                    `<button class="btn-icon delete" title="削除" onclick="window.ModalController.openDeleteModal(${index})"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>` +
                    `</div></td>`;

                tr.innerHTML = html;
                fragment.appendChild(tr);
            });
            tableBody.appendChild(fragment);
        },

        renderPagination: function() {
            const container = document.getElementById('paginationControl');
            if (!container) return;
            container.innerHTML = '';
            
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'pagination-buttons';

            // Show All Button
            const btnShowAll = document.createElement('button');
            btnShowAll.className = s.isShowAll ? 'btn-page active' : 'btn-page';
            btnShowAll.textContent = s.isShowAll ? 'ページ別表示に戻す' : 'すべて表示';
            btnShowAll.onclick = () => {
                showLoading();
                setTimeout(async () => {
                    try {
                        s.isShowAll = !s.isShowAll;
                        s.currentPage = 1;
                        await this.fetchChunk();
                        const wrapper = document.querySelector('.table-wrapper');
                        if(wrapper) wrapper.scrollTop = 0;
                    } finally {
                        hideLoading();
                    }
                }, 50);
            };
            controlsDiv.appendChild(btnShowAll);

            if (!s.isShowAll) {
                const totalPages = Math.ceil(s.totalItems / s.itemsPerPage);
                
                // Prev
                const btnPrev = document.createElement('button');
                btnPrev.className = 'btn-page';
                btnPrev.textContent = '前へ';
                btnPrev.disabled = s.currentPage === 1;
                btnPrev.onclick = () => {
                    if (s.currentPage > 1) {
                        showLoading();
                        setTimeout(async () => {
                            try {
                                s.currentPage--;
                                await this.fetchChunk();
                                const wrapper = document.querySelector('.table-wrapper');
                                if(wrapper) wrapper.scrollTop = 0;
                            } finally {
                                hideLoading();
                            }
                        }, 50);
                    }
                };
                controlsDiv.appendChild(btnPrev);

                // Info
                const spanInfo = document.createElement('span');
                spanInfo.className = 'page-info';
                spanInfo.textContent = `${s.currentPage} / ${totalPages}`;
                controlsDiv.appendChild(spanInfo);

                // Next
                const btnNext = document.createElement('button');
                btnNext.className = 'btn-page';
                btnNext.textContent = '次へ';
                btnNext.disabled = s.currentPage === totalPages || totalPages === 0;
                btnNext.onclick = () => {
                    if (s.currentPage < totalPages) {
                        showLoading();
                        setTimeout(async () => {
                            try {
                                s.currentPage++;
                                await this.fetchChunk();
                                const wrapper = document.querySelector('.table-wrapper');
                                if(wrapper) wrapper.scrollTop = 0;
                            } finally {
                                hideLoading();
                            }
                        }, 50);
                    }
                };
                controlsDiv.appendChild(btnNext);
                
                // Jump
                const jumpDiv = document.createElement('div');
                jumpDiv.className = 'page-jump-wrapper';
                const inputJump = document.createElement('input');
                inputJump.type = 'number';
                inputJump.min = 1;
                inputJump.max = totalPages;
                inputJump.className = 'jump-input';
                inputJump.placeholder = 'Page';
                const btnJump = document.createElement('button');
                btnJump.className = 'btn-jump';
                btnJump.textContent = '移動';
                btnJump.onclick = () => {
                    let pageNum = parseInt(inputJump.value, 10);
                    if (isNaN(pageNum)) return;
                    if (pageNum < 1) pageNum = 1;
                    if (pageNum > totalPages) pageNum = totalPages;
                    if (pageNum !== s.currentPage) {
                        showLoading();
                        setTimeout(async () => {
                            try {
                                s.currentPage = pageNum;
                                await this.fetchChunk();
                                const wrapper = document.querySelector('.table-wrapper');
                                if(wrapper) wrapper.scrollTop = 0;
                            } finally {
                                hideLoading();
                            }
                        }, 50);
                    }
                };
                jumpDiv.appendChild(inputJump);
                jumpDiv.appendChild(btnJump);
                controlsDiv.appendChild(jumpDiv);
            }
            container.appendChild(controlsDiv);
        },

        showEditHint: function() {
            if (document.querySelector('.inline-input')) return;
            if (s.clickTimer) clearTimeout(s.clickTimer);
            s.clickTimer = setTimeout(() => {
                u.showToast("ダブルクリックで編集できます", false);
                s.clickTimer = null;
            }, 300);
        },

        startEdit: function(td, index, field) {
            if (s.clickTimer) {
                clearTimeout(s.clickTimer);
                s.clickTimer = null;
            }
            if (td.querySelector('input')) return;
            const originalText = td.textContent.trim();
            td.innerHTML = '';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = originalText;
            input.className = 'inline-input';
            
            let isCancelled = false;
            
            input.onclick = (e) => e.stopPropagation();

            input.addEventListener('keydown', (e) => {
                if (e.isComposing) return;
                if (e.key === 'Enter') {
                    input.blur();
                } else if (e.key === 'Escape') {
                    isCancelled = true;
                    input.blur();
                }
            });

            const save = async () => {
                if (isCancelled) {
                    td.textContent = originalText;
                    return; 
                }

                const newValue = input.value;
                if (newValue === originalText) {
                    td.textContent = originalText;
                    return;
                }
                
                const item = s.libraryData[index];
                if (!item) return;

                const success = await eel.update_song_by_id(item.musicFilename, field, newValue)();
                if (success) {
                    td.textContent = newValue;
                    s.libraryData[index][field] = newValue;
                    if (s.currentPlayingIndex === index) {
                        window.PlayerController.updatePlayerInfo(s.libraryData[index]);
                    }
                    u.showToast("更新しました", false);
                } else {
                    td.textContent = originalText;
                    u.showToast("更新に失敗しました", true);
                }
            };
            input.addEventListener('blur', save);
            td.appendChild(input);
            input.focus();
        }
    };
})();