import io
import os
import sys
import base64
import json
import shutil
import csv
import random
import string
import mimetypes
import configparser
import copy
import eel
import bottle

from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB, TCON, TRCK, APIC, ID3NoHeaderError, TDRC, COMM, TPE2, TPOS, TBPM, TCOM, USLT
import zipfile
try:
    import pyzipper
except ImportError:
    pyzipper = None
import tkinter
import tkinter.filedialog as filedialog
from datetime import datetime

# --- TAG MAP ---
TAG_MAP = {
    'title': {'id3': TIT2, 'label': 'タイトル'},
    'artist': {'id3': TPE1, 'label': 'アーティスト'},
    'album': {'id3': TALB, 'label': 'アルバム'},
    'genre': {'id3': TCON, 'label': 'ジャンル'},
    'track': {'id3': TRCK, 'label': 'トラック'},
    'year': {'id3': TDRC, 'label': '年/日付'},
    'album_artist':{'id3': TPE2, 'label': 'アルバムアーティスト'},
    'disc': {'id3': TPOS, 'label': 'ディスクNo'},
    'bpm': {'id3': TBPM, 'label': 'BPM'},
    'composer': {'id3': TCOM, 'label': '作曲者'},
    'comment': {'id3': COMM, 'label': 'コメント'},
}

# --- main.py の変更箇所 ---

def resource_path(relative_path):
    """
    開発環境(python実行)でも、PyInstaller(exe実行)でも
    実行ファイルの「ある場所」を基準にパスを取得する。
    これにより、exeの隣にあるフォルダ(appやuserfiles)を読み込める。
    """
    if getattr(sys, 'frozen', False):
        # exeとして実行されている場合: exeのあるフォルダパスを取得
        base_path = os.path.dirname(sys.executable)
    else:
        # pythonスクリプトとして実行されている場合
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

LIBRARY_DIR = "library"
MUSIC_DIR = os.path.join(LIBRARY_DIR, "music")
IMAGE_DIR = os.path.join(LIBRARY_DIR, "images")
USERFILES_DIR = "userfiles"
DB_PATH = os.path.join(USERFILES_DIR, "music.json")
PLAYLIST_DB_PATH = os.path.join(USERFILES_DIR, "playlist.json")
SETTINGS_PATH = os.path.join(USERFILES_DIR, "settings.ini")

for directory in [MUSIC_DIR, IMAGE_DIR, USERFILES_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)

def generate_file_id(length=32):
    characters = string.ascii_lowercase + string.digits
    return ''.join(random.choices(characters, k=length))

def load_db():
    if not os.path.exists(DB_PATH):
        return []
    try:
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def save_db(data_list):
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(data_list, f, indent=4, ensure_ascii=False)

def get_duration_str(path):
    duration_str = "--:--"
    if path and os.path.exists(path) and path.lower().endswith('.mp3'):
        try:
            audio = MP3(path)
            length = int(audio.info.length)
            minutes, seconds = divmod(length, 60)
            duration_str = f"{minutes}:{seconds:02d}"
        except:
            pass
    return duration_str

def get_image_base64(path):
    img_b64 = ""
    if path and os.path.exists(path):
        try:
            with open(path, 'rb') as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
                ext = os.path.splitext(path)[1].lower()
                mime = "image/png"
                if ext in ['.jpg', '.jpeg']: 
                    mime = "image/jpeg"
                elif ext == '.gif': 
                    mime = "image/gif"
                img_b64 = f"data:{mime};base64,{encoded}"
        except:
            pass
    return img_b64

def load_settings():
    config = configparser.ConfigParser()
    if os.path.exists(SETTINGS_PATH):
        config.read(SETTINGS_PATH, encoding='utf-8')
    
    if not config.has_section('Database'):
        config.add_section('Database')
    if not config.has_option('Database', 'items_per_page'):
        config.set('Database', 'items_per_page', '50')
    if not config.has_section('Theme'):
        config.add_section('Theme')
    if not config.has_option('Theme', 'primary_color'):
        config.set('Theme', 'primary_color', '#4f46e5')
    if not config.has_section('Tags'):
        config.add_section('Tags')
    if not config.has_option('Tags', 'active_tags'):
        config.set('Tags', 'active_tags', 'title,artist,album,genre,track')
    if not config.has_option('Tags', 'player_visible_tags'):
        config.set('Tags', 'player_visible_tags', 'title,artist,album,track')
    
    with open(SETTINGS_PATH, 'w', encoding='utf-8') as f:
        config.write(f)
    return config

