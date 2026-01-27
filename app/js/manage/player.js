// プレイヤー制御
(function() {
    const s = window.ManageState;
    const u = window.ManageUtils;

    window.PlayerController = {
        init: function() {
            const audioPlayer = document.getElementById('previewPlayer');
            const seekBar = document.getElementById('seekBar');
            const barPlayBtn = document.getElementById('barPlayBtn');

            // シークバー初期色
            this.updateSeekColor(0);

            // --- イベントリスナー ---
            
            // 再生時間更新
            audioPlayer.addEventListener('timeupdate', () => {
                if (!s.isSeeking) {
                    const current = audioPlayer.currentTime;
                    const duration = audioPlayer.duration;
                    if (!isNaN(duration) && duration > 0) {
                        const ratio = (current / duration);
                        seekBar.value = ratio * 1000;
                        this.updateSeekColor(ratio * 100);
                        document.getElementById('playerTimeDisplay').textContent = 
                            `${u.formatTime(current)} / ${u.formatTime(duration)}`;
                    }
                }
            });

            // 再生終了
            audioPlayer.addEventListener('ended', () => {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
                this.updatePlayIcons(false);
                
                seekBar.value = 0;
                this.updateSeekColor(0);
                document.getElementById('playerTimeDisplay').textContent = 
                    "0:00 / " + u.formatTime(audioPlayer.duration || 0);
            });

            // シークバー操作
            seekBar.addEventListener('mousedown', () => s.isSeeking = true);
            seekBar.addEventListener('touchstart', () => s.isSeeking = true);

            seekBar.addEventListener('input', () => {
                const val = seekBar.value;
                const percentage = val / 10;
                this.updateSeekColor(percentage);

                const duration = audioPlayer.duration;
                if (!isNaN(duration)) {
                    const seekTime = (val / 1000) * duration;
                    document.getElementById('playerTimeDisplay').textContent = 
                        `${u.formatTime(seekTime)} / ${u.formatTime(duration)}`;
                }
            });

            seekBar.addEventListener('change', () => {
                const duration = audioPlayer.duration;
                if (!isNaN(duration)) {
                    audioPlayer.currentTime = (seekBar.value / 1000) * duration;
                }
                s.isSeeking = false;
            });

            // バーの再生ボタン
            barPlayBtn.addEventListener('click', () => {
                if (s.currentPlayingIndex === -1) return;
                
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    this.updatePlayIcons(true);
                } else {
                    audioPlayer.pause();
                    this.updatePlayIcons(false);
                }
            });

            // スペースキー制御
            document.addEventListener('keydown', (e) => {
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                    return;
                }
                if (e.code === 'Space') {
                    e.preventDefault();
                    if (s.currentPlayingIndex !== -1) {
                        if (audioPlayer.paused) {
                            audioPlayer.play();
                            this.updatePlayIcons(true);
                        } else {
                            audioPlayer.pause();
                            this.updatePlayIcons(false);
                        }
                    }
                }
            });
        },

        playPreview: function(index) {
            const item = s.libraryData[index];
            const audioPlayer = document.getElementById('previewPlayer');
            const playerBar = document.getElementById('playerBar');

            // 同じ曲で一時停止/再開
            if (s.currentPlayingIndex === index) {
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    this.updatePlayIcons(true);
                } else {
                    audioPlayer.pause();
                    this.updatePlayIcons(false);
                }
                return;
            }

            // 別の曲へ切り替え（前のアイコンリセット）
            if (s.currentPlayingIndex !== -1) {
                const prevBtn = document.getElementById(`btnPlay_${s.currentPlayingIndex}`);
                if (prevBtn) {
                    prevBtn.innerHTML = s.SVG_PLAY;
                    prevBtn.classList.remove('playing');
                }
            }

            s.currentPlayingIndex = index;

            if (item.musicFilename) {
                const filename = item.musicFilename.split(/[\\/]/).pop();
                audioPlayer.src = `/stream_music/${filename}`;
                audioPlayer.play().catch(e => {
                    console.error(e);
                    u.showToast("再生できませんでした", true);
                });
            }

            // テーブル内アイコンをPauseへ
            const currentBtn = document.getElementById(`btnPlay_${index}`);
            if (currentBtn) {
                currentBtn.innerHTML = s.SVG_PAUSE;
                currentBtn.classList.add('playing');
            }
            
            // バー内アイコンもPauseへ
            document.getElementById('barPlayBtn').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>`;

            this.updatePlayerInfo(item);
            playerBar.classList.add('active');
        },

        stopPreview: function() {
            const audioPlayer = document.getElementById('previewPlayer');
            audioPlayer.pause();
            
            if (s.currentPlayingIndex !== -1) {
                const btn = document.getElementById(`btnPlay_${s.currentPlayingIndex}`);
                if (btn) {
                    btn.innerHTML = s.SVG_PLAY;
                    btn.classList.remove('playing');
                }
            }
            // バー内アイコンをPlayへ
            document.getElementById('barPlayBtn').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>`;
        },

        updatePlayIcons: function(isPlaying) {
            const currentBtn = document.getElementById(`btnPlay_${s.currentPlayingIndex}`);
            const barBtn = document.getElementById('barPlayBtn');
            
            // バー用SVG
            const BAR_SVG_PAUSE = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>`;
            const BAR_SVG_PLAY = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>`;

            if (isPlaying) {
                if (currentBtn) {
                    currentBtn.innerHTML = s.SVG_PAUSE;
                    currentBtn.classList.add('playing');
                }
                barBtn.innerHTML = BAR_SVG_PAUSE;
            } else {
                if (currentBtn) {
                    currentBtn.innerHTML = s.SVG_PLAY;
                    currentBtn.classList.remove('playing');
                }
                barBtn.innerHTML = BAR_SVG_PLAY;
            }
        },

        updatePlayerInfo: function(item) {
            document.getElementById('playerTitle').textContent = item.title || 'Unknown';
            document.getElementById('playerArtist').textContent = item.artist || 'Unknown';

            const parts = [];
            if (item.album) parts.push(item.album);
            if (item.genre) parts.push(item.genre);
            const trackVal = item.track ? item.track : '--';
            parts.push(`Tr. ${trackVal}`);

            const subInfo = document.getElementById('playerSubInfo');
            subInfo.innerHTML = '';
            
            parts.forEach((part, idx) => {
                const span = document.createElement('span');
                span.textContent = part;
                subInfo.appendChild(span);

                if (idx < parts.length - 1) {
                    const divider = document.createElement('span');
                    divider.className = 'p-divider';
                    divider.textContent = '|';
                    subInfo.appendChild(divider);
                }
            });

            const imgSrc = item.imageData || s.DEFAULT_ICON;
            document.getElementById('playerArt').src = imgSrc;
        },

        updateSeekColor: function(percentage) {
            const seekBar = document.getElementById('seekBar');
            seekBar.style.background = `linear-gradient(to right, #4f46e5 ${percentage}%, #e5e7eb ${percentage}%)`;
        }
    };
})();