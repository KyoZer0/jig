from pathlib import Path
for i, line in enumerate(Path("analysis/metadata_board_tokens.txt").open("r", encoding="utf-8")):
    print(f"{i+1}: {line[:80]}")
    if i >= 9:
        break
