# 日本語 - Windows版
## 注意事項
Readmeには最新盤の情報を記述しております。アップデートにはそれぞれのリリースノートをご確認ください。
互換性情報はこのReadmeのそれぞれの言語の最後に記述しておりますが、具体的な引継ぎ方法はそれぞれのリリースノートをご確認ください。
原則として2つ以上のバージョンアップの場合、データの引継ぎはできません。ご注意ください。
また、iOS版の場合、楽曲・プレイリストデータは引き継げません。ご了承ください。（再度PC版から引き継ぐようにお願いします。）

## このアプリについて
これはMusicManagerというWindowsOS専用のアプリです。iOS版の説明はWindows版の説明の下をご覧ください。
現在、ポータブル版のみ対応しており、zipを展開してすぐに利用可能です。
アプリ内容についてですが、YouTubeなどのプラットフォームからダウンロードしたりしてご自身で入手された音楽を管理できるアプリとなっております。
おおよそオフラインでご利用いただけます。（iPhoneへ楽曲を同期する際にはWi-Fiが必要となります）
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
### iPhoneへ同期
下記で説明している通りiOS版も対応しております。（AppStoreの配布ではございません。ipaファイルの配布となります。インストール方法にご注意ください。）
iPhoneに楽曲・プレイリストを同期することができ、Wi-Fi下で同期が完了し次第、オフラインで再生可能となります。また、バックグラウンド再生にも対応しております。

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
- 歌詞表示
- スマートプレイリスト
- プレイリストの楽曲並び順変更
- インポートのcsv対応
- 「音楽を再生」の画面で楽曲リストをプリロード

# 日本語 - iOS版
## このアプリについて
これはMusic Manager iOS版というiPhone専用アプリです。（iPadOSの動作確認は致しておりません。また、動作確認を行ったiPhoneはiPhoneSE第3世代, iOS26.2以降です）
v1.0.0-beta2では刷新されたデザインとともにWindows版と同様、プレイリストの楽曲を再生することができます。
アプリ開発にはGemini 3 Pro Previewを利用しております。

## すぐ使いたいならここ読んで！（アプリの起動方法、使い方）
iPhoneに当アプリをインストールするにはMacBookまたはSideloadlyがインストールされたWindowsPCが必要となります。また、USBケーブルによるインストールとなるため、iPhoneとパソコンを接続できるUSBケーブルをご用意ください。
（ここれはWindows版のみ説明しております。MacBook版はご自身でご確認ください。）
iOS 26.2以降が対象です。iPadOSでは動作確認しておりません。
iPhoneにipaファイルでアプリをインストールする方法は下記動画をご覧ください。
YouTube - Sideload IPA with Sideloadly Wireless: Windows Guide (2025)
※一部の国や地域では動作しない恐れがございます。予めご了承ください。
アプリインストール後、アプリを起動し、同期タブを開きます。このとき、Windows版MusicManagerを同じWi-Fi下で起動します。
（この際Windows版MusicManagerは正常に起動していれば度の画面を開いていても構いません。のちに入力するIP Addressがわかれば問題ありません。）
Windows版MusicManagerにてホーム画面の「iPhoneへ同期」のボタンをクリックします。（v1.0.0-beta2_Windows_Portableより搭載）
するとIP Addressという欄に表示されている「xxx.xxx.xx.xx」の形式の文字列を「.」も含めて、iOS版MusicManagerの同期画面の一番上の入力欄に入力します。（xは文字を表しますが、文字数が表示されている通りとは限りません。）
iOS版で「PCを探す」をタップします。この際、ローカルネットワーク上のデバイスを見つけようとしている警告が表示された場合は許可をタップしてください。2回ほどポップアップでエラーが発生しますので、もう一度「PCを探す」をタップしてください。
するとWindows版MusicManagerのプレイリストデータが読み込まれ、iOS版にはプレイリスト一覧が表示されます。
同期したいプレイリストにチェックを入れ、「選択したプレイリストを同期」または「楽曲をすべて同期」のボタンをタップします。選択したプレイリストはiOS版のプレイリスト一覧として表示されます。
「選択したプレイリストを同期」をタップした場合、選択したプレイリストに含まれている楽曲のみをiPhoneにダウンロードします。
「楽曲をすべて同期」をタップした場合、選択したプレイリストにかかわらず、Windows版MusicManagerに登録されているすべての楽曲をiPhoneにダウンロードしますが、プレイリスト一覧にはチェックを入れたプレイリストのみが表示され、ダウンロードした楽曲一覧も再生することができます。
同期が完了するまで画面を変更しないことを推奨しております。
同期が完了するとポップアップが表示されますのでOKをタップしましょう。これにて、楽曲の同期は完了です。Wi-Fiやモバイルデータ通信を切っても動作しますし、Windows版MusicManagerもこのタイミングで終了していただいて構いません。
再生タブをタップすればプレイリスト一覧が表示されます。どれかタップして、再生やシャッフルのボタンをタップしてみましょう。あなたの登録した楽曲をiPhoneでも再生することができます。

