# 日本語
## このアプリについて
これはMusicManagerというWindowsOS専用のアプリです。v1.0.0-beta1ではポータブル版のみ対応しており、zipを展開してすぐに利用可能です。
アプリ内容についてですが、YouTubeなどのプラットフォームからダウンロードしたりしてご自身で入手された音楽を管理できるアプリとなっております。
おおよそオフラインでご利用いただけます。（一部オンラインが必要な機能搭載予定）
アプリ開発にはGemini 3 Pro Previewを利用しております。

## すぐ使いたいならここ読んで！（アプリの起動方法、使い方）
zipファイルを展開し、中のMusicManager.exeを実行します。ブラウザが立ち上がります。
「曲を追加」ではMusicManagerに曲を登録します。曲名、アーティスト、アルバムなどが設定できます。情報を入力して楽曲ファイルをアップロードしたら、「ライブラリに追加」をクリックします。
ここで追加した楽曲は「データベースを管理」の画面に表示されます。セルをダブルクリックして編集できます。試聴もできます。削除もここで可能です。
音楽をプレイリストに登録して楽しむには「音楽を再生」をクリックします。
画面を開くと既存のプレイリストが読み込まれますが、初期状態では何も登録されていません。
「プレイリスト」という文字の下の何もない個所を右クリックすると、「プレイリストを新規作成」という項目が表示されます。これをクリックしてプレイリストを作成します。
プレイリストに曲を追加するには左の追加したいプレイリスト名を右クリックします。「曲を編集」をクリックします。
ここで登録されている楽曲一覧が表示されるのでプレイリストに追加したい楽曲にチェックを入れて右下の「設定」をクリックします。
タイトル、アーティスト、アルバムなどカラムをクリックすることでソートできたり様々な機能がこの画面にはあります。詳細は下部の全機能説明をご確認ください。
そしたらプレイリストをどれかクリックして右に表示された再生ボタンやシャッフルボタンを押してみましょう。プレイリストを再生できます。

## ファイル構成と起動まで
v1.0.0-beat1の場合、ダウンロードされたzipファイルをFreesoftなどのフォルダ内で展開します。
（7-zipをご利用の場合、「ここに展開」ではなく「展開」がおすすめです。Freesoftなどのフォルダ内で展開する理由については今後の利用方法をお読みいただければおわかりいただけます。）
展開するとappフォルダとMusicManager.exeがあります。appフォルダは絶対に削除しないでください。再ダウンロードする以外に復元する方法はございません。
また、appフォルダとMusicManager.exeのディレクトリ構造を変えないでください。（appフォルダとMusicManager.exeをまとめて移動する場合は構いません）
MusicManager.exeが本体になり、appフォルダはMusicManager.exeのUIを構成するものです。
MusicManager.exeを実行するとlibraryフォルダとuserfilesフォルダが生成されます。
libraryフォルダにはimagesフォルダ、musicフォルダが生成されます。
userfilesフォルダにはsettings.ini（アプリ内設定の保存）が生成されます。
基本的にlibraryフォルダやuserfilesフォルダには手を加えないことを推奨します。
appフォルダはhtml, css, jsファイルが多数保存されておりますので、ご自身でデザイン変更などをすることも可能です。

## 全機能説明
### 曲を追加
「曲を追加」ではMusicManagerに曲を登録します。曲名、アーティスト、アルバム、ジャンル、トラックナンバー、アルバムアートが設定できます。情報を入力して楽曲ファイルをアップロードしたら、「ライブラリに追加」をクリックします。
### データベースを管理
「データベースを管理」では登録されたすべての楽曲が表示されます。ページ分けされています。初期状態では1ページあたり50曲表示されますが、これは設定で変更可能です。また、すべて表示をすることもできます。（500曲あたりを目安に重くなり始めます）
### エクスポート
「エクスポート」では楽曲ファイル、アルバムアート、データベース、設定ファイル、プレイリスト・再生履歴を出力することができます。ファイル構成をそのまま引き継げるので互換性のあるバージョンの場合、エクスポートしたzipファイルを展開して、中野フォルダやファイルをすべてMusicManager.exeと同階層に設置することで、引き継ぐことができます。そのままのファイルで引き継げるかどうかやそのまま引き継げない場合の引き継ぎ対処法などはReleaseNoteをご確認ください。
また、エクスポート機能では保存先とファイル名を指定できます。エクスポート完了後、どこに保存されたのか再確認できます。ただし、この画面を閉じるとどこに保存したのかは二度と表示されません。
楽曲データは保存内容には著作権にも関わり、再生履歴や聞いている楽曲、プレイリストなどは個人情報の流出になりかねません。そのため、エクスポートにはパスワード保護をかけることができまあす。パスワード保護をかけると、エクスポートされたzipファイルがパスワード付きzipになります。
ただし、エクスポート機能で楽曲の項目を有効にすると楽曲ファイル数が多い場合、エクスポートにかなり自時間がかかります。予めご了承ください。
### インポート
「インポート」では既定の形式で書かれた楽曲一覧のjsonファイルを読み込むことで楽曲のコピー、アルバムアートのコピー、mp3tag設定、データベースへの登録をすべて自動で行います。すでにほかの楽曲管理アプリをご利用の場合はこちらの方が便利かもしれません。jsonファイルの形式は言語別説明の最後の言語の下（Readmeの一番最後）をご確認ください。（import.json）
※v1.0.0-beta1ではcsv形式のインポートには対応していません。ご了承ください。
### 音楽を再生
「音楽を再生」ではプレイリストを作成してデータベースに登録した楽曲を再生することができます。プレイリストの作成は左の「プレイリスト」という文字の下の何もない箇所を右クリックし、「プレイリストを新規作成」をクリックします。
※もう一つの「スマートプレイリストを作成」はv1.0.0-beta1ではご利用いただけません。
プレイリスト名を編集するには左の変更したいプレイリスト名を右クリックし、「プレイリスト名を編集」をクリックします。
プレイリストを削除するには左の削除したいプレイリスト名を右クリックし、「ライブラリから削除」をクリックします。
※プレイリストの削除によって登録されている楽曲データに影響はございません。
プレイリストに登録している楽曲リストを編集するには、左の変更したいプレイリスト名を右クリックして、「曲を編集」をクリックします。「音楽を再生」の画面を開いてから初めてここをクリックすると、ここで楽曲リストの読み込みが発生します。読み込みが完了すると、楽曲リストが表示されるので、プレイリストに追加したい楽曲にチェックを入れます。
この画面ではさまざまな選択方法がございます。一つの楽曲にチェックを入れてからShiftを押しながら別の楽曲をクリックすると、一つ目にチェックを入れた楽曲から、Shiftを押しながらクリックした楽曲まで全てにチェックが入ります。
※後述するフィルターや並べ替えで一部楽曲になっている場合、表示されている楽曲においてチェックが入ります。
カラム名をクリックすると、そのカラムでソートします。もう一度クリックすると逆順になります。
検索ボックスに文字を入力すると、その文字列をmp3tagで設定されている文字列に含む楽曲だけにフィルターがかけられます。（曲が多いほど処理に時間がかかります）
マウスでクリックしながらカーソルを移動させるとチェックを入れることができます。（自動スクロールはされません。）
プレイリストの楽曲リストの設定を完了するには右下の「設定」をクリックします。
元の画面で、プレイリストの楽曲リストを再生するには再生ボタンをクリックします。シャッフル再生にはシャッフルボタンをクリックします。

