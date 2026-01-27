(function() {
    const s = window.PlayerState;
    const u = window.PlayerUtils;

    window.HeaderController = {
        init: function() {
            this.hpTitleContainer = document.getElementById('hpTitleContainer');
            this.hpSubContainer = document.getElementById('hpSubContainer');
            this.hpArtImg = document.getElementById('hpArtImg');
            this.btnShuffleToggle = document.getElementById('btnShuffleToggle');
            this.btnLoopToggle = document.getElementById('btnLoopToggle');
            this.hdrBtnPlayPause = document.getElementById('hdrBtnPlayPause');
            
            this.btnShuffleToggle.addEventListener('click', () => {
                s.isShuffle = !s.isShuffle;
                window.PlayerController.syncShuffle();
                this.updateToggleButtons();
            });

            this.btnLoopToggle.addEventListener('click', () => {
                if (s.loopMode === 'off') s.loopMode = 'all';
                else if (s.loopMode === 'all') s.loopMode = 'one';
                else s.loopMode = 'off';
                this.updateToggleButtons();
            });
            this.updateToggleButtons();
        },

        updateHeaderUI: function(song) {
            this.setTextWithMarquee(this.hpTitleContainer, song.title || 'Unknown', 'hp-title');
            
            const album = song.album || ''; 
            const artist = song.artist || '';
            let subText = "";
            if(album && artist) subText = `${album} - ${artist}`;
            else subText = album || artist;
            this.setTextWithMarquee(this.hpSubContainer, subText, 'hp-sub');

            const artSrc = song.imageData || s.DEFAULT_ICON;
            this.hpArtImg.src = artSrc;
        },

        setTextWithMarquee: function(container, text, className) {
            container.innerHTML = `<div class="${className}">${u.escapeHtml(text)}</div>`;
            const element = container.firstElementChild;
            if (element.scrollWidth > container.clientWidth) {
                const escaped = u.escapeHtml(text);
                container.innerHTML = `<div class="marquee-wrapper"><span class="marquee-content">${escaped}</span><span class="marquee-content">${escaped}</span></div>`;
            }
        },

        updatePlayIcons: function(isPlaying) {
            if (isPlaying) {
                this.hdrBtnPlayPause.innerHTML = s.SVG_PAUSE;
                this.hdrBtnPlayPause.title = "一時停止 (Space)";
            } else {
                this.hdrBtnPlayPause.innerHTML = s.SVG_PLAY;
                this.hdrBtnPlayPause.title = "再生 (Space)";
            }
        },

        updateToggleButtons: function() {
            if (s.isShuffle) this.btnShuffleToggle.classList.add('active');
            else this.btnShuffleToggle.classList.remove('active');

            this.btnLoopToggle.className = 'btn-icon-toggle';
            if (s.loopMode === 'all') this.btnLoopToggle.classList.add('active');
            else if (s.loopMode === 'one') this.btnLoopToggle.classList.add('active-one');
        }
    };
})();