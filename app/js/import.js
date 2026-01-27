// Pythonから呼び出す進捗更新関数
eel.expose(js_import_progress);
function js_import_progress(current, total, message) {
    const logList = document.getElementById('logList');
    const logArea = document.getElementById('logArea');
    const btnImport = document.getElementById('btnImport');
    
    logArea.style.display = 'block';
    
    let progressItem = document.getElementById('import-progress-item');
    if (!progressItem) {
        progressItem = document.createElement('li');
        progressItem.id = 'import-progress-item';
        progressItem.className = 'log-info';
        progressItem.style.fontWeight = 'bold';
        progressItem.style.color = '#fbbf24';
        logList.appendChild(progressItem);
    }
    
    const percentage = Math.round((current / total) * 100);
    progressItem.textContent = `[進捗 ${percentage}%] ${message}`;
    logList.scrollTop = logList.scrollHeight;
    
    btnImport.textContent = `処理中... ${percentage}%`;
}

document.addEventListener('DOMContentLoaded', () => {
    
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    const btnImport = document.getElementById('btnImport');
    const logArea = document.getElementById('logArea');
    const logList = document.getElementById('logList');

    let selectedFile = null;

    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        handleFileSelect(e.dataTransfer.files[0]);
    });

    function handleFileSelect(file) {
        if (!file) return;

        const name = file.name.toLowerCase();
        if (!name.endsWith('.csv') && !name.endsWith('.json')) {
            alert("CSV または JSON ファイルを選択してください。");
            return;
        }

        selectedFile = file;
        fileNameDisplay.textContent = `選択中: ${file.name}`;
        fileNameDisplay.style.color = 'var(--primary-color)';
        btnImport.disabled = false;
        
        logArea.style.display = 'none';
        logList.innerHTML = '';
    }

    btnImport.addEventListener('click', () => {
        if (!selectedFile) return;

        const reader = new FileReader();
        
        logArea.style.display = 'block';
        addLog(`ファイルの読み込みを開始: ${selectedFile.name}`, 'info');
        btnImport.disabled = true;
        btnImport.textContent = "待機中...";

        reader.onload = async (e) => {
            const content = e.target.result;
            const type = selectedFile.name.toLowerCase().endsWith('.csv') ? 'csv' : 'json';
            
            try {
                addLog("データを解析中...", 'info');
                
                const results = await eel.execute_import(content, type)();
                
                let hasError = false;
                results.forEach(log => {
                    if (log.status === 'error') {
                        addLog(`[失敗] ${log.message}`, 'error');
                        hasError = true;
                    } else if (log.status === 'info') {
                        addLog(log.message, 'info');
                    }
                });

                if (hasError) {
                    showToast("インポート処理中にエラーが発生しました", true);
                    resetUI(true);
                } else {
                    addLog("=== 全ての処理が完了しました ===", 'info');
                    showToast("インポート処理が完了しました", false);
                    resetUI(false);
                }

            } catch (error) {
                console.error(error);
                addLog(`システムエラーが発生しました: ${error}`, 'error');
                showToast("インポート処理中にエラーが発生しました", true);
                resetUI(true);
            }
        };

        reader.onerror = () => {
            addLog("ファイルの読み込みに失敗しました。", 'error');
            showToast("インポート処理中にエラーが発生しました", true);
            resetUI(true);
        };

        reader.readAsText(selectedFile);
    });

    function addLog(message, type = 'normal') {
        const li = document.createElement('li');
        li.textContent = message;
        if (type === 'success') li.className = 'log-success';
        if (type === 'error') li.className = 'log-error';
        if (type === 'info') li.className = 'log-info';
        logList.appendChild(li);
        logList.scrollTop = logList.scrollHeight;
    }

    function resetUI(keepLogs) {
        fileInput.value = '';
        selectedFile = null;
        fileNameDisplay.textContent = "CSV または JSON ファイルを選択";
        fileNameDisplay.style.color = "var(--text-main)";
        
        btnImport.disabled = true;
        btnImport.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            インポートを開始`;

        if (!keepLogs) {
            logArea.style.display = 'none';
            logList.innerHTML = '';
        }
    }

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
        }, 5000);
    }
});