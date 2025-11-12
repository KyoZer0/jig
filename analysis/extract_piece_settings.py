import json
import UnityPy
from pathlib import Path
bundle_path = Path("com.gamincat.jigsolitaire/assets/aa/Android/defaultlocalgroup_assets_all_ca619d4f2e59f2119fbae48daab99ee9.bundle")
env = UnityPy.load(bundle_path.read_bytes())
for size in ["3x3","4x4","5x5"]:
    for path, obj in env.container.items():
        if path.endswith(f"{size}.asset"):
            tree = obj.read_typetree()
            Path(f"analysis/piece_setting_{size}.json").write_text(json.dumps(tree, indent=2), encoding="utf-8")
            break
print("done")