## 内部システム
pythonのeelライブラリとウェブUIの制限上、tkinterを利用しないとファイルパスを参照ということができず、仮にファイルパスを参照できたとしてJSで楽曲を再生できないので楽曲をコピーしています。
ファイルをライブラリに追加した時点で楽曲ファイルはlibrary/musicに<ランダムな文字列>.mp3で保存されます。保存の際にmp3tagも設定されます。また、既存のmp3tagは削除されます。
アルバムアートも追加した場合、画像ファイルはlibrary/imagesに<ランダムな文字列>.pngで保存されます。（もしかしたらjpgでも保存される可能性があります。pngでないとエラー発生の可能性あり）
アルバムアートのランダムな文字列と楽曲ファイルのランダムな文字列は同じものです。
データベース管理から楽曲データを削除すると、論理削除ではなく事実削除となり、library/musicやlibrary/imagesから関連付けられたファイルは削除されます。
また、userfiles/music.jsonからも結びつけが解除されます。
userfiles/music.jsonは楽曲を追加するごとにランダムな文字列のファイル名と楽曲名、アーティストなどの楽曲情報などを結び付ける機能があり、このファイルが削除されたり、楽曲の結びつけが解除されると、データベース管理画面に表示されなくなります。
逆に楽曲ファイルを削除したり、アルバムアートを削除してmusic.jsonを残すと、再生時にエラーが発生します。タイトル、アーティストの編集でもmp3tagを書き込むのでそのタイミングにもエラーが発生します。
プレイリスト一覧はuserfiles/playlist.jsonにて管理しています。楽曲ファイルパス（相対パス）とプレイリスト名、ソート基準などが保存されています。

## 今後の開発予定機能
歌詞表示
スマートプレイリスト
多言語対応？
プレイリストの楽曲並び順変更
インポートのcsv対応
「音楽を再生」の画面で楽曲リストをプリロード

ご依頼いただいた文章を各言語に翻訳いたしました。

-- これは原文です --

***

# English
## About this App
This is a Windows-exclusive application called MusicManager. In v1.0.0-beta1, only the portable version is supported, which can be used immediately after extracting the zip file.
Regarding the app's content, it is a tool for managing music you have acquired yourself, such as by downloading from platforms like YouTube.
It is mostly functional offline (features requiring an online connection are planned for the future).
Gemini 3 Pro Preview is being used for the development of this app.

## Read this if you want to use it right away! (How to launch and use the app)
Extract the zip file and run MusicManager.exe inside. A browser will open.
In "Add Song," you register songs to MusicManager. You can set the song title, artist, album, etc. After entering the information and uploading the music file, click "Add to Library."
Songs added here will be displayed on the "Manage Database" screen. You can double-click a cell to edit it. You can also preview and delete songs here.
To register music into a playlist and enjoy it, click "Play Music."
When you open the screen, existing playlists will be loaded, but nothing is registered in the initial state.
Right-click on the empty space under the text "Playlists" to see the "Create New Playlist" option. Click this to create a playlist.
To add songs to a playlist, right-click the name of the playlist you want to add to on the left. Click "Edit Songs."
A list of registered songs will be displayed; check the songs you want to add to the playlist and click "Set" at the bottom right.
This screen has various functions, such as sorting by clicking column headers (Title, Artist, Album, etc.). For details, please check the "Full Feature Description" below.
Then, click on a playlist and try pressing the play or shuffle buttons displayed on the right. You can now play your playlist.

