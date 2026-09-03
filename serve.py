#!/usr/bin/env python3
"""Local preview server that matches how Cloudflare serves this site.

The site's public URLs have no .html extension - Cloudflare's static-asset
Worker serves pages/graphic-design.html at /pages/graphic-design and redirects
the .html form to it. Internal links are written that way to match, which means
opening index.html straight off disk with file:// can no longer follow them:
there is no file called "graphic-design" to open. Neither does a plain
`python3 -m http.server`.

This adds the one missing rule - try <path>.html when <path> has no extension -
so clicking around locally behaves the way it does in production.

    python3 serve.py            # then open http://localhost:8000
    python3 serve.py 9000       # a different port

Preview only. It is excluded from deploys by .assetsignore.
"""

import http.server
import os
import sys


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = super().translate_path(path)
        # Only fill in the extension when the request looks like a page and
        # nothing already matches; real files and directories are left alone.
        if not os.path.exists(local) and not os.path.splitext(local)[1]:
            candidate = local + ".html"
            if os.path.isfile(candidate):
                return candidate
        return local

    def end_headers(self):
        # Without this the browser caches an edit away and the preview lies.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), CleanURLHandler)
    print("Rayla preview: http://localhost:%d  (Ctrl-C to stop)" % port)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
