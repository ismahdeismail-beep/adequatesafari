#!/usr/bin/env python3
"""
Local preview server for the Adequate Safaris Joomla template.

Renders static preview pages that use the REAL template CSS/JS so the design
can be reviewed in a browser before anything is committed.

Usage:  python3 preview/serve.py [port]   (default 8080)
"""
import http.server
import socketserver
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        # Map template + module asset paths to the real files in the repo
        clean = path.split("?", 1)[0].split("#", 1)[0]
        for prefix in ("/templates/adequate/", "/modules/"):
            if clean.startswith(prefix):
                real = REPO / "joomla-site" / clean.lstrip("/")
                if real.exists():
                    return str(real)
        return super().translate_path(path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


if __name__ == "__main__":
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"\n  Adequate Safaris — template preview")
        print(f"  →  http://localhost:{PORT}/")
        print(f"     http://localhost:{PORT}/safari.html")
        print(f"     http://localhost:{PORT}/listing.html\n")
        print("  Ctrl+C to stop.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  stopped.\n")