## File Structure and Launching
For v1.0.0-beta1, extract the downloaded zip file into a folder like "Freesoft."
(If using 7-zip, "Extract" is recommended over "Extract here." The reason for extracting within a folder like Freesoft will become clear if you read the future usage instructions.)
Once extracted, you will find an "app" folder and "MusicManager.exe." Never delete the "app" folder. There is no way to restore it other than re-downloading.
Also, do not change the directory structure of the "app" folder and MusicManager.exe (it is fine to move them together as a set).
MusicManager.exe is the main executable, and the "app" folder constitutes the UI of MusicManager.exe.
Running MusicManager.exe generates "library" and "userfiles" folders.
The "library" folder will contain "images" and "music" folders.
The "userfiles" folder will contain "settings.ini" (saves in-app settings).
It is generally recommended not to modify the "library" or "userfiles" folders manually.
The "app" folder contains many html, css, and js files, so it is possible to change the design yourself.

## Full Feature Description
### Add Song
In "Add Song," you register songs to MusicManager. You can set the song title, artist, album, genre, track number, and album art. After entering the information and uploading the music file, click "Add to Library."
### Manage Database
"Manage Database" displays all registered songs. It is paginated. By default, 50 songs are displayed per page, but this can be changed in the settings. You can also choose to display all songs (it starts to become slow around 500 songs).
### Export
In "Export," you can output music files, album art, the database, settings files, playlists, and playback history. Since the file structure is preserved, you can carry over your data to a compatible version by extracting the exported zip file and placing all the folders and files inside in the same directory as MusicManager.exe. Please check the ReleaseNotes to see if data can be carried over directly or for troubleshooting if it cannot.
Additionally, the export function allows you to specify the destination and filename. After the export is complete, you can re-confirm where it was saved. However, once you close this screen, the save location will never be displayed again.
Music data involves copyright, and playback history or playlists could lead to a leak of personal information. Therefore, exports can be password-protected. If protected, the exported zip file will become a password-protected zip.
Please note that if the music item is enabled in the export function and there are many music files, the export will take a considerable amount of time.
### Import
In "Import," by loading a JSON file of a song list written in the specified format, the app automatically performs music copying, album art copying, mp3tag settings, and database registration. This may be more convenient if you are already using another music management app. Please check the bottom of the language-specific description (at the very end of the Readme) for the JSON file format (import.json).
*Note: v1.0.0-beta1 does not support CSV import. We appreciate your understanding.
### Play Music
In "Play Music," you can create playlists and play songs registered in the database. To create a playlist, right-click the empty area under the "Playlists" text on the left and click "Create New Playlist."
*Note: The other option, "Create Smart Playlist," is not available in v1.0.0-beta1.
To edit a playlist name, right-click the playlist name on the left and click "Edit Playlist Name."
To delete a playlist, right-click the playlist name on the left and click "Remove from Library."
*Deleting a playlist does not affect the registered song data.
To edit the song list registered in a playlist, right-click the playlist name on the left and click "Edit Songs." The first time you click this after opening the "Play Music" screen, the song list will be loaded. Once loading is complete, the song list will be displayed; check the songs you want to add to the playlist.
There are various selection methods on this screen. If you check one song and then click another song while holding Shift, all songs from the first checked song to the Shift-clicked song will be checked.
*If only some songs are shown due to filters or sorting (described below), the check will apply to the displayed songs.
Clicking a column name will sort by that column. Clicking it again reverses the order.
Entering text in the search box filters songs to only those that contain that string in their mp3tag. (Processing takes more time as the number of songs increases.)
You can also check items by clicking and moving the cursor with the mouse (auto-scroll is not supported).
To complete the playlist song list settings, click "Set" at the bottom right.
On the original screen, click the play button to play the playlist's song list. Click the shuffle button for shuffle play.

## Internal System
Due to the limitations of Python's Eel library and the Web UI, it is impossible to reference file paths without using tkinter. Even if a path could be referenced, JS cannot play the music directly, so the files are copied.
When a file is added to the library, the music file is saved in `library/music` as `<random string>.mp3`. The mp3tag is also set during saving, and any existing mp3tag is removed.
If album art is also added, the image file is saved in `library/images` as `<random string>.png`. (There is a possibility it might be saved as jpg, but using non-png files might cause errors.)
The random string for the album art and the music file is identical.
When song data is deleted from Database Management, it is a physical deletion, not a logical one; the associated files are removed from `library/music` and `library/images`.
The link is also removed from `userfiles/music.json`.
`userfiles/music.json` functions to link random-string filenames with song titles, artists, and other song information. If this file is deleted or a song's link is removed, it will no longer appear in the Database Management screen.
Conversely, if you delete a music file or album art but leave `music.json` as is, an error will occur during playback. Errors will also occur when editing titles or artists because the mp3tag is written at that time.
The playlist list is managed in `userfiles/playlist.json`. Music file paths (relative), playlist names, and sorting criteria are saved there.

## Future Development Plans
Lyrics display
Smart playlists
Multi-language support?
Change song order in playlists
CSV support for import
Preload song lists on the "Play Music" screen

-- This was translated by Gemini 3 Flash Preview --

***

# 台灣華語
## 關於此應用程式
這是一款名為 MusicManager 的 Windows OS 專用應用程式。在 v1.0.0-beta1 版本中，僅支援免安裝版，解壓縮 zip 檔案後即可立即使用。
關於應用程式內容，這是一款可以管理您自行取得（例如從 YouTube 等平台下載）的音樂的應用程式。
大部分功能可在離線狀態下使用（預計未來將加入部分需要連線的功能）。
本應用程式開發使用了 Gemini 3 Pro Preview。