## 全機能説明
### 同期
Windows版MusicManagerからiOS版MusicManagerに楽曲とプレイリストを同期することができます。
ローカルIPアドレスによる接続のため、同Wi-Fi下である必要があります。
無線のため同期速度は頗る遅いです。（改善予定ですが技術がありません）
### 再生
プレイリスト一覧が表示されます。一番上にはすべての楽曲というプレイリスト（？）が表示されます。
すべての楽曲というのは同期の際に「楽曲をすべて同期」のボタンをタップした際にプレイリストにない楽曲を再生するためのものです。
プレイリストには再生とシャッフルというボタンがありますが、Windows版と変わりません。詳細はWindows版の 全機能説明＞音楽を再生 をご確認ください。
再生を開始すると、タブバーの上にミニプレイヤーが表示されます。アルバムアート、タイトル、アーティスト、簡易再生コントローラーが表示されています。
ミニプレイヤーの簡易再生コントローラー以外をタップするとフルスクリーンプレイヤーの画面が開きます。
フルスクリーンプレイヤーの画面ではタイトル、アーティスト、再生バー、再生コントローラー、歌詞表示、キュー表示が可能となっております。（歌詞表示はv1.0.0-beta2_iOSでは対応していません。）
キュー表示をタップすると、次に再生される曲を確認することができます。（タップしてもその曲には進みません）
この画面でシャッフル・ループ再生のトグルを変更することができます。この仕様もWindows版と同様です。
もう一度キューのボタンをタップすることで元のアルバムアートの画面に戻ることができます。
楽曲再生中はこのアプリ内のどの画面を開いてもミニプレイヤーが常に表示されています。
### 設定
テーマカラーを現在は設定できます。
一番右下の色をタップすると色をカスタム設定できます。また、あなたが設定した色は最近使用した５色までアプリが覚えてくれます。
### 情報
ライセンス表記とバージョン表記となります。万が一、ダウンロードしたバージョンとこの表記が違う場合は、お問い合わせください。

## 内部システム
同期についてですが、Windows版MusicManagerを輝度すると自動的にFlaskサーバーが起動するので、それにローカルIPアドレスにより接続し、楽曲を同期しています。また、Windows版MusicManagerを終了するとFlaskサーバーも終了してしまうため、起動しておかないと、同期することはできません。

## 今後の開発予定
- 歌詞表示
- スマートプレイリスト
- プレイリストの楽曲並び順変更
- 楽曲 / プレイリスト削除機能
- iPhoneからWindowsへの楽曲同期 (!?)

-- これは原文です --

# English - Windows Version
## Important Notes
The Readme contains information for the latest version. Please check the respective release notes for update details.
Compatibility information is provided at the end of each language section in this Readme. However, for specific data migration methods, please refer to the respective release notes.
As a general rule, data migration is not supported when skipping two or more versions. Please be careful.
Additionally, for the iOS version, music and playlist data cannot be migrated between versions. Please re-sync from the PC version.

