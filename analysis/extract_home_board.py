import json
import UnityPy
from pathlib import Path
bundle_path = Path("com.gamincat.jigsolitaire/assets/aa/Android/defaultlocalgroup_assets_all_ca619d4f2e59f2119fbae48daab99ee9.bundle")
env = UnityPy.load(bundle_path.read_bytes())
for path, obj in env.container.items():
    if path.endswith("HomeBoardList.txt"):
        data = obj.read()
        text = data.m_Script
        entries = json.loads(text)["Lists"]
        Path("analysis/home_board_list_excerpt.json").write_text(json.dumps(entries[:10], indent=2), encoding="utf-8")
        break
print("done")
