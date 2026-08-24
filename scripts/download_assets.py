#!/usr/bin/env python3
"""Download Figma MCP asset URLs and convert them to JPEG where useful."""
from __future__ import annotations

import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
BASE = "https://www.figma.com/api/mcp/asset"

FILES = {
    # Home featured projects
    "home/oka.png": f"{BASE}/107d2be6-ce59-4c51-a621-7396c6b9542a.png",
    "home/kotelniki.png": f"{BASE}/a0d60589-e777-4277-a5b4-bfb769f770a4.png",
    "home/krestovsky.png": f"{BASE}/d6d29ad6-e950-4483-9e26-8b45351db21e.png",
    # About
    "heroes/about.png": f"{BASE}/b0cb12ca-ab50-4e6f-8b85-56ee6dd3733c.png",
    "about/team-1.png": f"{BASE}/1de31a68-532a-4c4c-bfa9-91527c22cd38.png",
    "about/team-2.png": f"{BASE}/c91dc0c0-512a-44c0-88eb-2d3cec680ff9.png",
    "about/team-3.png": f"{BASE}/d670de0c-28f8-433e-b258-0adec086c29f.png",
    "about/team-4.png": f"{BASE}/af147a69-750f-4dec-bc42-741d48feb27f.png",
    "about/team-5.png": f"{BASE}/41689f1c-e3a8-4e97-bffb-4e7a45a539e5.png",
    "about/office-1.png": f"{BASE}/edc20412-e00d-447e-84a5-3a406b710847.png",
    "about/office-2.png": f"{BASE}/527c5c7e-bb57-4ba2-9476-69fe717adf23.png",
    "about/office-3.png": f"{BASE}/c3e1ae37-e407-47ed-a114-3776b56113e9.png",
    "about/office-4.png": f"{BASE}/9b4e9d6e-81f0-46c1-84b2-fb02ca497cb7.png",
    "about/award-1.png": f"{BASE}/6f74e482-5168-4d47-822d-62ce1921c497.png",
    "about/award-2.png": f"{BASE}/12397071-eb06-457b-aac1-a7d25e039f0b.png",
    "about/award-3.png": f"{BASE}/13ecb0fb-74a7-45bd-bf92-0702e603e328.png",
    "about/award-4.png": f"{BASE}/c1a9eb10-a72a-432c-9839-72f974437536.png",
    "about/award-5.png": f"{BASE}/28e0ba97-f3e6-4dec-890f-659e1986bb09.png",
    "about/monogram.png": f"{BASE}/a8879d8a-94fb-444b-98a8-7eb72cd9b5b6.png",
    "about/arrow.svg": f"{BASE}/2fa8f3ae-69f7-4538-84cf-cc899ce726dd.svg",
    # Journal
    "journal/01a.png": f"{BASE}/b2b28371-97e6-405a-a108-9eaf0f8abe46.png",
    "journal/01b.png": f"{BASE}/5ff12ea9-c77c-4b97-a965-a718aea4bd9c.png",
    "journal/02.png": f"{BASE}/42bb9d81-9bda-48aa-b18b-64c563b2db3e.png",
    "journal/03.png": f"{BASE}/b3cc6b75-147b-4b4b-9253-3d2662d1da49.png",
    "journal/04.png": f"{BASE}/3a80a619-765c-4ff7-b469-af2c6e1ff9e1.png",
    "journal/05.png": f"{BASE}/61279a99-9bc2-41fa-a984-bbec0fc00d7e.png",
    # Projects grid
    "projects/krestovsky.png": f"{BASE}/15ad4442-d6f5-488d-a505-a46a51550179.png",
    "projects/dom-na-oke.png": f"{BASE}/4ff47151-e190-4f4d-ab7d-0ba4ba0ac4cc.png",
    "projects/kotelniki.png": f"{BASE}/77eb24ac-0976-42c5-960c-4d9d26adb8cf.png",
    "projects/moskva.png": f"{BASE}/cae9d2f5-f810-403c-a6ae-2c0e03230e77.png",
    "projects/bulgakov.png": f"{BASE}/755e1922-584c-4002-b10c-c73e832162df.png",
    "projects/little.png": f"{BASE}/3a8a63b0-e418-469f-a1e5-8a0155f21dcb.png",
    "projects/savvinskaya.png": f"{BASE}/9bbaaeab-7233-4f79-8772-9dd23de7f582.png",
    "projects/sofiyskaya.png": f"{BASE}/8ada79ab-53fe-42c4-bba0-b3dca4e14e03.png",
    "projects/houseboat.png": f"{BASE}/304da5c4-a351-471e-aaab-be09f2ee7ae9.png",
    "projects/frunzenskaya.png": f"{BASE}/784f23b6-aa35-4018-be37-bb2f6545384e.png",
    "projects/pogodinskaya.png": f"{BASE}/f6d75caf-411d-4d02-bd68-f1dca73d97df.png",
    "projects/balchug-viewpoint.png": f"{BASE}/39b66753-c093-4f90-9e8c-bd9f0ae52092.png",
    "projects/dirizhabl.png": f"{BASE}/0beb6315-be3a-4a70-a396-62c3f432562b.png",
    "projects/mosfilmovskaya.png": f"{BASE}/25417608-d074-4791-98aa-8b994095cffc.png",
    "projects/vtb.png": f"{BASE}/f4848109-d97f-40bb-8e03-26af2b84e26e.png",
    "projects/wellhouse.png": f"{BASE}/f37791f7-74a1-43b9-a4aa-8a69b9a20b81.png",
    "projects/city-park.png": f"{BASE}/a3524d0c-984d-4032-8e08-6a37cd66c3ca.png",
    "projects/la-metamorphose.png": f"{BASE}/13d01eba-8f72-4019-b192-f9cfb1d9fdd5.png",
    "projects/balchug.png": f"{BASE}/d5c727be-ecdb-4043-b6f9-ab2c23a61c8b.png",
    # Dom na Oke
    "oke/hero.png": f"{BASE}/172795d6-7c4c-49e8-957d-2338a07d923a.png",
    "oke/g1.png": f"{BASE}/b20342d3-ccf4-4e19-9c75-d7c775e51d60.png",
    "oke/g2.png": f"{BASE}/b8e34707-83b1-4c9b-839d-40e2f6914e63.png",
    "oke/g3.png": f"{BASE}/195cd994-a941-4d1e-9552-9301974642e4.png",
    "oke/g4.png": f"{BASE}/42308e44-e9c9-4a64-a1c7-67abaffb3712.png",
    "oke/g5.png": f"{BASE}/c0a241ef-0fe1-447d-96ac-9b322a7783cf.png",
    "oke/g6.png": f"{BASE}/11f22ed7-a53e-4498-a0a3-adf361e7af34.png",
    "oke/g7.png": f"{BASE}/3474e8f7-a448-4279-bdfe-26f695c10364.png",
    "oke/g8.png": f"{BASE}/b5954fe7-46ae-4567-be40-d5367f6557db.png",
    "oke/t1.png": f"{BASE}/b5484971-64bf-4cb8-979b-77cbead5b28c.png",
    "oke/t2.png": f"{BASE}/2eba2acc-11b0-441e-9354-41f04dabffd4.png",
    "oke/t3.png": f"{BASE}/d6a0cbf0-cc06-4c2c-a03a-57ef639c899e.png",
    "oke/t4.png": f"{BASE}/7e91d52e-3d01-4b46-8883-d21e8a1c8a53.png",
    "oke/t5.png": f"{BASE}/1b4a7288-78fd-4008-b005-341141bb60ce.png",
    "oke/t6.png": f"{BASE}/b2d1de65-3dd4-49eb-94c3-52ae26496946.png",
    "oke/t7.png": f"{BASE}/33f5729e-dea8-42e3-b6e8-b06bddcc3b7a.png",
    "oke/t8.png": f"{BASE}/e000f2d9-be48-402c-ab12-0937be0a2e2d.png",
    "oke/t9.png": f"{BASE}/c56e6ba2-0323-4b86-ba2e-7c08b4719ffc.png",
    "oke/t10.png": f"{BASE}/e3808262-d957-42f1-817b-eeb5ab5e15ab.png",
    "oke/t11.png": f"{BASE}/d741528b-0e91-4681-b7a2-e924b7dce106.png",
    "oke/t12.png": f"{BASE}/ac04dda3-ed66-4f21-bbb9-bc9901ba1ddf.png",
    "oke/t13.png": f"{BASE}/4cf67a8c-ff06-4632-b871-947cb2b7f5bd.png",
    "oke/t14.png": f"{BASE}/f1e3923f-38a0-40d0-b003-89da6c047c80.png",
    "oke/t15.png": f"{BASE}/2e37b716-1eb7-45b1-a576-37a21fd33c1c.png",
    "oke/t16.png": f"{BASE}/f08ce608-5dff-4d0a-9b3b-193d3520fd20.png",
    # Krestovsky
    "krestovsky/hero.png": f"{BASE}/bf37a722-f83d-4a4a-b4bd-0da1bb65d92f.png",
    "krestovsky/g1.png": f"{BASE}/5ca000f4-5b22-4ca8-94f8-d41baca3639b.png",
    "krestovsky/g2.png": f"{BASE}/77ef486c-20bf-465d-a1a2-2c9caadd87f6.png",
    "krestovsky/g3.png": f"{BASE}/def2bc29-bd53-4718-b913-143fcfecdf78.png",
    "krestovsky/g4.png": f"{BASE}/830a9ff4-61c0-4a62-8563-fc7ca5b3ce1b.png",
    "krestovsky/g5.png": f"{BASE}/1a84ae34-b176-48bb-b9b4-350cfd5b2de7.png",
    "krestovsky/g6.png": f"{BASE}/f95ffcc9-ba3a-4ee5-91f6-eb90e5798794.png",
    "krestovsky/g7.png": f"{BASE}/06a7f87a-1ff3-4343-b168-f7e68d16034a.png",
    "krestovsky/g8.png": f"{BASE}/6dd7bf36-4d3c-4501-97c1-c82519e3f3a6.png",
    "krestovsky/g9.png": f"{BASE}/1873f96f-9bb1-43cb-a39c-d62930da3b96.png",
    "krestovsky/t1.png": f"{BASE}/7bd17a99-b555-4516-857b-dc11a5d667ca.png",
    "krestovsky/t2.png": f"{BASE}/4425d675-b498-4078-99f1-9cad140f929d.png",
    "krestovsky/t3.png": f"{BASE}/60d36706-3b9c-4ca1-a65c-a34a105b8433.png",
    "krestovsky/t4.png": f"{BASE}/d4b45a00-c9b8-410f-9ba9-7e152a068311.png",
    "krestovsky/t5.png": f"{BASE}/38ebfb6b-dd0f-4805-90ff-41822ec347ca.png",
    "krestovsky/t6.png": f"{BASE}/6855ef44-582b-400c-bb46-e7b67b8c61b4.png",
    "krestovsky/t7.png": f"{BASE}/be52047f-353f-4562-980b-d0cae121f6ef.png",
    "krestovsky/t8.png": f"{BASE}/9be6195d-3fcb-4534-aac5-3430aa320207.png",
    "krestovsky/t9.png": f"{BASE}/5a420b1f-82a4-4930-bb5d-ef8f325dad63.png",
    "krestovsky/t10.png": f"{BASE}/31fe8f8c-395c-4542-a4bd-661b4ddd20a0.png",
    "krestovsky/t11.png": f"{BASE}/e3d0d0e7-206a-46ae-9a2d-9f904a4d9bf6.png",
    "krestovsky/t12.png": f"{BASE}/6b5b8698-0ee7-4b11-ab57-2830096c4f09.png",
    "krestovsky/t13.png": f"{BASE}/bfbc7957-8229-4ceb-9691-c40052b4d690.png",
    "krestovsky/t14.png": f"{BASE}/e5e56780-458b-41dd-84d5-b2edd0d3c388.png",
    "krestovsky/t15.png": f"{BASE}/80972a05-98da-4ec1-9013-803f7ff5c316.png",
    "krestovsky/t16.png": f"{BASE}/dcb9aead-b7d0-4e4d-86e8-fa2fe6af0d00.png",
    "krestovsky/t17.png": f"{BASE}/054a4ae2-8958-4714-9a58-9bc18f99b047.png",
    "krestovsky/t18.png": f"{BASE}/b91b6d7b-67cc-41ac-b313-01bdab43f7c0.png",
    "logos/footer.svg": f"{BASE}/7f06e916-e0e3-4a11-ac5c-ce69a6ff357c.svg",
}


def download(rel: str, url: str) -> None:
    dest = ASSETS / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000:
        print(f"skip {rel}")
        return
    print(f"get  {rel}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as res:
        dest.write_bytes(res.read())


def to_jpeg(png: Path) -> None:
    jpg = png.with_suffix(".jpg")
    subprocess.run(
        [
            "sips",
            "-s",
            "format",
            "jpeg",
            "-s",
            "formatOptions",
            "82",
            str(png),
            "--out",
            str(jpg),
        ],
        check=True,
        capture_output=True,
    )
    png.unlink()


def main() -> None:
    for rel, url in FILES.items():
        try:
            download(rel, url)
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {rel}: {exc}")
    for png in ASSETS.rglob("*.png"):
        if png.stat().st_size < 800:
            print(f"tiny {png.relative_to(ASSETS)}")
            continue
        print(f"jpg  {png.relative_to(ASSETS)}")
        try:
            to_jpeg(png)
        except Exception as exc:  # noqa: BLE001
            print(f"sips fail {png}: {exc}")


if __name__ == "__main__":
    main()
