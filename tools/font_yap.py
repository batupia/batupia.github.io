#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
STONEBREAKING.font — markanin kendi yazi tipi
==============================================
Kullanici: "fontumuzu da olusturalim tum harflerini kucuklu buyuklu
ozel karakterler dahil olmak uzere stonebreaking.font olmali".

TASARIM DILI (logodan turetildi):
  - Firca imzasi: harfler tek darbeyle cizilmis gibi, hafif egik (italik)
  - Kirik tas: koseler keskin, govdede kirilma noktalari var
  - Kazima: dikey govdeler kalin, baglantilar ince (kontrast)

TEKNIK:
  - Her glif ELLE, kontur koordinatlariyla ciziliyor (hazir font kopyasi yok)
  - Turkce TAM destek: ç ğ ı İ ö ş ü ve buyukleri
  - Rakamlar, noktalama, para birimi, oyun sembolleri
  - Cikti: WOFF2 (web icin sikistirilmis) + TTF (yedek/kurulum)

Calistirma:  python3 tools/font_yap.py
"""
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
import os, unicodedata

UPM   = 1000     # birim kare
ASC   = 800
DESC  = -200
# OKUNABILIRLIK REVIZYONU (v2)
# Kullanici: "fontlar kotu olmus, benim evrenime uysun AMA ANLASILIR olsun".
# v1'de sorun: egim fazlaydi (0.13), x-yuksekligi dusuktu (500) ve
# govde/ince kontrasti asiriydi -> kucuk puntoda harfler birbirine giriyordu.
# v2 kararlari:
#   - Egim 0.13 -> 0.055  (karakter kalir, okuma bozulmaz)
#   - x-yuksekligi 500 -> 545 (kucuk harfler buyudu, ekranda net)
#   - Kontrast dusuruldu: STEM 92->104, THIN 58->76 (fark 34 -> 28)
# Marka hissi KOSE KESKINLIGI ve kazima dilinden gelir, egimden degil.
XH    = 545      # x-yuksekligi
CAP   = 715      # buyuk harf yuksekligi
SLANT = 0.055    # hafif firca egimi


def sk(pts, y0=0.0):
    """Firca egimi: yukseklige gore saga kaydir."""
    return [(x + (y - y0) * SLANT, y) for (x, y) in pts]


class Pen:
    """Basit kontur toplayici; her kontur nokta listesi."""
    def __init__(self):
        self.contours = []

    def add(self, pts):
        if len(pts) >= 3:
            self.contours.append(sk(pts))

    def bar(self, x, y1, y2, w):
        """Dikey/egik kalin govde."""
        h = w / 2.0
        self.add([(x - h, y1), (x + h, y1), (x + h, y2), (x - h, y2)])

    def hbar(self, x1, x2, y, w):
        """Yatay cizgi."""
        h = w / 2.0
        self.add([(x1, y - h), (x2, y - h), (x2, y + h), (x1, y + h)])

    def diag(self, x1, y1, x2, y2, w):
        """Egik cizgi (kalinlik dik yonde)."""
        dx, dy = x2 - x1, y2 - y1
        L = max(1e-6, (dx * dx + dy * dy) ** 0.5)
        nx, ny = -dy / L * w / 2.0, dx / L * w / 2.0
        self.add([(x1 + nx, y1 + ny), (x2 + nx, y2 + ny),
                  (x2 - nx, y2 - ny), (x1 - nx, y1 - ny)])

    def poly(self, pts):
        self.add(pts)

    def ring(self, cx, cy, rx, ry, w, n=44, a0=0.0, a1=6.28318):
        """Halka/yay — cokgen yaklasimi (kazima hissi icin kose sayisi dusuk)."""
        import math
        outer, inner = [], []
        for i in range(n + 1):
            a = a0 + (a1 - a0) * i / n
            outer.append((cx + math.cos(a) * (rx + w / 2), cy + math.sin(a) * (ry + w / 2)))
            inner.append((cx + math.cos(a) * (rx - w / 2), cy + math.sin(a) * (ry - w / 2)))
        if abs((a1 - a0) - 6.28318) < 1e-3:
            self.add(outer)
            self.add(list(reversed(inner)))
        else:
            self.add(outer + list(reversed(inner)))


STEM = 104    # ana govde kalinligi (kucuk puntoda kaybolmasin)
THIN = 76     # ince baglanti (kontrast dusuk = daha okunur)


def G(w, fn):
    """Glif tanimi: (ilerleme genisligi, cizim fonksiyonu)."""
    return (w, fn)


def _A(p):
    p.diag(40, 0, 250, CAP, STEM); p.diag(250, CAP, 460, 0, STEM)
    p.hbar(120, 380, 250, THIN)


def _B(p):
    p.bar(70, 0, CAP, STEM)
    p.ring(250, CAP * 0.74, 160, 150, THIN + 10, a0=-1.5708, a1=1.5708)
    p.ring(250, CAP * 0.26, 175, 165, THIN + 14, a0=-1.5708, a1=1.5708)
    p.hbar(70, 250, CAP, THIN); p.hbar(70, 250, CAP * 0.5, THIN); p.hbar(70, 250, 0, THIN)


def _C(p):
    p.ring(255, CAP / 2, 195, CAP / 2 - 28, STEM - 4, a0=0.52, a1=5.76)
    p.diag(400, CAP * 0.80, 432, CAP * 0.72, THIN)     # ust uc
    p.diag(400, CAP * 0.20, 432, CAP * 0.28, THIN)     # alt uc


def _D(p):
    p.bar(70, 0, CAP, STEM)
    p.ring(230, CAP / 2, 200, CAP / 2 - 25, THIN + 16, a0=-1.5708, a1=1.5708)
    p.hbar(70, 230, CAP, THIN); p.hbar(70, 230, 0, THIN)


def _E(p):
    p.bar(80, 0, CAP, STEM)
    p.hbar(80, 400, CAP, STEM - 12); p.hbar(80, 330, CAP / 2, THIN + 6); p.hbar(80, 410, 0, STEM - 12)


def _F(p):
    p.bar(80, 0, CAP, STEM)
    p.hbar(80, 400, CAP, STEM - 12); p.hbar(80, 330, CAP * 0.52, THIN + 6)


def _Gg(p):
    p.ring(260, CAP / 2, 200, CAP / 2 - 30, STEM, a0=0.7, a1=5.4)
    p.hbar(300, 460, CAP * 0.42, THIN + 8); p.bar(460, CAP * 0.42, CAP * 0.05, THIN + 8)


def _H(p):
    p.bar(80, 0, CAP, STEM); p.bar(420, 0, CAP, STEM); p.hbar(80, 420, CAP * 0.5, THIN + 6)


def _I(p):
    p.bar(140, 0, CAP, STEM)


def _J(p):
    p.bar(330, CAP * 0.22, CAP, STEM)
    p.ring(200, CAP * 0.22, 130, 120, THIN + 12, a0=3.1416, a1=6.1)


def _K(p):
    p.bar(80, 0, CAP, STEM)
    p.diag(150, CAP * 0.42, 430, CAP, THIN + 14)
    p.diag(150, CAP * 0.42, 450, 0, STEM - 6)


def _L(p):
    p.bar(90, 0, CAP, STEM); p.hbar(90, 420, 0, STEM - 12)


def _M(p):
    p.bar(60, 0, CAP, STEM); p.bar(520, 0, CAP, STEM)
    p.diag(60, CAP, 290, CAP * 0.28, THIN + 8); p.diag(290, CAP * 0.28, 520, CAP, THIN + 8)


def _N(p):
    p.bar(70, 0, CAP, STEM); p.bar(440, 0, CAP, STEM)
    p.diag(70, CAP, 440, 0, THIN + 14)


def _O(p):
    p.ring(255, CAP / 2, 200, CAP / 2 - 25, STEM)


def _P(p):
    p.bar(70, 0, CAP, STEM)
    p.ring(240, CAP * 0.72, 175, 165, THIN + 14, a0=-1.5708, a1=1.5708)
    p.hbar(70, 240, CAP, THIN); p.hbar(70, 240, CAP * 0.44, THIN)


def _Q(p):
    p.ring(255, CAP / 2, 200, CAP / 2 - 25, STEM)
    p.diag(300, CAP * 0.28, 470, -60, THIN + 16)


def _R(p):
    _P(p); p.diag(240, CAP * 0.44, 450, 0, STEM - 8)


def _S(p):
    # v2: yaylar kucuk puntoda kopuyordu. Simdi tek surekli sekilde:
    # ust cizgi -> sol dikey -> bel -> sag dikey -> alt cizgi.
    w = STEM - 6
    p.hbar(95, 430, CAP - w/2, w)              # ust
    p.bar(95 + w/2, CAP*0.56, CAP - w, w)      # sol ust dikey
    p.hbar(95, 430, CAP*0.50, w)               # bel
    p.bar(430 - w/2, w, CAP*0.50, w)           # sag alt dikey
    p.hbar(95, 430, w/2, w)                    # alt


def _T(p):
    w = STEM - 12
    p.hbar(40, 470, CAP - w/2, w)     # ust kol, tepede
    p.bar(255, 0, CAP - w, STEM)      # dikey govde tabana kadar


def _U(p):
    p.bar(80, CAP * 0.28, CAP, STEM); p.bar(430, CAP * 0.28, CAP, STEM)
    p.ring(255, CAP * 0.28, 175, 165, STEM, a0=3.1416, a1=6.2832)


def _V(p):
    p.diag(50, CAP, 255, 0, STEM - 6); p.diag(255, 0, 460, CAP, STEM - 6)


def _W(p):
    p.diag(30, CAP, 180, 0, THIN + 16); p.diag(180, 0, 320, CAP * 0.62, THIN + 12)
    p.diag(320, CAP * 0.62, 460, 0, THIN + 12); p.diag(460, 0, 610, CAP, THIN + 16)


def _X(p):
    p.diag(50, CAP, 450, 0, STEM - 6); p.diag(50, 0, 450, CAP, STEM - 6)


def _Y(p):
    p.diag(50, CAP, 250, CAP * 0.46, STEM - 8); p.diag(450, CAP, 250, CAP * 0.46, STEM - 8)
    p.bar(250, 0, CAP * 0.46, STEM - 8)


def _Z(p):
    w = STEM - 12
    p.hbar(60, 450, CAP - w/2, w)
    p.diag(430, CAP - w, 80, w, w)
    p.hbar(60, 450, w/2, w)


# ---- kucuk harfler (x-yuksekligi tabanli, ayri cizim) ----
def _a(p):
    p.ring(240, XH * 0.5, 165, XH * 0.5 - 18, THIN + 20)
    p.bar(405, 0, XH, THIN + 22)


def _b(p):
    p.bar(75, 0, CAP, THIN + 22)
    p.ring(255, XH * 0.5, 165, XH * 0.5 - 16, THIN + 20)


def _c(p):
    p.ring(243, XH * 0.5, 162, XH * 0.5 - 16, THIN + 20, a0=0.55, a1=5.74)


def _d(p):
    p.bar(415, 0, CAP, THIN + 22)
    p.ring(235, XH * 0.5, 165, XH * 0.5 - 16, THIN + 20)


def _e(p):
    p.ring(245, XH * 0.5, 165, XH * 0.5 - 16, THIN + 20, a0=0.0, a1=5.5)
    p.hbar(85, 400, XH * 0.5, THIN + 6)


def _f(p):
    p.bar(275, 0, CAP, THIN + 20)
    p.ring(180, CAP - 90, 95, 90, THIN + 14, a0=0.0, a1=3.1416)
    p.hbar(120, 380, XH, THIN + 4)


def _g(p):
    p.ring(245, XH * 0.5, 165, XH * 0.5 - 16, THIN + 20)
    p.bar(410, -160, XH, THIN + 20)
    p.ring(300, -160, 115, 105, THIN + 14, a0=3.1416, a1=6.1)


def _h(p):
    p.bar(75, 0, CAP, THIN + 22); p.bar(400, 0, XH * 0.86, THIN + 22)
    p.ring(238, XH * 0.86, 163, 120, THIN + 18, a0=0.0, a1=3.1416)


def _i(p):
    p.bar(150, 0, XH, THIN + 22); p.ring(150, XH + 120, 8, 8, 70, n=8)


def _dotless_i(p):
    p.bar(150, 0, XH, THIN + 22)


def _j(p):
    p.bar(250, -150, XH, THIN + 20); p.ring(250, XH + 120, 8, 8, 70, n=8)
    p.ring(160, -150, 95, 90, THIN + 14, a0=3.1416, a1=6.1)


def _k(p):
    p.bar(75, 0, CAP, THIN + 22)
    p.diag(140, XH * 0.42, 390, XH, THIN + 12); p.diag(140, XH * 0.42, 400, 0, THIN + 18)


def _l(p):
    p.bar(150, 0, CAP, THIN + 22)


def _m(p):
    p.bar(60, 0, XH, THIN + 20); p.bar(300, 0, XH * 0.82, THIN + 18); p.bar(540, 0, XH * 0.82, THIN + 18)
    p.ring(180, XH * 0.82, 120, 105, THIN + 14, a0=0.0, a1=3.1416)
    p.ring(420, XH * 0.82, 120, 105, THIN + 14, a0=0.0, a1=3.1416)


def _n(p):
    # v3: iki dikey esit boydaydi ve omuz yayi genisti -> N gibi okunuyordu.
    # Sol dikey tam boy, sag dikey KISA, omuz yayi alcak ve dar.
    p.bar(80, 0, XH, THIN + 20)
    p.bar(390, 0, XH * 0.70, THIN + 20)
    p.ring(235, XH * 0.70, 155, 105, THIN + 16, a0=0.0, a1=3.1416)


def _o(p):
    p.ring(245, XH * 0.5, 168, XH * 0.5 - 16, THIN + 20)


def _p(p):
    p.bar(75, -160, XH, THIN + 22)
    p.ring(255, XH * 0.5, 165, XH * 0.5 - 16, THIN + 20)


def _q(p):
    p.bar(415, -160, XH, THIN + 22)
    p.ring(235, XH * 0.5, 165, XH * 0.5 - 16, THIN + 20)


def _r(p):
    p.bar(85, 0, XH, THIN + 22)
    p.ring(240, XH * 0.72, 150, 120, THIN + 14, a0=0.2, a1=3.0)


def _s(p):
    w = THIN + 14
    p.hbar(80, 370, XH - w/2, w)
    p.bar(80 + w/2, XH*0.55, XH - w, w)
    p.hbar(80, 370, XH*0.50, w)
    p.bar(370 - w/2, w, XH*0.50, w)
    p.hbar(80, 370, w/2, w)


def _t(p):
    # v3: govde CAP*0.74'e kadar cikinca buyuk T ile karisiyordu.
    # Simdi x-yuksekliginin biraz ustunde biter, kol ASAGIDA (x-yuk.),
    # altta saga kivrim var -> net kucuk harf silueti.
    p.bar(175, 55, XH * 1.30, THIN + 16)       # kisa govde
    p.hbar(85, 285, XH * 0.88, THIN + 6)       # kol: x-yuksekliginde
    p.hbar(175, 300, 55, THIN + 12)            # alt kivrim


def _u(p):
    p.bar(75, XH * 0.28, XH, THIN + 22); p.bar(400, 0, XH, THIN + 22)
    p.ring(238, XH * 0.28, 163, 120, THIN + 18, a0=3.1416, a1=6.2832)


def _v(p):
    p.diag(55, XH, 235, 0, THIN + 18); p.diag(235, 0, 415, XH, THIN + 18)


def _w(p):
    p.diag(35, XH, 165, 0, THIN + 14); p.diag(165, 0, 285, XH * 0.6, THIN + 12)
    p.diag(285, XH * 0.6, 405, 0, THIN + 12); p.diag(405, 0, 535, XH, THIN + 14)


def _x(p):
    p.diag(60, XH, 400, 0, THIN + 18); p.diag(60, 0, 400, XH, THIN + 18)


def _y(p):
    p.diag(55, XH, 250, 0, THIN + 18); p.diag(430, XH, 190, -170, THIN + 18)


def _z(p):
    p.hbar(60, 400, XH, THIN + 14); p.diag(380, XH, 80, 0, THIN + 14); p.hbar(60, 400, 0, THIN + 14)


# ---- rakamlar ----
def _0(p):
    p.ring(250, CAP / 2, 175, CAP / 2 - 25, STEM - 6)
    p.diag(160, CAP * 0.22, 340, CAP * 0.78, THIN - 8)


def _1(p):
    p.bar(260, 0, CAP, STEM - 6); p.diag(120, CAP * 0.78, 260, CAP, THIN + 8)
    p.hbar(110, 410, 0, THIN + 6)


def _2(p):
    # v4: ring() ile yay cizimi kucuk puntoda guvenilmez cikti.
    # DUZ PARCALARLA net bir "2": omuz -> sag dikey -> kosegen -> taban.
    w = STEM - 14
    p.diag(105, CAP*0.80, 205, CAP, w)          # sol omuz (yukari egik)
    p.hbar(205, 360, CAP - w/2, w)              # tepe duzlugu
    p.diag(360, CAP, 425, CAP*0.74, w)          # sag omuz (asagi egik)
    p.bar(425 - w/2, CAP*0.56, CAP*0.74, w)     # kisa sag dikey
    p.diag(425, CAP*0.58, 112, w*0.9, w)        # uzun kosegen inis
    p.hbar(95, 440, w/2, w)                     # taban


def _3(p):
    # v4: duz parcalarla iki "kavis". Sag tarafta dikeyler var,
    # sol tarafta acik -> gercek 3 silueti (E ile karismaz).
    w = STEM - 14
    p.diag(100, CAP*0.82, 200, CAP, w)          # ust sol omuz
    p.hbar(200, 380, CAP - w/2, w)              # ust duzluk
    p.diag(380, CAP, 425, CAP*0.72, w)          # ust sag inis
    p.bar(425 - w/2, CAP*0.54, CAP*0.72, w)     # ust sag dikey
    p.hbar(215, 425, CAP*0.50, w)               # bel (ortada, saga bagli)
    p.bar(425 - w/2, CAP*0.20, CAP*0.50, w)     # alt sag dikey
    p.diag(380, w*0.9, 425, CAP*0.24, w)        # alt sag cikis
    p.hbar(200, 380, w/2, w)                    # alt duzluk
    p.diag(100, CAP*0.18, 200, w*0.9, w)        # alt sol omuz


def _4(p):
    p.diag(330, CAP, 70, CAP * 0.28, THIN + 14); p.hbar(70, 450, CAP * 0.28, THIN + 14)
    p.bar(340, 0, CAP, STEM - 12)


def _5(p):
    w = STEM - 10
    p.hbar(95, 425, CAP - w/2, w)              # ust
    p.bar(95 + w/2, CAP*0.50, CAP - w, w)      # sol ust dikey
    p.hbar(95, 420, CAP*0.50, w)               # bel
    p.bar(420 - w/2, w, CAP*0.52, w)           # sag alt dikey
    p.hbar(95, 420, w/2, w)                    # alt


def _6(p):
    p.ring(250, CAP * 0.3, 175, 165, THIN + 18)
    p.ring(300, CAP * 0.62, 210, 200, THIN + 12, a0=1.5, a1=3.0)


def _7(p):
    p.hbar(70, 450, CAP, STEM - 14); p.diag(430, CAP, 180, 0, THIN + 18)


def _8(p):
    p.ring(250, CAP * 0.73, 145, 138, THIN + 14)
    p.ring(250, CAP * 0.27, 175, 165, THIN + 16)


def _9(p):
    p.ring(250, CAP * 0.7, 175, 165, THIN + 18)
    p.ring(200, CAP * 0.38, 210, 200, THIN + 12, a0=4.7, a1=6.2)


# ---- noktalama / semboller ----
def _period(p):  p.ring(110, 55, 12, 12, 86, n=10)
def _comma(p):
    p.ring(120, 55, 12, 12, 86, n=10); p.diag(120, 30, 60, -130, THIN)
def _colon(p):
    p.ring(110, 55, 12, 12, 86, n=10); p.ring(110, XH - 55, 12, 12, 86, n=10)
def _semi(p):
    p.ring(120, XH - 55, 12, 12, 86, n=10)
    p.ring(120, 55, 12, 12, 86, n=10); p.diag(120, 30, 60, -130, THIN)
def _excl(p):
    p.poly([(95, 190), (185, 190), (205, CAP), (75, CAP)]); p.ring(140, 55, 12, 12, 86, n=10)
def _quest(p):
    w = THIN + 16
    p.hbar(85, 355, CAP - w/2, w)              # ust
    p.bar(355 - w/2, CAP*0.52, CAP - w, w)     # sag dikey
    p.hbar(215, 355, CAP*0.52, w)              # ice donus
    p.bar(220, CAP*0.20, CAP*0.52, w)          # govde asagi
    p.ring(220, 58, 13, 13, 92, n=12)          # nokta
def _hyphen(p): p.hbar(60, 340, XH * 0.52, THIN + 10)
def _endash(p): p.hbar(40, 460, XH * 0.52, THIN + 4)
def _emdash(p): p.hbar(20, 680, XH * 0.52, THIN + 4)
def _under(p):  p.hbar(20, 480, -110, THIN + 6)
def _slash(p):  p.diag(60, -60, 400, CAP, THIN + 14)
def _bslash(p): p.diag(60, CAP, 400, -60, THIN + 14)
def _lparen(p): p.ring(330, CAP * 0.4, 250, 400, THIN + 6, a0=2.3, a1=4.0)
def _rparen(p): p.ring(30, CAP * 0.4, 250, 400, THIN + 6, a0=-0.85, a1=0.85)
def _lbracket(p):
    p.bar(140, -80, CAP, THIN + 10); p.hbar(140, 330, CAP, THIN + 10); p.hbar(140, 330, -80, THIN + 10)
def _rbracket(p):
    p.bar(300, -80, CAP, THIN + 10); p.hbar(110, 300, CAP, THIN + 10); p.hbar(110, 300, -80, THIN + 10)
def _quote(p):
    p.diag(120, CAP, 90, CAP - 190, THIN + 4); p.diag(260, CAP, 230, CAP - 190, THIN + 4)
def _apos(p):   p.diag(120, CAP, 90, CAP - 190, THIN + 4)
def _plus(p):
    p.hbar(60, 440, XH * 0.55, THIN + 8); p.bar(250, XH * 0.55 - 190, XH * 0.55 + 190, THIN + 8)
def _equal(p):
    p.hbar(60, 440, XH * 0.36, THIN + 6); p.hbar(60, 440, XH * 0.74, THIN + 6)
def _star(p):
    import math
    for i in range(5):
        a = -1.5708 + i * 1.2566
        p.diag(250, XH * 0.6, 250 + math.cos(a) * 200, XH * 0.6 + math.sin(a) * 200, THIN)
def _percent(p):
    p.ring(140, CAP * 0.74, 95, 90, THIN + 6); p.ring(400, CAP * 0.24, 95, 90, THIN + 6)
    p.diag(90, 0, 450, CAP, THIN + 4)
def _amp(p):
    p.ring(220, CAP * 0.74, 135, 128, THIN + 12)
    p.ring(230, CAP * 0.25, 175, 165, THIN + 14, a0=0.5, a1=4.4)
    p.diag(260, CAP * 0.34, 470, 0, THIN + 10)
def _at(p):
    p.ring(250, CAP * 0.45, 230, 230, THIN, a0=0.5, a1=5.9)
    p.ring(250, CAP * 0.45, 105, 105, THIN + 6)
    p.bar(355, CAP * 0.2, CAP * 0.6, THIN + 6)
def _hash(p):
    p.bar(180, 0, CAP, THIN); p.bar(340, 0, CAP, THIN)
    p.hbar(60, 460, CAP * 0.32, THIN); p.hbar(60, 460, CAP * 0.68, THIN)
def _tl(p):   # Turk Lirasi
    p.bar(230, 0, CAP, STEM - 16); p.diag(230, CAP * 0.55, 430, CAP * 0.78, THIN + 8)
    p.hbar(90, 400, CAP * 0.42, THIN + 6); p.hbar(90, 400, CAP * 0.66, THIN + 6)
def _euro(p):
    p.ring(280, CAP / 2, 185, CAP / 2 - 30, THIN + 14, a0=0.7, a1=5.58)
    p.hbar(60, 380, CAP * 0.42, THIN + 4); p.hbar(60, 380, CAP * 0.6, THIN + 4)
def _dollar(p):
    _S(p); p.bar(255, -70, CAP + 70, THIN - 14)


# aksan parcalari
def _cedilla(p, x=245):
    # v2: yay kucuk puntoda kayik gorunuyordu -> duz, kisa, net kanca
    p.bar(x, -150, -20, THIN - 10)
    p.hbar(x - 70, x, -150, THIN - 12)
def _breve(p, x=245, y=CAP + 95):
    p.ring(x, y, 120, 78, THIN - 6, a0=3.34, a1=6.08)
def _dier(p, x=245, y=CAP + 105):
    # v3: y=CAP+105 cok yuksekti, harften kopuk duruyordu -> yaklastirildi
    yy = y - 42
    p.ring(x - 78, yy, 11, 11, 76, n=10); p.ring(x + 78, yy, 11, 11, 76, n=10)
def _dot_above(p, x=150, y=CAP + 115):
    p.ring(x, y, 9, 9, 74, n=8)


GLYPHS = {}

def add(ch, width, fn):
    GLYPHS[ch] = (width, fn)

# --- buyuk harfler ---
for ch, w, f in [
    ("A",510,_A),("B",470,_B),("C",500,_C),("D",500,_D),("E",470,_E),("F",450,_F),
    ("G",520,_Gg),("H",520,_H),("I",290,_I),("J",420,_J),("K",510,_K),("L",470,_L),
    ("M",600,_M),("N",530,_N),("O",520,_O),("P",470,_P),("Q",530,_Q),("R",510,_R),
    ("S",480,_S),("T",500,_T),("U",520,_U),("V",510,_V),("W",660,_W),("X",500,_X),
    ("Y",500,_Y),("Z",500,_Z)]:
    add(ch, w, f)

# --- kucuk harfler ---
for ch, w, f in [
    ("a",470,_a),("b",470,_b),("c",430,_c),("d",480,_d),("e",450,_e),("f",340,_f),
    ("g",470,_g),("h",470,_h),("i",290,_i),("j",330,_j),("k",450,_k),("l",290,_l),
    ("m",620,_m),("n",470,_n),("o",470,_o),("p",470,_p),("q",480,_q),("r",360,_r),
    ("s",410,_s),("t",370,_t),("u",470,_u),("v",450,_v),("w",590,_w),("x",450,_x),
    ("y",460,_y),("z",440,_z)]:
    add(ch, w, f)

# --- rakamlar ---
for ch, f in [("0",_0),("1",_1),("2",_2),("3",_3),("4",_4),
              ("5",_5),("6",_6),("7",_7),("8",_8),("9",_9)]:
    add(ch, 500, f)

# --- noktalama ---
for ch, w, f in [
    (".",240,_period),(",",240,_comma),(":",240,_colon),(";",240,_semi),
    ("!",280,_excl),("?",440,_quest),("-",380,_hyphen),("_",500,_under),
    ("/",450,_slash),("\\",450,_bslash),("(",340,_lparen),(")",340,_rparen),
    ("[",380,_lbracket),("]",380,_rbracket),('"',380,_quote),("'",220,_apos),
    ("+",500,_plus),("=",500,_equal),("*",500,_star),("%",520,_percent),
    ("&",530,_amp),("#",500,_hash),("@",560,_at),("$",480,_dollar)]:
    add(ch, w, f)

add("\u2013", 500, _endash)   # –
add("\u2014", 700, _emdash)   # —
add("\u20BA", 500, _tl)       # ₺
add("\u20AC", 520, _euro)     # €

# --- TURKCE ve genisletilmis Latin ---
def mk(base_fn, *deco):
    def f(p):
        base_fn(p)
        for d in deco:
            d(p)
    return f

add("Ç", 500, mk(_C, lambda p: _cedilla(p, 255)))
add("ç", 430, mk(_c, lambda p: _cedilla(p, 245)))
add("Ğ", 520, mk(_Gg, lambda p: _breve(p, 255, CAP + 95)))
add("ğ", 470, mk(_g, lambda p: _breve(p, 245, XH + 105)))
add("İ", 290, mk(_I, lambda p: _dot_above(p, 150, CAP + 120)))
add("ı", 290, _dotless_i)
add("Ö", 520, mk(_O, lambda p: _dier(p, 255, CAP + 105)))
add("ö", 470, mk(_o, lambda p: _dier(p, 245, XH + 115)))
add("Ş", 480, mk(_S, lambda p: _cedilla(p, 250)))
add("ş", 410, mk(_s, lambda p: _cedilla(p, 230)))
add("Ü", 520, mk(_U, lambda p: _dier(p, 255, CAP + 105)))
add("ü", 470, mk(_u, lambda p: _dier(p, 245, XH + 115)))
# yaygin Avrupa aksanlari (EN/DE/FR icerik icin)
def _acute(p, x=245, y=CAP + 100): p.diag(x - 60, y - 60, x + 70, y + 70, THIN - 8)
def _grave(p, x=245, y=CAP + 100): p.diag(x - 70, y + 70, x + 60, y - 60, THIN - 8)
def _circ(p, x=245, y=CAP + 95):
    p.diag(x - 105, y - 45, x, y + 80, THIN - 10); p.diag(x, y + 80, x + 105, y - 45, THIN - 10)
def _tilde(p, x=245, y=CAP + 100):
    p.ring(x - 55, y, 60, 40, THIN - 12, a0=3.1, a1=6.2)
    p.ring(x + 55, y, 60, 40, THIN - 12, a0=0.0, a1=3.1)
for ch, base, w, d in [
    ("Á",_A,510,_acute),("À",_A,510,_grave),("Â",_A,510,_circ),("Ä",_A,510,_dier),("Ã",_A,510,_tilde),
    ("É",_E,470,_acute),("È",_E,470,_grave),("Ê",_E,470,_circ),("Ë",_E,470,_dier),
    ("Í",_I,290,lambda p:_acute(p,150)),("Î",_I,290,lambda p:_circ(p,150)),
    ("Ó",_O,520,_acute),("Ô",_O,520,_circ),("Õ",_O,520,_tilde),
    ("Ú",_U,520,_acute),("Û",_U,520,_circ),("Ñ",_N,530,_tilde)]:
    add(ch, w, mk(base, d))
for ch, base, w, d in [
    ("á",_a,470,lambda p:_acute(p,245,XH+105)),("à",_a,470,lambda p:_grave(p,245,XH+105)),
    ("â",_a,470,lambda p:_circ(p,245,XH+100)),("ä",_a,470,lambda p:_dier(p,245,XH+115)),
    ("ã",_a,470,lambda p:_tilde(p,245,XH+105)),
    ("é",_e,450,lambda p:_acute(p,245,XH+105)),("è",_e,450,lambda p:_grave(p,245,XH+105)),
    ("ê",_e,450,lambda p:_circ(p,245,XH+100)),("ë",_e,450,lambda p:_dier(p,245,XH+115)),
    ("í",_dotless_i,290,lambda p:_acute(p,150,XH+105)),("î",_dotless_i,290,lambda p:_circ(p,150,XH+100)),
    ("ó",_o,470,lambda p:_acute(p,245,XH+105)),("ô",_o,470,lambda p:_circ(p,245,XH+100)),
    ("õ",_o,470,lambda p:_tilde(p,245,XH+105)),
    ("ú",_u,470,lambda p:_acute(p,245,XH+105)),("û",_u,470,lambda p:_circ(p,245,XH+100)),
    ("ñ",_n,470,lambda p:_tilde(p,245,XH+105))]:
    add(ch, w, mk(base, d))


def build():
    order = [".notdef", "space"] + [f"u{ord(c):04X}" for c in GLYPHS]
    cmap, glyf, hmtx = {}, {}, {}

    pen = TTGlyphPen(None)
    glyf[".notdef"] = pen.glyph(); hmtx[".notdef"] = (500, 0)
    pen = TTGlyphPen(None)
    glyf["space"] = pen.glyph(); hmtx["space"] = (260, 0)
    cmap[0x20] = "space"

    for ch, (w, fn) in GLYPHS.items():
        name = f"u{ord(ch):04X}"
        p = Pen(); fn(p)
        tp = TTGlyphPen(None)
        for c in p.contours:
            tp.moveTo(c[0])
            for pt in c[1:]:
                tp.lineTo(pt)
            tp.closePath()
        glyf[name] = tp.glyph()
        hmtx[name] = (int(w + 40), 0)
        cmap[ord(ch)] = name

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyf)
    fb.setupHorizontalMetrics(hmtx)
    fb.setupHorizontalHeader(ascent=ASC, descent=DESC)
    fb.setupNameTable({
        "familyName": "STONEBREAKING",
        "styleName": "Regular",
        "uniqueFontIdentifier": "STONEBREAKING-Regular-1.0",
        "fullName": "STONEBREAKING Regular",
        "psName": "STONEBREAKING-Regular",
        "version": "Version 1.0",
        "copyright": "STONEBREAKING — Element Guardians. Tum haklari saklidir.",
        "designer": "STONEBREAKING",
        "description": "Markanin kendi yazi tipi: firca imzasi + kirik tas dili.",
    })
    fb.setupOS2(sTypoAscender=ASC, sTypoDescender=DESC, usWinAscent=ASC, usWinDescent=-DESC,
                sxHeight=XH, sCapHeight=CAP)
    fb.setupPost()

    os.makedirs("assets/font", exist_ok=True)
    ttf = "assets/font/stonebreaking.ttf"
    fb.save(ttf)

    f = TTFont(ttf); f.flavor = "woff2"
    f.save("assets/font/stonebreaking.woff2")
    f2 = TTFont(ttf); f2.flavor = "woff"
    f2.save("assets/font/stonebreaking.woff")

    print(f"glif: {len(GLYPHS)+2}")
    for x in ["ttf", "woff", "woff2"]:
        pth = f"assets/font/stonebreaking.{x}"
        print(f"  {x:5s} {os.path.getsize(pth)/1024:7.1f} KB")
    # Turkce kontrol
    eks = [c for c in "çğıİöşüÇĞÖŞÜ" if ord(c) not in cmap]
    print("Turkce eksik:", eks if eks else "yok ✓")


if __name__ == "__main__":
    build()
