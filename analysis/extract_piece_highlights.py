from pathlib import Path
full = Path("analysis/metadata_piece_tokens.txt").read_text(encoding="utf-8")
keywords = ["PieceGroup", "OnPiece", "OnlyHighestPieceOnEmptyColumn", "OnlyNextLowerPiece", "OnlyPerfectPiece", "ShufflePieces", "PieceTextureCache", "PieceAnimationHandler", "PiecePrefab", "SetParentPiece", "GetPieceGroup"]
lines = []
for line in full.splitlines():
    if line and any(keyword in line for keyword in keywords):
        lines.append(line)
        if len(lines) >= 40:
            break
Path("analysis/metadata_piece_highlights.txt").write_text("\n".join(lines), encoding="utf-8")
print("done")