## 想立即使用請閱讀此處！（應用程式啟動方法、使用方式）
解壓縮 zip 檔案，並執行其中的 MusicManager.exe。瀏覽器將會開啟。
在「新增歌曲」中，可以將歌曲註冊到 MusicManager。可以設定曲名、演出者、專輯等資訊。輸入資訊並上傳歌曲檔案後，點擊「加入媒體庫」。
在此新增的歌曲將顯示在「管理資料庫」畫面中。您可以雙擊單元格進行編輯。也可以進行試聽或在此刪除。
若要將音樂註冊到播放清單並享受音樂，請點擊「播放音樂」。
開啟畫面時會載入現有的播放清單，但在初始狀態下尚未註冊任何內容。
在「播放清單」文字下方的空白區域點擊右鍵，會顯示「建立新播放清單」項目。點擊此項即可建立播放清單。
若要將歌曲加入播放清單，請右鍵點擊左側想要加入的播放清單名稱，然後點擊「編輯歌曲」。
此處會顯示已註冊的歌曲列表，勾選想要加入播放清單的歌曲，然後點擊右下角的「設定」。
此畫面具有多種功能，例如點擊標題、演出者、專輯等欄位名稱進行排序。詳情請參閱下方的「全功能說明」。
接著點擊任一播放清單，並按下右側顯示的播放按鈕或隨機播放按鈕。即可開始播放播放清單。

## 檔案結構與啟動
在 v1.0.0-beta1 的情況下，請將下載的 zip 檔案解壓縮到「Freesoft」等資料夾中。
（如果您使用 7-zip，建議選擇「解壓縮」而非「解壓縮到此處」。關於在 Freesoft 等資料夾中解壓縮的原因，閱讀之後的使用說明即可明白。）
解壓縮後會有 app 資料夾和 MusicManager.exe。請絕對不要刪除 app 資料夾。除了重新下載之外，沒有其他復原方法。
此外，請勿更改 app 資料夾與 MusicManager.exe 的目錄結構（若將 app 資料夾與 MusicManager.exe 整體移動則沒問題）。
MusicManager.exe 是主程式，app 資料夾則是用於構成 MusicManager.exe 的 UI 使用者介面。
執行 MusicManager.exe 後，會生成 library 資料夾和 userfiles 資料夾。
library 資料夾中會生成 images 資料夾和 music 資料夾。
userfiles 資料夾中會生成 settings.ini（儲存應用程式內設定）。
基本上建議不要變動 library 資料夾或 userfiles 資料夾。
app 資料夾中存放了許多 html、css、js 檔案，因此您也可以自行更改設計。

## 全功能說明
### 新增歌曲
在「新增歌曲」中將歌曲註冊到 MusicManager。可以設定曲名、演出者、專輯、類型、曲目編號、專輯封面。輸入資訊並上傳歌曲檔案後，點擊「加入媒體庫」。
### 管理資料庫
「管理資料庫」中會顯示所有已註冊的歌曲。採用分頁顯示。初始狀態下每頁顯示 50 首歌，這可以在設定中更改。此外也可以選擇顯示全部（超過 500 首歌左右會開始變得緩慢）。
### 匯出
「匯出」功能可以輸出歌曲檔案、專輯封面、資料庫、設定檔、播放清單及播放紀錄。由於可以原樣繼承檔案結構，因此若是相容版本，只需解壓縮匯出的 zip 檔案，並將其中的資料夾和檔案全部放置在與 MusicManager.exe 同一階層中，即可完成轉移。關於是否可以直接轉移或無法直接轉移時的對策，請查看版本說明（ReleaseNote）。
此外，匯出功能可以指定儲存位置和檔案名稱。匯出完成後，可以再次確認儲存位置。但請注意，一旦關閉此畫面，儲存位置將不再顯示。
音樂數據涉及版權，而播放紀錄、正在聽的歌曲、播放清單等可能涉及個人隱私洩漏。因此，匯出功能可以設定密碼保護。設定密碼保護後，匯出的 zip 檔案將成為加密 zip 檔。
不過請注意，如果在匯出功能中勾選歌曲項目且歌曲數量較多時，匯出將花費相當長的時間。
### 匯入
「匯入」功能可透過讀取特定格式編寫的歌曲列表 JSON 檔案，自動執行歌曲複製、專輯封面複製、mp3tag 設定及資料庫註冊。如果您已經在使用其他歌曲管理應用程式，此功能可能會更方便。JSON 檔案的格式請參閱語言說明最後方（Readme 的最末尾）(import.json)。
※v1.0.0-beta1 不支援 CSV 格式匯入。敬請見諒。
### 播放音樂
「播放音樂」可以建立播放清單並播放註冊到資料庫中的歌曲。建立播放清單的方法是在左側「播放清單」文字下方的空白處點擊右鍵，然後點擊「建立新播放清單」。
※另一個「建立智慧播放清單」在 v1.0.0-beta1 中無法使用。
若要編輯播放清單名稱，請右鍵點擊左側欲變更的播放清單名稱，然後點擊「編輯播放清單名稱」。
若要刪除播放清單，請右鍵點擊左側欲刪除的播放清單名稱，然後點擊「從媒體庫中刪除」。
※刪除播放清單不會影響已註冊的歌曲檔案。
若要編輯播放清單中的歌曲列表，請右鍵點擊左側欲變更的播放清單名稱，並點擊「編輯歌曲」。開啟「播放音樂」畫面後第一次點擊此處時，會開始載入歌曲列表。載入完成後會顯示歌曲列表，請勾選欲加入播放清單的歌曲。
此畫面有多種選取方式。勾選一首歌曲後，按住 Shift 鍵並點擊另一首歌曲，則從第一首勾選的歌曲到 Shift 點擊的歌曲之間的所有歌曲都會被勾選。
※若因後述的篩選或排序導致僅顯示部分歌曲，則僅會勾選目前顯示的歌曲。
點擊欄位名稱可依該欄位排序。再次點擊則反向排序。
在搜尋框中輸入文字，可以篩選出 mp3tag 中包含該字串的歌曲。（歌曲越多處理時間越長）
透過滑鼠點擊並移動游標也可以進行勾選（不會自動捲動）。
要完成播放清單的歌曲列表設定，請點擊右下角的「設定」。
在原本的畫面中，點擊播放按鈕即可播放該清單的歌曲。點擊隨機播放按鈕則為隨機播放。