## About This App
This is a Windows-exclusive application called "MusicManager." For the iOS version description, please see the section below the Windows description.
Currently, only the portable version is supported; it is ready to use immediately after extracting the zip file.
This app allows you to manage music you have obtained yourself, such as by downloading from platforms like YouTube.
Most features are available offline (Wi-Fi is required only when synchronizing songs to an iPhone).
Gemini 1.5 Pro Preview was utilized in the development of this app.

## Quick Start (How to Launch and Use)
1. Extract the zip file and run `MusicManager.exe`. Your browser will open the interface.
2. **Add Songs:** Register songs to MusicManager. You can set the song title, artist, album, etc. After entering the information and uploading the music file, click "Add to Library."
3. **Manage Database:** Songs added will appear here. You can edit entries by double-clicking a cell, listen to previews, or delete songs.
4. **Play Music:** Click "Play Music" to enjoy your songs via playlists.
   - When the screen opens, existing playlists are loaded (none exist by default).
   - Right-click on the empty area under the word "Playlists" to see "Create New Playlist."
   - To add songs to a playlist, right-click the playlist name on the left and select "Edit Songs."
   - A list of registered songs will appear. Check the songs you want to add and click "Settings" at the bottom right.
   - You can sort by Title, Artist, or Album by clicking the column headers. For more details, see the "Full Feature Description" below.
5. Click on a playlist and press the Play or Shuffle buttons on the right to start listening.

## File Structure and Setup
For v1.0.0-beta1, extract the downloaded zip file into a folder (e.g., a "Freesoft" folder).
*(If using 7-zip, we recommend "Extract" rather than "Extract Here." The reason for using a dedicated folder will become clear in the "Future Usage" section.)*

Upon extraction, you will see an `app` folder and `MusicManager.exe`. **Never delete the `app` folder.** There is no way to restore it other than re-downloading.
Do not change the directory structure of the `app` folder and `MusicManager.exe` (though you may move them together as a unit).
`MusicManager.exe` is the main executable, and the `app` folder contains the UI components.

When you run `MusicManager.exe`, the following are generated:
- `library` folder (contains `images` and `music` folders).
- `userfiles` folder (contains `settings.ini` for app settings).

We generally recommend not modifying the `library` or `userfiles` folders manually.
The `app` folder contains many HTML, CSS, and JS files, so you can customize the design if you have the technical knowledge.

## Full Feature Description
### Add Songs
Register songs by setting the Title, Artist, Album, Genre, Track Number, and Album Art. Click "Add to Library" after uploading the file.
### Manage Database
Displays all registered songs with pagination. By default, 50 songs are shown per page (configurable in settings). You can also choose "Show All" (performance may degrade around 500+ songs).
### Export
Export music files, album art, the database, settings, playlists, and playback history. For compatible versions, you can migrate your data by extracting the exported zip and placing all folders/files in the same directory as `MusicManager.exe`. Check the Release Notes for specific compatibility details.
You can specify the save location and filename. After completion, the path will be displayed. **Warning:** This path is only displayed once; if you close the screen, you won't see it again.
Since music data involves copyright and playback history is personal information, exports can be password-protected (creating a password-protected zip). 
*Note: Exporting a large number of music files may take considerable time.*
### Import
Automatically copy songs, copy album art, set MP3 tags, and register to the database by reading a JSON file in a specific format. This is useful if you are moving from another management app. See the format details (import.json) at the very end of this Readme.
*Note: v1.0.0-beta1 does not support CSV import.*
### Play Music
Create playlists and play registered songs. 
- Right-click the empty space under "Playlists" to "Create New Playlist."
- *Note: "Create Smart Playlist" is unavailable in v1.0.0-beta1.*
- Right-click a playlist to "Edit Playlist Name" or "Delete from Library." (Deleting a playlist does not delete the actual song files).
- To manage songs in a playlist, right-click the playlist and select "Edit Songs." The song list loads on the first click.
- **Selection Features:** 
  - Use `Shift + Click` to select a range of songs.
  - Sorting: Click column names to sort or reverse sort.
  - Filtering: Use the search box to filter by MP3 tags.
  - Click and drag to check multiple boxes (does not auto-scroll).
- Click "Settings" at the bottom right to save changes.
### Sync to iPhone
Supports an iOS version (distributed as an `.ipa` file, not via the App Store). Songs and playlists can be synced over Wi-Fi for offline and background playback.