@eel.expose
def get_app_settings():
    config = load_settings()
    return {
        'items_per_page': config.getint('Database', 'items_per_page'),
        'primary_color': config.get('Theme', 'primary_color'),
        'active_tags': config.get('Tags', 'active_tags').split(','),
        'player_visible_tags': config.get('Tags', 'player_visible_tags').split(',')
    }

@eel.expose
def get_available_tags():
    return [{'key': k, 'label': v['label']} for k, v in TAG_MAP.items()]

@eel.expose
def save_app_settings(settings_dict):
    config = load_settings()
    if 'items_per_page' in settings_dict:
        config.set('Database', 'items_per_page', str(settings_dict['items_per_page']))
    if 'primary_color' in settings_dict:
        config.set('Theme', 'primary_color', settings_dict['primary_color'])
    if 'active_tags' in settings_dict:
        config.set('Tags', 'active_tags', ",".join(settings_dict['active_tags']))
    if 'player_visible_tags' in settings_dict:
        config.set('Tags', 'player_visible_tags', ",".join(settings_dict['player_visible_tags']))
    
    with open(SETTINGS_PATH, 'w', encoding='utf-8') as f:
        config.write(f)
    return True

@eel.expose
def set_mp3_tag(notify_progress=False):
    db_data = load_db()
    total = len(db_data)
    
    for i, item in enumerate(db_data):
        if notify_progress:
            title = item.get('title', 'Unknown')
            try:
                eel.js_import_progress(i + 1, total, f"タグ書き込み中: {title}")
                eel.sleep(0.001)
            except:
                pass 

        music_path = item.get('musicFilename')
        if not music_path or not os.path.exists(music_path): 
            continue
        if not music_path.lower().endswith('.mp3'): 
            continue

        try:
            try:
                old_tags = ID3(music_path)
                old_tags.delete()
            except: 
                pass

            audio = MP3(music_path)
            if audio.tags is None:
                audio.add_tags()
            
            for key, tag_def in TAG_MAP.items():
                value = item.get(key)
                if value:
                    frame_cls = tag_def['id3']
                    if frame_cls == COMM:
                        audio.tags.add(COMM(encoding=3, lang='jpn', desc='', text=str(value)))
                    else:
                        audio.tags.add(frame_cls(encoding=3, text=str(value)))

            image_path = item.get('imageFilename')
            if image_path and os.path.exists(image_path):
                mime_type, _ = mimetypes.guess_type(image_path)
                if mime_type is None: 
                    mime_type = 'image/jpeg'
                with open(image_path, 'rb') as img:
                    audio.tags.add(APIC(encoding=3, mime=mime_type, type=3, desc=u'Cover', data=img.read()))
            
            audio.save()
        except:
            pass
    return True

@eel.expose
def get_library_count():
    return len(load_db())

@eel.expose
def get_library_chunk(page, limit, sort_field=None, sort_desc=False, notify_progress=False):
    raw_data = load_db()
    
    if sort_field:
        def sort_key(item):
            val = item.get(sort_field, '')
            if sort_field in ['track', 'disc', 'year', 'bpm']:
                try: return int(val)
                except: return 0
            return str(val).lower()
        
        if sort_field != 'duration':
            raw_data.sort(key=sort_key, reverse=sort_desc)
    
    if limit > 0:
        start = (page - 1) * limit
        end = start + limit
        target_chunk = raw_data[start:end]
    else:
        target_chunk = raw_data

    processed_chunk = []
    total_in_chunk = len(target_chunk)

    for i, item in enumerate(target_chunk):
        # プレイヤー画面でのライブラリ読み込み進捗
        if notify_progress:
            try:
                # Player画面用の進捗関数 (globals.js で定義)
                eel.js_library_progress(i + 1, total_in_chunk)
                
                # Manage画面用にも投げておく (副作用なし)
                eel.js_manage_progress(i + 1, total_in_chunk)
                
                # 少し待機してUI更新させる
                if i % 10 == 0:
                    eel.sleep(0.001)
            except:
                pass

        item['duration'] = get_duration_str(item.get('musicFilename'))
        item['imageData'] = get_image_base64(item.get('imageFilename'))
        processed_chunk.append(item)
        
    return processed_chunk