## 內部系統
受限於 Python 的 eel 函式庫和網頁 UI 的限制，若不使用 tkinter 則無法參照檔案路徑。即使能參照檔案路徑，JS 也無法直接播放，因此採用複製歌曲的方式。
將檔案加入媒體庫後，歌曲檔案會以 `<隨機字串>.mp3` 儲存在 `library/music` 中。儲存時也會設定 mp3tag。此外，原有的 mp3tag 會被刪除。
若也新增了專輯封面，圖片檔案會以 `<隨機字串>.png` 儲存在 `library/images` 中。（也可能儲存為 jpg。若非 png 可能會發生錯誤）
專輯封面的隨機字串與歌曲檔案的隨機字串是相同的。
從資料庫管理中刪除歌曲資料時，是實際刪除而非邏輯刪除，`library/music` 或 `library/images` 中關聯的檔案將被刪除。
同時，也會解除在 `userfiles/music.json` 中的關聯。
`userfiles/music.json` 具有將隨機字串檔名與曲名、演出者等歌曲資訊關聯的功能，若此檔案被刪除或歌曲關聯解除，則不會顯示在資料庫管理畫面中。
反之，若刪除歌曲檔案或專輯封面卻保留 `music.json`，播放時會發生錯誤。由於編輯標題、演出者時也會寫入 mp3tag，屆時也會發生錯誤。
播放清單列表由 `userfiles/playlist.json` 管理。其中儲存了歌曲檔案路徑（相對路徑）、播放清單名稱、排序基準等。

## 未來預計開發功能
歌詞顯示
智慧播放清單
多語言支援？
更改播放清單內的歌曲排序
匯入支援 CSV 格式
在「播放音樂」畫面預載歌曲列表

-- 這是由 Gemini 3 Flash Preview 翻譯 --

***

# 한국어
## 이 앱에 대하여
이 앱은 MusicManager라는 Windows OS 전용 앱입니다. v1.0.0-beta1에서는 포터블 버전만 지원하며, zip 파일을 압축 해제한 후 바로 사용할 수 있습니다.
앱 내용에 대해서는 YouTube 등의 플랫폼에서 다운로드하거나 직접 구한 음악을 관리할 수 있는 앱입니다.
대부분 오프라인으로 이용 가능합니다. (일부 온라인이 필요한 기능 탑재 예정)
앱 개발에는 Gemini 3 Pro Preview를 이용하고 있습니다.

## 바로 사용하고 싶다면 여기를 읽어주세요! (앱 실행 방법, 사용법)
zip 파일을 압축 해제하고 폴더 안의 MusicManager.exe를 실행합니다. 브라우저가 실행됩니다.
'곡 추가'에서는 MusicManager에 곡을 등록합니다. 곡 제목, 아티스트, 앨범 등을 설정할 수 있습니다. 정보를 입력하고 음악 파일을 업로드한 후 '라이브러리에 추가'를 클릭합니다.
여기서 추가한 곡은 '데이터베이스 관리' 화면에 표시됩니다. 셀을 더블 클릭하여 편집할 수 있습니다. 미리 듣기도 가능하며 삭제도 여기서 할 수 있습니다.
음악을 재생 목록에 등록하여 즐기려면 '음악 재생'을 클릭합니다.
화면을 열면 기존 재생 목록이 로드되지만, 초기 상태에서는 아무것도 등록되어 있지 않습니다.
'재생 목록'이라는 글자 아래의 빈 공간을 우클릭하면 '새 재생 목록 생성' 항목이 나타납니다. 이를 클릭하여 재생 목록을 만듭니다.
재생 목록에 곡을 추가하려면 왼쪽의 추가하고 싶은 재생 목록 이름을 우클릭합니다. '곡 편집'을 클릭합니다.
여기서 등록된 곡 목록이 표시되므로 재생 목록에 추가하고 싶은 곡에 체크를 하고 우측 하단의 '설정'을 클릭합니다.
제목, 아티스트, 앨범 등 컬럼을 클릭하여 정렬할 수 있는 등 이 화면에는 다양한 기능이 있습니다. 자세한 내용은 하단의 전체 기능 설명을 확인해 주세요.
그 후 재생 목록 중 하나를 클릭하여 오른쪽에 표시된 재생 버튼이나 셔플 버튼을 눌러보세요. 재생 목록을 재생할 수 있습니다.

## 파일 구성과 실행까지
v1.0.0-beta1의 경우, 다운로드한 zip 파일을 Freesoft 등의 폴더 내에서 압축 해제합니다.
(7-zip을 사용하시는 경우 '여기에 압축 풀기'가 아닌 '압축 풀기'를 권장합니다. Freesoft 등의 폴더 내에서 압축을 푸는 이유는 향후 이용 방법을 읽어보시면 알 수 있습니다.)
압축을 풀면 app 폴더와 MusicManager.exe가 있습니다. app 폴더는 절대로 삭제하지 마십시오. 다시 다운로드하는 것 외에는 복구할 방법이 없습니다.
또한 app 폴더와 MusicManager.exe의 디렉터리 구조를 변경하지 마십시오. (app 폴더와 MusicManager.exe를 묶어서 이동하는 것은 괜찮습니다.)
MusicManager.exe가 본체이며, app 폴더는 MusicManager.exe의 UI를 구성하는 것입니다.
MusicManager.exe를 실행하면 library 폴더와 userfiles 폴더가 생성됩니다.
library 폴더에는 images 폴더, music 폴더가 생성됩니다.
userfiles 폴더에는 settings.ini(앱 내 설정 저장)가 생성됩니다.
기본적으로 library 폴더나 userfiles 폴더는 직접 수정하지 않는 것을 권장합니다.
app 폴더에는 html, css, js 파일이 다수 저장되어 있으므로 직접 디자인을 변경하는 것도 가능합니다.

