from pathlib import Path
metadata = Path("com.gamincat.jigsolitaire/assets/bin/Data/Managed/Metadata/global-metadata.dat").read_bytes()
strings = [s.decode("utf-8", "ignore") for s in metadata.split(b"\x00")]
control_chars = ''.join(chr(i) for i in range(32))
def clean(token: str) -> str:
    return token.lstrip(control_chars)
core = sorted({clean(s) for s in strings if "Game.Core|" in s})
def interesting_piece(token: str) -> bool:
    t = clean(token)
    return t.startswith("Piece") or t.startswith("OnPiece") or t.startswith("Only") or t.startswith("GetPiece") or t.startswith("ShufflePieces") or t.startswith("SetParentPiece") or "PieceGroup" in t or "PieceTexture" in t
piece_related = sorted({clean(s) for s in strings if interesting_piece(s)})
def interesting_board(token: str) -> bool:
    t = clean(token)
    keywords = ["HomeBoard","BoardGrid","BoardHelper","BoardInfo","BoardPrefab","BoardSize","PlayHomeBoardFilling","CreateBoard","CaptureHomeBoards"]
    return any(t.startswith(k) or k in t for k in keywords)
board_related = sorted({clean(s) for s in strings if interesting_board(s)})
analysis_dir = Path("analysis")
analysis_dir.mkdir(exist_ok=True)
(analysis_dir / "metadata_core.txt").write_text("Game.Core types and helpers\n" + "\n".join(core), encoding="utf-8")
(analysis_dir / "metadata_piece_tokens.txt").write_text("Piece-related tokens\n" + "\n".join(piece_related), encoding="utf-8")
(analysis_dir / "metadata_board_tokens.txt").write_text("Board-related tokens\n" + "\n".join(board_related), encoding="utf-8")
print("done")