@eel.expose
def get_library_data_with_meta(notify=False):
    return get_library_chunk(1, 0, notify_progress=notify)

@eel.expose
def get_playlists_with_meta():
    if not os.path.exists(PLAYLIST_DB_PATH):
        return []
    try:
        with open(PLAYLIST_DB_PATH, 'r', encoding='utf-8') as f:
            playlists = json.load(f)
    except:
        return []

    # 全DBロード（高速）
    raw_db = load_db()
    music_map = {}
    for m in raw_db:
        path = m.get('musicFilename', '')
        if path:
            filename = os.path.basename(path)
            music_map[filename] = m

    total_pl = len(playlists)
    result = []
    
    # プレイリストの進捗表示
    try: 
        eel.js_playlist_progress(0, total_pl, "準備中...")
    except: 
        pass

    for i, pl in enumerate(playlists):
        pl_name = pl.get('playlistName', 'Untitled')
        
        try:
            eel.js_playlist_progress(i + 1, total_pl, pl_name)
            eel.sleep(0.001)
        except:
            pass

        songs = []
        for f in pl.get('music', []):
            if f in music_map:
                song_data = music_map[f].copy()
                # 都度生成（高速化のため不要なら削れるが仕様通りBase64化する）
                song_data['duration'] = get_duration_str(song_data.get('musicFilename'))
                song_data['imageData'] = get_image_base64(song_data.get('imageFilename'))
                songs.append(song_data)
        
        result.append({
            "playlistName": pl_name,
            "type": pl.get('type', 'normal'),
            "sortBy": pl.get('sortBy', 'title'),
            "songs": songs
        })
    return result

@eel.expose
def update_playlist_songs(index, song_filenames):
    if not os.path.exists(PLAYLIST_DB_PATH): 
        return False
    try:
        with open(PLAYLIST_DB_PATH, 'r', encoding='utf-8') as f:
            playlists = json.load(f)
        
        if 0 <= index < len(playlists):
            playlists[index]['music'] = song_filenames
            with open(PLAYLIST_DB_PATH, 'w', encoding='utf-8') as f:
                json.dump(playlists, f, indent=4, ensure_ascii=False)
            return True
        return False
    except:
        return False

# ... (Create, Rename, Delete Playlist, Edit Song, Export等 既存の関数) ...
@eel.expose
def create_playlist(name, type="normal"):
    if not os.path.exists(PLAYLIST_DB_PATH): playlists=[]
    else:
        try:
            with open(PLAYLIST_DB_PATH,'r',encoding='utf-8') as f: playlists=json.load(f)
        except: playlists=[]
    new_pl={"playlistName":name,"type":type,"sortBy":"title","music":[]}
    if type=='smart': new_pl['rules']=[]
    playlists.append(new_pl)
    with open(PLAYLIST_DB_PATH,'w',encoding='utf-8') as f: json.dump(playlists,f,indent=4,ensure_ascii=False)
    return len(playlists)-1
@eel.expose
def rename_playlist(index, new_name):
    if not os.path.exists(PLAYLIST_DB_PATH): return False
    try:
        with open(PLAYLIST_DB_PATH,'r',encoding='utf-8') as f: playlists=json.load(f)
        if 0<=index<len(playlists):
            playlists[index]['playlistName']=new_name
            with open(PLAYLIST_DB_PATH,'w',encoding='utf-8') as f: json.dump(playlists,f,indent=4,ensure_ascii=False)
            return True
        return False
    except: return False
@eel.expose
def duplicate_playlist(index):
    if not os.path.exists(PLAYLIST_DB_PATH): return False
    try:
        with open(PLAYLIST_DB_PATH,'r',encoding='utf-8') as f: playlists=json.load(f)
        if 0<=index<len(playlists):
            new_pl=copy.deepcopy(playlists[index]); new_pl['playlistName']+=" - コピー"
            playlists.append(new_pl)
            with open(PLAYLIST_DB_PATH,'w',encoding='utf-8') as f: json.dump(playlists,f,indent=4,ensure_ascii=False)
            return True
        return False
    except: return False
@eel.expose
def delete_playlist(index):
    if not os.path.exists(PLAYLIST_DB_PATH): return False
    try:
        with open(PLAYLIST_DB_PATH,'r',encoding='utf-8') as f: playlists=json.load(f)
        if 0<=index<len(playlists):
            del playlists[index]
            with open(PLAYLIST_DB_PATH,'w',encoding='utf-8') as f: json.dump(playlists,f,indent=4,ensure_ascii=False)
            return True
        return False
    except: return False

