document.addEventListener('DOMContentLoaded', async () => {
    const itemsPerPageInput = document.getElementById('itemsPerPage');
    const colorPicker = document.getElementById('colorPicker');
    const colorCode = document.getElementById('colorCode');
    const btnSaveSettings = document.getElementById('btnSaveSettings');
    const btnResetSettings = document.getElementById('btnResetSettings');
    const toast = document.getElementById('toast');
    
    // Tag Elements
    const addTagSelect = document.getElementById('addTagSelect');
    const btnAddTag = document.getElementById('btnAddTag');
    const tagListContainer = document.getElementById('tagListContainer');

    const DEFAULT_COLOR = "#4f46e5";
    const DEFAULT_ITEMS = 50;

    let availableTags = [];
    let activeTags = [];        // ['title', 'artist', 'album'...]
    let playerVisibleTags = []; // ['title', 'artist']

    // 固定タグ (削除不可・移動不可)
    const FIXED_TAGS = ['title', 'artist'];

    // 初期ロード
    try {
        // 利用可能な全タグ取得
        availableTags = await eel.get_available_tags()();
        
        // 設定読み込み
        const settings = await eel.get_app_settings()();
        itemsPerPageInput.value = settings.items_per_page;
        const col = settings.primary_color || DEFAULT_COLOR;
        colorPicker.value = col;
        colorCode.textContent = col;
        applyThemeImmediately(col);

        // タグ設定展開
        activeTags = settings.active_tags || [];
        playerVisibleTags = settings.player_visible_tags || [];
        
        renderTagList();
        updateAddTagSelect();

    } catch (e) {
        showToast("設定の読み込みに失敗しました", true);
    }

    // テーマプレビュー
    colorPicker.addEventListener('input', (e) => {
        colorCode.textContent = e.target.value;
        applyThemeImmediately(e.target.value);
    });

    // --- タグ操作 ---

    function renderTagList() {
        tagListContainer.innerHTML = '';
        
        activeTags.forEach(key => {
            const tagDef = availableTags.find(t => t.key === key) || { label: key };
            const isFixed = FIXED_TAGS.includes(key);
            const isVisible = playerVisibleTags.includes(key);

            const li = document.createElement('li');
            li.className = 'tag-item';
            li.setAttribute('data-key', key);

            // 1. Label with handle
            const handleDiv = document.createElement('div');
            handleDiv.className = isFixed ? 'handle disabled' : 'handle';
            
            if (!isFixed) {
                // Drag Icon
                handleDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg> ${tagDef.label}`;
            } else {
                handleDiv.innerHTML = `${tagDef.label} (固定)`;
            }
            li.appendChild(handleDiv);

            // 2. Visible Checkbox
            const checkDiv = document.createElement('div');
            checkDiv.className = 'check-container';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = isVisible;
            if (isFixed) checkbox.disabled = true; // Fixed tags always visible? Requirement: "titlee, artist are checked and cannot uncheck"
            
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!playerVisibleTags.includes(key)) playerVisibleTags.push(key);
                } else {
                    playerVisibleTags = playerVisibleTags.filter(k => k !== key);
                }
            });
            checkDiv.appendChild(checkbox);
            li.appendChild(checkDiv);

            // 3. Delete Button
            const delDiv = document.createElement('div');
            delDiv.className = 'del-btn-area';
            if (!isFixed) {
                const btn = document.createElement('button');
                btn.className = 'btn-del';
                btn.textContent = '削除';
                btn.onclick = () => {
                    activeTags = activeTags.filter(k => k !== key);
                    playerVisibleTags = playerVisibleTags.filter(k => k !== key); // 削除したら非表示にも
                    renderTagList();
                    updateAddTagSelect();
                };
                delDiv.appendChild(btn);
            }
            li.appendChild(delDiv);

            tagListContainer.appendChild(li);
        });

        // Initialize Sortable for DnD
        if (tagListContainer._sortable) tagListContainer._sortable.destroy();
        
        // title, artistは移動不可にするため、それらより下だけsortableにするのが難しいが
        // filterオプションを利用する
        Sortable.create(tagListContainer, {
            handle: '.handle:not(.disabled)', // 固定タグはハンドルが無効(クラスdisabled)なので掴めない
            animation: 150,
            onEnd: function (evt) {
                // DOMの順番に合わせてactiveTagsを再構築
                const newOrder = [];
                tagListContainer.querySelectorAll('.tag-item').forEach(el => {
                    newOrder.push(el.getAttribute('data-key'));
                });
                activeTags = newOrder;
                
                // バリデーション: 固定タグが所定の位置にいるか確認して強制リセットしてもいいが
                // handleオプションで制御しているので、固定タグの下に潜り込むことはあっても
                // 固定タグ自体を動かすことはできない。
                // 要件: "Title/Artist stay at top". This is tricky with simple sortable.
                // シンプルに、「並び替え終わったら強制的に先頭に持ってくる」処理を入れる。
                
                FIXED_TAGS.forEach(fixed => {
                    // もし配列の先頭でなければ移動
                    // 実際にはFilterで操作不可にしてあるが、他のアイテムが上に動くとずれる。
                    // 確実にTopにする。
                });
                // 再整理: Fixedタグを除外して、残りをその後に繋げる
                const others = activeTags.filter(t => !FIXED_TAGS.includes(t));
                activeTags = [...FIXED_TAGS, ...others];
                
                renderTagList(); // 再描画して正しい順序を固定
            }
        });
    }

    function updateAddTagSelect() {
        addTagSelect.innerHTML = '';
        // まだアクティブでないタグを抽出
        const options = availableTags.filter(t => !activeTags.includes(t.key));
        
        options.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.key;
            opt.textContent = t.label;
            addTagSelect.appendChild(opt);
        });

        if (options.length === 0) {
            const opt = document.createElement('option');
            opt.textContent = "(すべてのタグを追加済み)";
            addTagSelect.appendChild(opt);
            btnAddTag.disabled = true;
        } else {
            btnAddTag.disabled = false;
        }
    }

    btnAddTag.addEventListener('click', () => {
        const val = addTagSelect.value;
        if (val && !activeTags.includes(val)) {
            activeTags.push(val);
            renderTagList();
            updateAddTagSelect();
        }
    });


    // --- 保存 & リセット ---

    btnSaveSettings.addEventListener('click', async () => {
        const val = parseInt(itemsPerPageInput.value, 10);
        if (isNaN(val) || val < 1) return showToast("正の整数を入力してください", true);

        const newSettings = {
            items_per_page: val,
            primary_color: colorPicker.value,
            active_tags: activeTags,
            player_visible_tags: playerVisibleTags
        };

        const success = await eel.save_app_settings(newSettings)();
        if (success) {
            showToast("設定を保存しました", false);
            applyThemeImmediately(newSettings.primary_color);
        } else {
            showToast("保存に失敗しました", true);
        }
    });

    btnResetSettings.addEventListener('click', async () => {
        if (!confirm("設定をデフォルトに戻しますか？")) return;
        
        // UIリセット
        itemsPerPageInput.value = DEFAULT_ITEMS;
        colorPicker.value = DEFAULT_COLOR;
        colorCode.textContent = DEFAULT_COLOR;

        const defaultSettings = {
            items_per_page: DEFAULT_ITEMS,
            primary_color: DEFAULT_COLOR,
            // タグ設定もデフォルトへ
            active_tags: ['title','artist','album','genre','track'],
            player_visible_tags: ['title','artist','album','track']
        };

        const success = await eel.save_app_settings(defaultSettings)();
        if (success) {
            showToast("デフォルトに戻しました", false);
            applyThemeImmediately(DEFAULT_COLOR);
            // 変数更新 & 再描画
            activeTags = defaultSettings.active_tags;
            playerVisibleTags = defaultSettings.player_visible_tags;
            renderTagList();
            updateAddTagSelect();
        } else {
            showToast("リセットに失敗しました", true);
        }
    });

    // Theme helpers
    function adjustColorBrightness(hex, amount) {
        let usePound = false;
        if (hex[0] == "#") { hex = hex.slice(1); usePound = true; }
        let num = parseInt(hex, 16);
        let r = (num >> 16) + amount; if (r > 255) r = 255; else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amount; if (b > 255) b = 255; else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amount; if (g > 255) g = 255; else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    }
    function applyThemeImmediately(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        const dark = adjustColorBrightness(color, -20);
        document.documentElement.style.setProperty('--primary-color-dark', dark);
        localStorage.setItem('theme_primary_color', color);
    }
    function showToast(message, isError) {
        toast.textContent = message; toast.className = 'toast show';
        if (isError) toast.classList.add('error'); else toast.classList.add('success');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }
});