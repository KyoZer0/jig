from pathlib import Path
full = Path("analysis/metadata_board_tokens.txt").read_text(encoding="utf-8")
keywords = ["BoardGrid", "BoardHelper", "PlayHomeBoardFilling", "CreateBoard", "GetBoard", "HomeBoard", "BoardPrefab", "BoardSize", "HomeBoardMasterJson"]
lines = []
for line in full.splitlines():
    if line and any(keyword in line for keyword in keywords):
        lines.append(line)
        if len(lines) >= 40:
            break
Path("analysis/metadata_board_highlights.txt").write_text("\n".join(lines), encoding="utf-8")
print("done")
