(function() {
    const s = window.PlayerState;
    const u = window.PlayerUtils;
    // window.HeaderController 等は他のモジュールで定義されるため、使用時に適宜参照

    window.PlayerController = {
        init: function() {
            this.audio = document.getElementById('mainAudio');
            this.seekBar = document.getElementById('hpSeekBar');

            // ヘッダーのコントロールボタン
            document.getElementById('hdrBtnPlayPause').addEventListener('click', () => this.togglePlayPause());
            document.getElementById('hdrBtnNext').addEventListener('click', () => this.nextSong());
            document.getElementById('hdrBtnPrev').addEventListener('click', () => this.prevSong());
            document.getElementById('hdrBtnStop').addEventListener('click', () => {
                this.stopPlayback();
                // 停止時はヘッダー表示を切り替え
                document.getElementById('headerPlayerInfo').style.display = 'none';
                document.getElementById('headerControls').style.display = 'none';
                document.getElementById('headerLogo').style.display = 'flex'; // blockではなくflexで中央寄せ維持
            });

            // Audioイベント
            this.audio.addEventListener('ended', () => this.nextSong());
            
            this.audio.addEventListener('timeupdate', () => {
                if (!s.isSeeking) {
                    const curr = this.audio.currentTime;
                    const dur = this.audio.duration;
                    if (dur) {
                        const ratio = curr / dur;
                        this.seekBar.value = ratio * 1000;
                        this.updateSeekColor(ratio * 100);
                        document.getElementById('hpTimeCurrent').textContent = u.formatTime(curr);
                        document.getElementById('hpTimeTotal').textContent = u.formatTime(dur);
                    }
                }
            });

            // シークバー制御
            this.seekBar.addEventListener('mousedown', () => s.isSeeking = true);
            this.seekBar.addEventListener('input', () => this.updateSeekColor(this.seekBar.value / 10));
            this.seekBar.addEventListener('change', () => {
                if (this.audio.duration) {
                    this.audio.currentTime = (this.seekBar.value / 1000) * this.audio.duration;
                }
                s.isSeeking = false;
            });
            
            this.updateSeekColor(0);

            // キーボードショートカット
            document.addEventListener('keydown', (e) => {
                // 入力欄にフォーカスがあるときは無視
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                    return;
                }
                
                if (e.code === 'Space') {
                    e.preventDefault(); // スクロール防止
                    
                    if (e.shiftKey) {
                        // Shift + Space: 完全停止
                        // ヘッダープレイヤーが表示されている場合のみ実行
                        if (document.getElementById('headerPlayerInfo').style.display !== 'none') {
                            document.getElementById('hdrBtnStop').click();
                        }
                    } else if (s.queue.length > 0) {
                        // Space: 再生/一時停止
                        this.togglePlayPause();
                    }
                }
            });
        },

        startPlaybackSession: function(mode, startIndex = 0) {
            // 現在選択されているプレイリスト情報を取得
            if (s.currentPlaylistIndex === -1 || !s.playlists[s.currentPlaylistIndex]) return;
            const pl = s.playlists[s.currentPlaylistIndex];
            if (!pl || pl.songs.length === 0) return;

            // UI切り替え
            document.getElementById('headerLogo').style.display = 'none';
            document.getElementById('headerPlayerInfo').style.display = 'flex';
            document.getElementById('headerControls').style.display = 'flex';

            // リストをソート状態に合わせて準備
            const sortedList = u.sortSongs(pl.songs, pl.sortBy);
            s.originalList = [...sortedList];

            if (mode === 'shuffle') {
                s.isShuffle = true;
                s.loopMode = 'off';
                s.queue = u.shuffleArray([...s.originalList]);
                s.currentIndex = 0;
            } else {
                if (s.isShuffle) {
                    // 既にシャッフルならシャッフル順序を維持または再シャッフル（仕様によるが今回は再生成）
                    // 以前のロジック: startPlaybackSession('normal') ならシャッフル維持しつつ、選択曲を再生？
                    // 以前の回答コード:
                    s.queue = u.shuffleArray([...s.originalList]);
                } else {
                    s.queue = [...s.originalList];
                }
                s.currentIndex = startIndex;
                
                // 指定曲（startIndex）を確実に再生するためのインデックス調整
                // shuffleモードでnormal再生（ダブルクリック）した場合、対象曲を今のインデックスにする必要があるが
                // shuffle後の配列での位置を探す
                if (s.isShuffle) {
                    // target song object
                    const targetSong = s.originalList[startIndex];
                    // Find in shuffled queue
                    const qIdx = s.queue.findIndex(x => x.musicFilename === targetSong.musicFilename);
                    if (qIdx !== -1) s.currentIndex = qIdx;
                }
            }
            
            // ボタン状態を更新
            window.HeaderController.updateToggleButtons();
            
            this.playCurrentIndex();
        },

        playCurrentIndex: function() {
            const song = s.queue[s.currentIndex];
            if (!song) return;

            if (song.musicFilename) {
                const fname = song.musicFilename.split(/[\\/]/).pop();
                this.audio.src = `/stream_music/${fname}`;
                this.audio.play().catch(e => {
                    console.error("再生エラー:", e);
                    u.showToast("再生できませんでした", true);
                });
                s.isPlaying = true;
            }

            // ヘッダー情報更新
            window.HeaderController.updateHeaderUI(song);
            window.HeaderController.updatePlayIcons(true);
            
            // メインリストのハイライト更新
            window.MainViewController.renderMainView(); 
        },

        togglePlayPause: function() {
            if (s.queue.length === 0) return;
            
            if (this.audio.paused) {
                this.audio.play();
                s.isPlaying = true;
                window.HeaderController.updatePlayIcons(true);
            } else {
                this.audio.pause();
                s.isPlaying = false;
                window.HeaderController.updatePlayIcons(false);
            }
            window.MainViewController.renderMainView();
        },

        stopPlayback: function() {
            this.audio.pause();
            this.audio.currentTime = 0;
            s.isPlaying = false;
            
            window.HeaderController.updatePlayIcons(false);
            window.MainViewController.renderMainView();
        },

        nextSong: function() {
            if (s.loopMode === 'one') {
                this.audio.currentTime = 0;
                this.audio.play();
                return;
            }

            if (s.currentIndex < s.queue.length - 1) {
                s.currentIndex++;
                this.playCurrentIndex();
            } else {
                // 最後まで再生した
                if (s.loopMode === 'all') {
                    if (s.isShuffle) {
                        s.queue = u.shuffleArray([...s.originalList]);
                    }
                    s.currentIndex = 0;
                    this.playCurrentIndex();
                } else {
                    this.stopPlayback();
                }
            }
        },

        prevSong: function() {
            // 3秒以上再生していたら頭出し
            if (this.audio.currentTime > 3) {
                this.audio.currentTime = 0;
                return;
            }
            
            if (s.currentIndex > 0) {
                s.currentIndex--;
                this.playCurrentIndex();
            } else {
                if (s.loopMode === 'all') {
                    s.currentIndex = s.queue.length - 1;
                    this.playCurrentIndex();
                } else {
                    this.audio.currentTime = 0;
                }
            }
        },

        isSongPlaying: function(song) {
            // 一時停止中も「現在選択されている曲」ならTrueを返す
            // （再生ボタン・ハイライト用）
            const currentSong = s.queue[s.currentIndex];
            if (!currentSong) return false;
            // パス比較
            return currentSong.musicFilename === song.musicFilename;
        },
        
        // シャッフルボタンを押した時の動的変更用（空実装またはロジック追加）
        syncShuffle: function() {
            // 必要に応じて現在のキューを再シャッフルするなど
        },
        
        updateSeekColor: function(p) {
            this.seekBar.style.background = `linear-gradient(to right, #4f46e5 ${p}%, #e5e7eb ${p}%)`;
        }
    };
})();