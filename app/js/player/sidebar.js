(function() {
    const s = window.PlayerState;
    const u = window.PlayerUtils;

    window.SidebarController = {
        
        deleteTargetIndex: -1,

        init: function() {
            this.sidebar = document.getElementById('sidebar');
            this.playlistList = document.getElementById('playlistList');
            
            document.addEventListener('click', () => {
                const bg = document.getElementById('playlistBackgroundMenu');
                const it = document.getElementById('playlistItemMenu');
                if(bg) bg.style.display='none';
                if(it) it.style.display='none';
            });
            
            if (this.sidebar) {
                this.sidebar.addEventListener('contextmenu', (e) => {
                    if (!e.target.closest('.playlist-item')) {
                        e.preventDefault();
                        this.showContextMenu(document.getElementById('playlistBackgroundMenu'), e.clientX, e.clientY);
                    }
                });
            }

            // Menu Items Actions
            const mn = document.getElementById('menuNewPlaylist');
            if(mn) mn.addEventListener('click', () => { s.editingPlaylistIndex = 'new'; this.renderSidebar(); });

            const ms = document.getElementById('menuSmartPlaylist');
            if(ms) ms.addEventListener('click', () => {});

            const mp = document.getElementById('menuPlayPlaylist');
            if(mp) mp.addEventListener('click', () => {
                window.MainViewController.selectPlaylist(s.contextTargetIndex);
                window.PlayerController.startPlaybackSession('normal');
            });

            const msh = document.getElementById('menuShufflePlaylist');
            if(msh) msh.addEventListener('click', () => {
                window.MainViewController.selectPlaylist(s.contextTargetIndex);
                window.PlayerController.startPlaybackSession('shuffle');
            });

            const mr = document.getElementById('menuRenamePlaylist');
            if(mr) mr.addEventListener('click', () => {
                s.editingPlaylistIndex = s.contextTargetIndex;
                this.renderSidebar();
            });

            const mdup = document.getElementById('menuDuplicatePlaylist');
            if(mdup) mdup.addEventListener('click', async () => {
                await eel.duplicate_playlist(s.contextTargetIndex)();
                await this.loadPlaylists();
                u.showToast("複製しました", false);
            });

            const mdel = document.getElementById('menuDeletePlaylist');
            if(mdel) mdel.addEventListener('click', () => {
                this.openDeleteModal(s.contextTargetIndex);
            });

            // Modal Buttons
            const btnCancelDel = document.getElementById('btnCancelDelPl');
            const btnExecDel = document.getElementById('btnExecDelPl');
            
            // ★修正: displayではなくclassで制御する
            if(btnCancelDel) btnCancelDel.addEventListener('click', () => {
                document.getElementById('playlistDeleteModal').classList.remove('show');
            });
            if(btnExecDel) btnExecDel.addEventListener('click', () => {
                this.executeDelete();
            });

            // Key Shortcuts
            document.addEventListener('keydown', (e) => {
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

                if (e.key === 'F2') {
                    if (s.currentPlaylistIndex !== -1 && s.playlists[s.currentPlaylistIndex]) {
                        e.preventDefault();
                        s.editingPlaylistIndex = s.currentPlaylistIndex;
                        this.renderSidebar();
                    }
                }
                
                if (e.key === 'Delete') {
                    if (s.currentPlaylistIndex !== -1 && s.playlists[s.currentPlaylistIndex]) {
                        e.preventDefault();
                        this.openDeleteModal(s.currentPlaylistIndex);
                    }
                }
            });
        },

        loadPlaylists: async function() {
            u.showLoading();
            const loadingText = document.getElementById('loadingText');
            if(loadingText) loadingText.textContent = "プレイリストを準備中...";
            
            setTimeout(async () => {
                try {
                    const list = await eel.get_playlists_with_meta()();
                    list.sort((a, b) => (a.playlistName||"").toLowerCase().localeCompare((b.playlistName||"").toLowerCase(), 'ja'));
                    s.playlists = list;
                    this.renderSidebar();
                    
                    if (s.currentPlaylistIndex !== -1 && s.playlists[s.currentPlaylistIndex]) {
                        window.MainViewController.selectPlaylist(s.currentPlaylistIndex);
                    } else if (s.playlists.length > 0) {
                        window.MainViewController.selectPlaylist(0);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    u.hideLoading(); 
                }
            }, 50);
        },

        renderSidebar: function() {
            if(!this.playlistList) return;
            this.playlistList.innerHTML = '';
            
            s.playlists.forEach((pl, index) => {
                const li = document.createElement('li');
                li.className = 'playlist-item';
                const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px;height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163z" /></svg>`;

                if (index === s.editingPlaylistIndex) {
                    li.innerHTML = iconSvg;
                    const input = document.createElement('input');
                    input.type = 'text'; input.value = pl.playlistName; input.className = 'playlist-name-input';
                    let cancelled = false;
                    input.onblur = () => { if(!cancelled) this.finishRename(index, input.value); };
                    input.onkeydown = (e) => {
                        if(e.key==='Enter') input.blur();
                        else if(e.key==='Escape') { cancelled=true; s.editingPlaylistIndex=-1; this.renderSidebar(); }
                    };
                    li.appendChild(input); setTimeout(()=>input.select(), 0);
                } else {
                    li.innerHTML = `${iconSvg}<span>${u.escapeHtml(pl.playlistName)}</span>`;
                    li.onclick = () => window.MainViewController.selectPlaylist(index);
                    li.addEventListener('contextmenu', (e) => {
                        e.preventDefault(); e.stopPropagation(); s.contextTargetIndex = index;
                        this.showContextMenu(document.getElementById('playlistItemMenu'), e.clientX, e.clientY);
                    });
                }
                this.playlistList.appendChild(li);
            });

            if (s.editingPlaylistIndex === 'new') this.createTemporaryInput();
            if (s.currentPlaylistIndex >= 0 && s.playlists[s.currentPlaylistIndex]) {
                const items = this.playlistList.querySelectorAll('.playlist-item');
                if(items[s.currentPlaylistIndex]) items[s.currentPlaylistIndex].classList.add('active');
            }
        },

        createTemporaryInput: function() {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            li.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px;height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163z" /></svg>`;
            const input = document.createElement('input');
            input.type='text'; input.value="新規プレイリスト"; input.className='playlist-name-input';
            let cancelled=false;
            input.onblur=()=>{ if(!cancelled) this.finishCreate(input.value); };
            input.onkeydown=(e)=>{ if(e.key==='Enter') input.blur(); else if(e.key==='Escape') { cancelled=true; s.editingPlaylistIndex=-1; this.renderSidebar(); }};
            li.appendChild(input); this.playlistList.appendChild(li); setTimeout(()=>input.select(), 0);
        },

        finishCreate: async function(name) {
            s.editingPlaylistIndex = -1;
            if(!name.trim()) name="新規プレイリスト";
            await eel.create_playlist(name)(); 
            await this.loadPlaylists();
            const newIdx = s.playlists.findIndex(p => p.playlistName === name);
            if(newIdx !== -1) window.MainViewController.selectPlaylist(newIdx);
            u.showToast("作成しました", false);
        },

        finishRename: async function(index, newName) {
            s.editingPlaylistIndex = -1;
            if(!newName.trim()) { this.renderSidebar(); return; }
            await eel.rename_playlist(index, newName)(); 
            u.showToast("更新しました", false);
            await this.loadPlaylists(); 
        },

        showContextMenu: function(menu, x, y) {
            const bg = document.getElementById('playlistBackgroundMenu');
            const it = document.getElementById('playlistItemMenu');
            if(bg) bg.style.display='none'; if(it) it.style.display='none';
            const mw = 200; const mh = menu.offsetHeight || 220; 
            if (x + mw > window.innerWidth) x -= mw;
            if (y + mh > window.innerHeight) y -= mh;
            menu.style.left = `${x}px`; menu.style.top = `${y}px`; menu.style.display = 'block';
        },

        openDeleteModal: function(index) {
            this.deleteTargetIndex = index;
            const plName = s.playlists[index] ? s.playlists[index].playlistName : "選択中";
            document.getElementById('delPlaylistName').textContent = plName;
            
            // ★修正: display操作ではなくclass追加
            document.getElementById('playlistDeleteModal').classList.add('show');
        },

        executeDelete: async function() {
            document.getElementById('playlistDeleteModal').classList.remove('show');
            
            if(this.deleteTargetIndex === -1) return;

            await eel.delete_playlist(this.deleteTargetIndex)();
            
            if (this.deleteTargetIndex === s.currentPlaylistIndex) {
                s.currentPlaylistIndex = -1;
                document.getElementById('currentPlaylistTitle').textContent = "プレイリストを選択";
                document.getElementById('currentPlaylistCount').textContent = "-- 曲";
                document.getElementById('currentPlaylistDuration').textContent = "--";
                document.getElementById('songListBody').innerHTML = '';
                document.getElementById('playlistActions').style.display = "none";
            } else if (this.deleteTargetIndex < s.currentPlaylistIndex) {
                s.currentPlaylistIndex--;
            }

            this.deleteTargetIndex = -1;
            await this.loadPlaylists(); 
            u.showToast("削除しました", false);
        }
    };
})();