## 전체 기능 설명
### 곡 추가
'곡 추가'에서는 MusicManager에 곡을 등록합니다. 곡 제목, 아티스트, 앨범, 장르, 트랙 번호, 앨범 아트를 설정할 수 있습니다. 정보를 입력하고 음악 파일을 업로드한 후 '라이브러리에 추가'를 클릭합니다.
### 데이터베이스 관리
'데이터베이스 관리'에서는 등록된 모든 곡이 표시됩니다. 페이지별로 나뉘어 있습니다. 초기 상태에서는 페이지당 50곡씩 표시되지만 이는 설정에서 변경 가능합니다. 또한 모두 표시할 수도 있습니다. (500곡 정도를 기준으로 무거워지기 시작합니다.)
### 내보내기
'내보내기'에서는 음악 파일, 앨범 아트, 데이터베이스, 설정 파일, 재생 목록 및 재생 이력을 출력할 수 있습니다. 파일 구성을 그대로 이어받을 수 있으므로 호환되는 버전인 경우, 내보낸 zip 파일을 압축 해제하여 폴더와 파일을 모두 MusicManager.exe와 동일한 경로에 설치하면 데이터를 이어받을 수 있습니다. 그대로 이어받을 수 있는지 여부나 그렇지 못한 경우의 대처법은 릴리스 노트를 확인해 주세요.
또한 내보내기 기능에서는 저장 위치와 파일명을 지정할 수 있습니다. 내보내기 완료 후 어디에 저장되었는지 재확인할 수 있습니다. 단, 이 화면을 닫으면 어디에 저장했는지는 다시 표시되지 않습니다.
음악 데이터는 저작권과 관련이 있으며 재생 이력이나 듣고 있는 곡, 재생 목록 등은 개인 정보 유출의 우려가 있습니다. 따라서 내보내기 시 비밀번호 보호를 설정할 수 있습니다. 비밀번호 보호를 설정하면 내보낸 zip 파일이 비밀번호가 걸린 zip 파일이 됩니다.
단, 내보내기 기능에서 곡 항목을 활성화하고 곡 파일 수가 많을 경우 내보내기에 상당한 시간이 소요됩니다. 미리 양해 부탁드립니다.
### 가져오기
'가져오기'에서는 규정된 형식으로 작성된 곡 목록 json 파일을 읽어들여 곡 복사, 앨범 아트 복사, mp3tag 설정, 데이터베이스 등록을 모두 자동으로 수행합니다. 이미 다른 음악 관리 앱을 사용 중이시라면 이 기능이 더 편리할 수 있습니다. json 파일의 형식은 언어별 설명 마지막(Readme 맨 마지막)을 확인해 주세요. (import.json)
※ v1.0.0-beta1에서는 csv 형식 가져오기를 지원하지 않습니다. 양해 부탁드립니다.
### 음악 재생
'음악 재생'에서는 재생 목록을 만들어 데이터베이스에 등록한 곡을 재생할 수 있습니다. 재생 목록 생성은 왼쪽 '재생 목록' 글자 아래의 빈 공간을 우클릭하고 '새 재생 목록 생성'을 클릭합니다.
※ 또 다른 메뉴인 '스마트 재생 목록 생성'은 v1.0.0-beta1에서 사용할 수 없습니다.
재생 목록 이름을 편집하려면 왼쪽의 변경하고 싶은 재생 목록 이름을 우클릭하고 '재생 목록 이름 편집'을 클릭합니다.
재생 목록을 삭제하려면 왼쪽의 삭제하고 싶은 재생 목록 이름을 우클릭하고 '라이브러리에서 삭제'를 클릭합니다.
※ 재생 목록 삭제는 등록된 곡 데이터에 영향을 주지 않습니다.
재생 목록에 등록된 곡 목록을 편집하려면 왼쪽의 변경하고 싶은 재생 목록 이름을 우클릭하고 '곡 편집'을 클릭합니다. '음악 재생' 화면을 연 후 처음으로 여기를 클릭하면 곡 목록 로딩이 발생합니다. 로딩이 완료되면 곡 목록이 표시되므로 재생 목록에 추가하고 싶은 곡을 체크합니다.
이 화면에는 다양한 선택 방법이 있습니다. 한 곡을 체크한 후 Shift를 누른 상태에서 다른 곡을 클릭하면 첫 번째 체크한 곡부터 Shift 클릭한 곡까지 모두 체크됩니다.
※ 후술할 필터나 정렬로 일부 곡만 표시된 경우, 표시된 곡 내에서 체크가 적용됩니다.
컬럼명을 클릭하면 해당 컬럼으로 정렬됩니다. 다시 클릭하면 역순으로 정렬됩니다.
검색창에 문자를 입력하면 해당 문자열을 mp3tag에 포함하고 있는 곡만 필터링됩니다. (곡이 많을수록 처리에 시간이 걸립니다.)
마우스로 클릭하면서 커서를 이동하면 체크할 수 있습니다. (자동 스크롤은 되지 않습니다.)
재생 목록의 곡 목록 설정을 완료하려면 우측 하단의 '설정'을 클릭합니다.
원래 화면에서 재생 목록의 곡 목록을 재생하려면 재생 버튼을 클릭합니다. 셔플 재생은 셔플 버튼을 클릭합니다.