@eel.expose
def update_song_field(index, field, value): return False
@eel.expose
def update_song_by_id(music_filename, field, value):
    try:
        data=load_db(); target=None
        for item in data:
            if item.get('musicFilename')==music_filename: target=item; break
        if target:
            target[field]=value; save_db(data); set_mp3_tag(); return True
        return False
    except: return False
@eel.expose
def update_song_artwork_by_id(music_filename, new_art_base64, remove):
    try:
        data=load_db(); target=None
        for item in data:
            if item.get('musicFilename')==music_filename: target=item; break
        if not target: return False
        old=target.get('imageFilename')
        if old and os.path.exists(old):
            try: os.remove(old)
            except: pass
        new_path=""
        if remove: target['imageFilename']=""
        elif new_art_base64:
            file_id=generate_file_id(); image_ext=".png"
            if ',' in new_art_base64:
                header,body=new_art_base64.split(',',1)
                if "image/jpeg" in header: image_ext=".jpg"
                elif "image/png" in header: image_ext=".png"
                elif "image/gif" in header: image_ext=".gif"
                new_art_base64=body
            new_image_filename=f"{file_id}{image_ext}"
            new_path=os.path.join(IMAGE_DIR,new_image_filename)
            with open(new_path,'wb') as f: f.write(base64.b64decode(new_art_base64))
            target['imageFilename']=new_path
        save_db(data); set_mp3_tag(); return True
    except: return False
@eel.expose
def delete_song_by_id(music_filename):
    try:
        data=load_db(); target_index=-1
        for i,item in enumerate(data):
            if item.get('musicFilename')==music_filename: target_index=i; break
        if target_index==-1: return False
        item=data[target_index]
        m=item.get('musicFilename'); i_img=item.get('imageFilename')
        if m and os.path.exists(m):
            try: os.remove(m)
            except: pass
        if i_img and os.path.exists(i_img):
            try: os.remove(i_img)
            except: pass
        del data[target_index]; save_db(data); return True
    except: return False

@eel.expose
def save_music_data(data):
    try:
        file_id = generate_file_id(); original_music_name = data['music_name']; music_b64 = data['music_data']
        _, music_ext = os.path.splitext(original_music_name)
        if not music_ext: music_ext = ".mp3"
        new_music_filename = f"{file_id}{music_ext}"
        save_music_path = os.path.join(MUSIC_DIR, new_music_filename)
        if ',' in music_b64: header, music_b64 = music_b64.split(',', 1)
        with open(save_music_path, 'wb') as f: f.write(base64.b64decode(music_b64))

        save_image_path = ""
        if data.get('artwork_data'):
            image_b64 = data['artwork_data']; image_ext = ".png"
            if ',' in image_b64:
                header, body = image_b64.split(',', 1); image_b64 = body
                if "image/jpeg" in header: image_ext = ".jpg"
                elif "image/png" in header: image_ext = ".png"
                elif "image/gif" in header: image_ext = ".gif"
            new_image_filename = f"{file_id}{image_ext}"
            save_image_path = os.path.join(IMAGE_DIR, new_image_filename)
            with open(save_image_path, 'wb') as f: f.write(base64.b64decode(image_b64))
        
        current_db = load_db()
        new_entry = { "musicFilename": save_music_path, "imageFilename": save_image_path }
        for key in TAG_MAP.keys(): new_entry[key] = data.get(key, '')
        current_db.append(new_entry); save_db(current_db); set_mp3_tag(); return True
    except: return False

