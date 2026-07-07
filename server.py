from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import socket
import webbrowser


HOST = "127.0.0.1"
START_PORT = 4173
ROOT = Path(__file__).resolve().parent


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def find_port(start_port):
    for port in range(start_port, start_port + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex((HOST, port)) != 0:
                return port
    raise RuntimeError("Brak wolnego portu w zakresie 4173-4192.")


def main():
    os.chdir(ROOT)
    port = find_port(START_PORT)
    url = f"http://{HOST}:{port}/"
    server = ThreadingHTTPServer((HOST, port), NoCacheHandler)

    print("")
    print("Symulator kompromisow srodowiskowych dziala.")
    print(f"Adres: {url}")
    print("Zostaw to okno otwarte podczas pracy z aplikacja.")
    print("Aby zatrzymac serwer, nacisnij Ctrl+C.")
    print("")

    try:
        webbrowser.open(url)
    except Exception:
        pass

    server.serve_forever()


if __name__ == "__main__":
    main()