## 내부 시스템
Python의 eel 라이브러리와 웹 UI의 제한상 tkinter를 이용하지 않으면 파일 경로를 참조할 수 없으며, 가령 파일 경로를 참조할 수 있다고 해도 JS에서 곡을 재생할 수 없으므로 곡을 복사하고 있습니다.
파일을 라이브러리에 추가한 시점에 음악 파일은 `library/music`에 `<랜덤 문자열>.mp3`로 저장됩니다. 저장 시 mp3tag도 설정됩니다. 또한 기존 mp3tag는 삭제됩니다.
앨범 아트도 추가한 경우 이미지 파일은 `library/images`에 `<랜덤 문자열>.png`로 저장됩니다. (jpg로 저장될 가능성도 있습니다. png가 아니면 에러가 발생할 가능성이 있습니다.)
앨범 아트의 랜덤 문자열과 음악 파일의 랜덤 문자열은 동일합니다.
데이터베이스 관리에서 곡 데이터를 삭제하면 논리 삭제가 아닌 실제 삭제가 이루어지며, `library/music`이나 `library/images`에서 연결된 파일이 삭제됩니다.
또한 `userfiles/music.json`에서도 연결이 해제됩니다.
`userfiles/music.json`은 곡을 추가할 때마다 랜덤 문자열 파일명과 곡 제목, 아티스트 등의 정보를 연결하는 기능이 있으며, 이 파일이 삭제되거나 연결이 해제되면 데이터베이스 관리 화면에 표시되지 않게 됩니다.
반대로 음악 파일이나 앨범 아트를 삭제하고 `music.json`을 남겨두면 재생 시 에러가 발생합니다. 제목, 아티스트 편집 시에도 mp3tag를 쓰기 때문에 그 시점에도 에러가 발생합니다.
재생 목록 일람은 `userfiles/playlist.json`에서 관리합니다. 음악 파일 경로(상대 경로)와 재생 목록 이름, 정렬 기준 등이 저장됩니다.

## 향후 개발 예정 기능
가사 표시
스마트 재생 목록
다국어 지원?
재생 목록 내 곡 순서 변경
가져오기 CSV 지원
'음악 재생' 화면에서 곡 목록 프리로드

-- Gemini 3 Flash Preview에 의해 번역되었습니다 --

***

# 中文
## 关于此应用
这是一款名为 MusicManager 的 Windows OS 专用应用。在 v1.0.0-beta1 版本中，仅支持便携版，解压 zip 文件后即可立即使用。
关于应用内容，这是一款可以管理您自行获取（例如从 YouTube 等平台下载）的音乐的应用。
大部分功能可以离线使用（预计未来将加入部分需要联网的功能）。
本应用开发使用了 Gemini 3 Pro Preview。

## 想立即使用请阅读此处！（应用启动方法、使用方式）
解压 zip 文件，并执行其中的 MusicManager.exe。浏览器将会打开。
在“添加歌曲”中，可以将歌曲注册到 MusicManager。可以设置曲名、艺术家、专辑等。输入信息并上传音乐文件后，点击“添加到媒体库”。
在此添加的歌曲将显示在“管理数据库”屏幕中。您可以双击单元格进行编辑。也可以进行试听或在此删除。
若要将音乐注册到播放列表并享受音乐，请点击“播放音乐”。
打开屏幕时会加载现有的播放列表，但在初始状态下尚未注册任何内容。
在“播放列表”文字下方的空白区域右键点击，会显示“新建播放列表”项目。点击此项即可创建播放列表。
若要向播放列表添加歌曲，请右键点击左侧想要添加的播放列表名称，然后点击“编辑歌曲”。
此处会显示已注册的歌曲列表，勾选想要添加到播放列表的歌曲，然后点击右下角的“设置”。
此屏幕具有多种功能，例如点击标题、艺术家、专辑等列名进行排序。详情请参阅下方的“全功能说明”。
接着点击任一播放列表，并按下右侧显示的播放按钮或随机播放按钮。即可开始播放播放列表。

## 文件结构与启动
在 v1.0.0-beta1 的情况下，请将下载的 zip 文件解压到“Freesoft”等文件夹中。
（如果您使用 7-zip，建议选择“解压”而非“解压到当前文件夹”。关于在 Freesoft 等文件夹中解压的原因，阅读之后的使用说明即可明白。）
解压后会有 app 文件夹和 MusicManager.exe。请绝对不要删除 app 文件夹。除了重新下载之外，没有其他恢复方法。
此外，请勿更改 app 文件夹与 MusicManager.exe 的目录结构（若将 app 文件夹与 MusicManager.exe 整体移动则没问题）。
MusicManager.exe 是主程序，app 文件夹则用于构成 MusicManager.exe 的 UI 用户界面。
执行 MusicManager.exe 后，会生成 library 文件夹和 userfiles 文件夹。
library 文件夹中会生成 images 文件夹和 music 文件夹。
userfiles 文件夹中会生成 settings.ini（保存应用内设置）。
基本上建议不要手动变动 library 文件夹或 userfiles 文件夹。
app 文件夹中存放了许多 html、css、js 文件，因此您也可以自行更改设计。