@eel.expose
def execute_import(content, file_type):
    logs=[]; import_list=[]
    try:
        if file_type=='json': import_list=json.loads(content)
        elif file_type=='csv':
            f=io.StringIO(content); reader=csv.reader(f)
            for row in reader:
                if len(row)<7: continue
                item={"musicFilename":row[0].strip(),"imageFilename":row[1].strip(),"title":row[2].strip(),"artist":row[3].strip(),"album":row[4].strip(),"genre":row[5].strip(),"track":row[6].strip()}
                import_list.append(item)
    except Exception as e: return [{'status':'error','message':f'File error:{str(e)}'}]
    if not import_list: return [{'status':'error','message':'No Data'}]
    current_db=load_db(); total_count=len(import_list); success_count=0
    try: eel.js_import_progress(0, total_count, "Start")
    except: pass
    for i, item in enumerate(import_list):
        try:
            title = item.get('title','Unknown'); src_music = item.get('musicFilename'); src_image = item.get('imageFilename')
            try: eel.js_import_progress(i+1, total_count, f"Processing: {title}"); eel.sleep(0.01)
            except: pass
            if not src_music or not os.path.exists(src_music): logs.append({'status':'error','message':f'Missing: {title}'}); continue
            file_id=generate_file_id(); ext=os.path.splitext(src_music)[1]; new_m=os.path.join(MUSIC_DIR, f"{file_id}{ext}"); shutil.copy2(src_music, new_m)
            dst_i=""; 
            if src_image and os.path.exists(src_image):
                iext=os.path.splitext(src_image)[1]; new_i=os.path.join(IMAGE_DIR, f"{file_id}{iext}"); shutil.copy2(src_image, new_i); dst_i=new_i
            db_entry = { "musicFilename": new_m, "imageFilename": dst_i }
            for key in TAG_MAP.keys(): db_entry[key] = item.get(key, '')
            current_db.append(db_entry); success_count+=1
            logs.append({'status':'success','message':f'Reg: {title}'})
        except Exception as e: logs.append({'status':'error','message':f'Err: {str(e)}'})
    try: eel.js_import_progress(total_count, total_count, "Saving...")
    except: pass
    save_db(current_db)
    try: eel.js_import_progress(total_count, total_count, "Tagging...")
    except: pass
    set_mp3_tag(notify_progress=True)
    return logs

# Export & Streaming (Standard)
@eel.expose
def get_default_export_path():
    try:
        if os.name=='nt': d=os.path.join(os.environ['USERPROFILE'],'Downloads')
        else: d=os.path.join(os.path.expanduser('~'),'Downloads')
        return os.path.join(d, f"Backup_{datetime.now().strftime('%Y%m%d')}.zip")
    except: return ""
@eel.expose
def ask_save_path(initial=""):
    r=tkinter.Tk(); r.withdraw(); r.wm_attributes('-topmost',1); r.lift(); r.focus_force()
    f=filedialog.asksaveasfilename(parent=r, title="Export", initialdir=os.path.dirname(initial) if initial else "", initialfile=os.path.basename(initial) if initial else "backup.zip", defaultextension=".zip", filetypes=[("ZIP","*.zip")])
    r.destroy(); return f
@eel.expose
def execute_export(targets, path, pwd=""):
    try:
        if not path: return {'success':False,'message':'Invalid Path'}
        z=None
        if pwd:
            if pyzipper: z=pyzipper.AESZipFile(path,'w',compression=pyzipper.ZIP_DEFLATED,encryption=pyzipper.WZ_AES); z.setpassword(pwd.encode('utf-8'))
            else: return {'success':False,'message':'pyzipper missing'}
        else: z=zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED)
        with z as zf:
            if targets.get('music') and os.path.exists(MUSIC_DIR):
                for r,_,fs in os.walk(MUSIC_DIR):
                    for f in fs: zf.write(os.path.join(r,f), os.path.relpath(os.path.join(r,f), start="."))
            if targets.get('images') and os.path.exists(IMAGE_DIR):
                for r,_,fs in os.walk(IMAGE_DIR):
                    for f in fs: zf.write(os.path.join(r,f), os.path.relpath(os.path.join(r,f), start="."))
            if targets.get('db') and os.path.exists(DB_PATH): zf.write(DB_PATH, os.path.join(USERFILES_DIR,"music.json"))
            if targets.get('settings') and os.path.exists(SETTINGS_PATH): zf.write(SETTINGS_PATH, os.path.join(USERFILES_DIR,"settings.ini"))
            if targets.get('playlists'):
                for n in ["playlist.json", "played_times.json"]:
                    if os.path.exists(os.path.join(USERFILES_DIR,n)): zf.write(os.path.join(USERFILES_DIR,n), os.path.join(USERFILES_DIR,n))
        return {'success':True, 'path':path}
    except Exception as e: return {'success':False,'message':str(e)}
@bottle.route('/stream_music/<filename>')
def server_static_music(filename): return bottle.static_file(filename, root=MUSIC_DIR)

if __name__ == '__main__':
    web_folder = 'app'
    eel.init(resource_path(web_folder))
    eel.start('index.html', size=(1200, 900), port=0)