## Internal System
Due to the limitations of Python's Eel library and Web UI, `tkinter` is used for file path referencing. To ensure JS can play the music, files are copied upon addition.
Songs are saved in `library/music` as `<random_string>.mp3`. MP3 tags are overwritten during this process.
Album art is saved in `library/images` as `<random_string>.png`. (Using PNG is recommended to avoid errors).
The random string for the music file and its corresponding album art are identical.
Deleting a song from "Manage Database" performs a **physical deletion**, removing files from `library/music` and `library/images`, and unlinking them from `userfiles/music.json`.
If you manually delete files but leave `music.json` intact, errors will occur during playback or tag editing.
Playlists are managed in `userfiles/playlist.json`, storing relative paths, playlist names, and sort criteria.

## Future Roadmap
- Lyrics display
- Smart Playlists
- Change song order within playlists
- CSV support for Import
- Pre-loading song lists in the "Play Music" screen

# English - iOS Version
## About This App
This is the iPhone-exclusive "Music Manager iOS" app. (Functionality on iPadOS is not confirmed. Tested on iPhone SE 3rd Gen, iOS 16.2+).
v1.0.0-beta2 features a refreshed design and allows playlist playback similar to the Windows version.
Gemini 1.5 Pro Preview was utilized in the development of this app.

## Quick Start (How to Launch and Use)
To install this on an iPhone, you need a MacBook or a Windows PC with **Sideloadly** installed. A USB cable is required for installation.
Requires iOS 16.2 or later.
Please refer to YouTube guides such as *"Sideload IPA with Sideloadly Wireless: Windows Guide (2025)"* for installation instructions.
*Note: May not function in some countries or regions.*

1. After installation, open the app and go to the **Sync** tab.
2. Launch MusicManager on your Windows PC (connected to the same Wi-Fi). It doesn't matter which screen is open on the PC, as long as it's running.
3. On the Windows app, click "Sync to iPhone" on the home screen (available from v1.0.0-beta2).
4. An **IP Address** (e.g., `xxx.xxx.xx.xx`) will be displayed. Enter this exactly (including dots) into the top input field on the iOS app's Sync screen.
5. Tap "Find PC" on iOS. If a local network permission prompt appears, tap "Allow." If an error occurs, tap "Find PC" again.
6. Once connected, your Windows playlists will appear. Check the playlists you want to sync.
   - **Sync Selected Playlists:** Only downloads songs included in those playlists.
   - **Sync All Songs:** Downloads every song registered on the PC, but only shows the selected playlists in the playlist view.
7. Do not leave the screen until the sync is complete. Tap "OK" on the popup when finished.
8. You can now close the Windows app and disconnect from Wi-Fi. Go to the **Play** tab to see your playlists and start listening.

## Full Feature Description
### Sync
Sync songs and playlists from Windows to iOS via local IP. Both devices must be on the same Wi-Fi. Note: Sync speeds are currently slow.
### Play
- Displays a list of playlists. The "All Songs" playlist at the top allows you to play everything downloaded.
- Features Play and Shuffle buttons.
- **Mini Player:** Appears above the tab bar during playback, showing album art, title, artist, and basic controls.
- **Full-Screen Player:** Tap the mini player to expand. Includes Title, Artist, progress bar, playback controls, lyrics (not supported in v1.0.0-beta2), and the Queue.
- **Queue:** View the next tracks (tapping doesn't jump to them yet). Toggle Shuffle/Loop here.
### Settings
Configure the theme color. You can set a custom color; the app remembers the last five used colors.
### Info
Displays license and version info. If the displayed version differs from what you downloaded, please contact support.

## Internal System
When MusicManager (Windows) is running, it automatically starts a Flask server. The iOS app connects to this via the local IP to sync data. If the Windows app is closed, the server stops and syncing will fail.

## Future Roadmap
- Lyrics display
- Smart Playlists
- Change song order within playlists
- Song / Playlist deletion feature
- Song sync from iPhone to Windows (!?)

*Translated by Gemini 1.5 Flash Preview*


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
