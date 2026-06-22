import os
import requests
from PIL import Image
import io
import shutil

os.makedirs('/Users/eugenius/Work/Ona-Analytics/public/logos', exist_ok=True)
os.makedirs('/Users/eugenius/Work/Ona-Analytics/public/logos/raw', exist_ok=True)

camps = [
    {
        "name": "olare-orok",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kempinski_Logo_2015.svg",
        "is_svg": True
    },
    {
        "name": "serengeti",
        "url": "https://www.elewanacollection.com/images/logos/white-elewana-collection.png",
        "is_svg": False
    },
    {
        "name": "samburu",
        "url": "https://www.heritage-eastafrica.com/heritage_hotels_bin/hotellogo_intrepid.png",
        "is_svg": False
    },
    {
        "name": "selous",
        "url": "https://images.squarespace-cdn.com/content/v1/64a6d4bbb2ddce1a62bea18a/cecdab61-3743-4d58-9450-67fc43b78599/selous_river_camp_logo_text.png",
        "is_svg": False
    },
    {
        "name": "okavango",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Belmond_Hotel_Monasterio_logo.svg",
        "is_svg": True
    },
    {
        "name": "ruaha",
        "url": "https://foxessafaricamps.com/media/img/xz/foxeasb6bef18.png",
        "is_svg": False
    }
]

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

for camp in camps:
    name = camp["name"]
    url = camp["url"]
    print(f"Fetching {name} from {url}...")
    try:
        res = requests.get(url, headers=headers, timeout=15)
        if not res.ok:
            print(f"Failed to fetch {name}: status {res.status_code}")
            continue
        
        # Save raw copy
        ext = "svg" if camp["is_svg"] else "png"
        raw_path = f"/Users/eugenius/Work/Ona-Analytics/public/logos/raw/{name}.{ext}"
        with open(raw_path, "wb") as f:
            f.write(res.content)
            
        out_path = f"/Users/eugenius/Work/Ona-Analytics/public/logos/{name}.{ext}"
        if camp["is_svg"]:
            shutil.copyfile(raw_path, out_path)
            print(f"Saved SVG for {name} to {out_path}")
        else:
            # Load raw image
            img = Image.open(raw_path).convert("RGBA")
            
            # Resize height to 40px, maintaining aspect ratio
            w, h = img.size
            aspect = w / h
            new_h = 40
            new_w = int(new_h * aspect)
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            img.save(out_path, "PNG")
            print(f"Saved cleaned and resized PNG for {name} to {out_path} ({new_w}x{new_h})")
    except Exception as e:
        print(f"Error processing {name}: {e}")