## 全功能说明
### 添加歌曲
在“添加歌曲”中将歌曲注册到 MusicManager。可以设置曲名、艺术家、专辑、流派、曲目编号、专辑封面。输入信息并上传音乐文件后，点击“添加到媒体库”。
### 管理数据库
“管理数据库”中会显示所有已注册的歌曲。采用分页显示。初始状态下每页显示 50 首歌，这可以在设置中更改。此外也可以选择显示全部（超过 500 首歌左右会开始变得缓慢）。
### 导出
“导出”功能可以输出音乐文件、专辑封面、数据库、配置文件、播放列表及播放记录。由于可以原样继承文件结构，因此若是兼容版本，只需解压导出的 zip 文件，并将其中的文件夹和文件全部放置在与 MusicManager.exe 同一级别目录下，即可完成迁移。关于是否可以直接迁移或无法直接迁移时的对策，请查看版本说明（ReleaseNote）。
此外，导出功能可以指定保存位置和文件名。导出完成后，可以再次确认保存位置。但请注意，一旦关闭此屏幕，保存位置将不再显示。
音乐数据涉及版权，而播放记录、正在听的歌曲、播放列表等可能涉及个人隐私泄露。因此，导出功能可以设置密码保护。设置密码保护后，导出的 zip 文件将成为加密 zip 包。
不过请注意，如果在导出功能中勾选歌曲项目且歌曲数量较多时，导出将花费相当长的时间。
### 导入
“导入”功能可通过读取特定格式编写的歌曲列表 JSON 文件，自动执行歌曲复制、专辑封面复制、mp3tag 设置及数据库注册。如果您已经在使用其他歌曲管理应用，此功能可能会更方便。JSON 文件的格式请参阅语言说明最后方（Readme 的最末尾）(import.json)。
※v1.0.0-beta1 不支持 CSV 格式导入。敬请谅解。
### 播放音乐
“播放音乐”可以创建播放列表并播放注册到数据库中的歌曲。创建播放列表的方法是在左侧“播放列表”文字下方的空白处右键点击，然后点击“新建播放列表”。
※另一个“创建智能播放列表”在 v1.0.0-beta1 中无法使用。
若要编辑播放列表名称，请右键点击左侧欲变更的播放列表名称，然后点击“编辑播放列表名称”。
若要删除播放列表，请右键点击左侧欲删除的播放列表名称，然后点击“从媒体库中删除”。
※删除播放列表不会影响已注册的歌曲文件。
若要编辑播放列表中的歌曲列表，请右键点击左侧欲变更的播放列表名称，并点击“编辑歌曲”。打开“播放音乐”屏幕后第一次点击此处时，会开始加载歌曲列表。加载完成后会显示歌曲列表，请勾选欲添加到播放列表的歌曲。
此屏幕有多种选择方式。勾选一首歌曲后，按住 Shift 键并点击另一首歌曲，则从第一首勾选的歌曲到 Shift 点击的歌曲之间的所有歌曲都会被勾选。
※若因后述的筛选或排序导致仅显示部分歌曲，则仅会勾选当前显示的歌曲。
点击列名可按该列排序。再次点击则反向排序。
在搜索框中输入文字，可以筛选出 mp3tag 中包含该字符串的歌曲。（歌曲越多处理时间越长）
通过鼠标点击并移动光标也可以进行勾选（不会自动滚动）。
要完成播放列表的歌曲列表设置，请点击右下角的“设置”。
在原本的屏幕中，点击播放按钮即可播放该列表的歌曲。点击随机播放按钮则为随机播放。

## 内部系统
受限于 Python 的 eel 库和网页 UI 的限制，若不使用 tkinter 则无法参照文件路径。即使能参照文件路径，JS 也无法直接播放，因此采用复制歌曲的方式。
将文件添加到媒体库后，音乐文件会以 `<随机字符串>.mp3` 存储在 `library/music` 中。存储时也会设置 mp3tag。此外，原有的 mp3tag 会被删除。
若也添加了专辑封面，图片文件会以 `<随机字符串>.png` 存储在 `library/images` 中。（也可能存储为 jpg。若非 png 可能会发生错误）
专辑封面的随机字符串与音乐文件的随机字符串是相同的。
从数据库管理中删除歌曲数据时，是实际删除而非逻辑删除，`library/music` 或 `library/images` 中关联的文件将被删除。
同时，也会解除在 `userfiles/music.json` 中的关联。
`userfiles/music.json` 具有将随机字符串文件名与曲名、艺术家等歌曲信息关联的功能，若此文件被删除或歌曲关联解除，则不会显示在数据库管理屏幕中。
反之，若删除音乐文件或专辑封面却保留 `music.json`，播放时会发生错误。由于编辑标题、艺术家时也会写入 mp3tag，届时也会发生错误。
播放列表一览由 `userfiles/playlist.json` 管理。其中存储了音乐文件路径（相对路径）、播放列表名称、排序基准等。

## 未来预计开发功能
歌词显示
智能播放列表
多语言支持？
更改播放列表内的歌曲排序
导入支持 CSV 格式
在“播放音乐”屏幕预加载歌曲列表

-- 由 Gemini 3 Flash Preview 翻译 --

# Codes
import.json
``` json
[
    {
        "title": "MusicTitle1",
        "artist": "Artist1",
        "album": "album1",
        "track": "1",
        "genre": "genre1",
        "musicFilename": "C:/Full/path/to/your/music1.mp3",
        "imageFilename": "C:/Full/path/to/your/album/art1.png"
    },
    {
        "title": "MusicTitle2",
        "artist": "Artist2",
        "album": "album2",
        "track": "2",
        "genre": "genre2",
        "musicFilename": "C:/Full/path/to/your/music2.mp3",
        "imageFilename": "C:/Full/path/to/your/album/art2.png"
    },
]
```
