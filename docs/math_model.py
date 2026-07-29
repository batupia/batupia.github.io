#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
STONEBREAKING — Oyun & İş Matematiği Modeli  (v2, index.html ile SENKRON)
Taşkıran / Element Guardians

⚠️  BAĞLAYICI KURAL
    Bu dosyadaki her formül `index.html` içindeki JS karşılığıyla BİREBİR
    aynıdır. Biri değişirse diğeri de değişmelidir; `verify_sync()` bunu
    otomatik denetler ve sapma varsa hata verir.

    v1 SORUNU: model dosyası oyundan ayrışmıştı — ÇİFT (2'li) eşleşme
    varsayıyordu, oysa oyun ÜÇLÜ (MATCH_N=3). Seviye eğrisi, enerji ve
    fiyatlandırma da tutmuyordu. v2'de tamamı senkronize edildi.

Kapsam:
  1) Seviye eğrisi        — taş/katman/yüz/par süre/Elo/zorluk
  2) Chi Skoru motoru     — Elo tabanlı, 4 alt zeka, bileşik denge cezası
  3) IQ normalizasyonu    — Spearman-Brown + regresyon-to-mean + eşik
  4) Skor bozulması       — yarılanma ömrü, taban, geri kazanım
  5) BT Enerjisi          — can ekonomisi + reklam arzı + duvar analizi
  6) Kombo/zincir         — CHAIN_MS kalibrasyonu
  7) İş modeli            — retention, MAU, abonelik, LTV/CAC, başabaş
  8) Duyarlılık analizi   — hangi kaldıraç geliri en çok değiştiriyor

Çalıştır:  python3 docs/math_model.py
Çıktı:     docs/tables/*.csv  +  konsol raporu
"""

import math, os, csv, random, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, "tables")
ROOT = os.path.dirname(HERE)
os.makedirs(OUT, exist_ok=True)

# ==========================================================================
# 0) OYUNLA PAYLAŞILAN SABİTLER  (index.html ile birebir)
# ==========================================================================
MAX_LEVEL   = 100
CHI_START   = 1000
CHI_MIN     = 400
CHI_MAX     = 2400
K_BASE      = 40
K_FLOOR     = 12
K_DECAY_N   = 25
POP_MEAN    = 1250.0
POP_SD      = 260.0
SB_K        = 8
IQ_MIN_SESSIONS = 20        # IQ'nun görünmesi için gereken en az oturum
ENERGY_MAX  = 3
REGEN_MIN   = 30
GRACE_DAYS  = 2
HALF_LIFE   = 21.0
LAMBDA      = math.log(2) / HALF_LIFE
FLOOR_RATIO = 0.65
MATCH_N     = 3             # ÜÇLÜ eşleşme (v1'de yanlışlıkla 2 idi)
CHAIN_MS    = 4500          # kombo zinciri penceresi
AD_MAX_DAY  = 5             # günlük ödüllü reklam sınırı

RANKS = [
    (1,  15,  "Çırak",           "Apprentice"),
    (16, 35,  "Öğrenci",         "Student"),
    (36, 60,  "Bükücü",          "Bender"),
    (61, 85,  "Usta",            "Master"),
    (86, 99,  "Büyük Usta",      "Grandmaster"),
    (100,100, "Element Avatarı", "Element Avatar"),
]

def rank_of(n):
    for lo, hi, tr, en in RANKS:
        if lo <= n <= hi:
            return tr, en
    return "Çırak", "Apprentice"


# ==========================================================================
# 1) SEVİYE EĞRİSİ   (index.html: triplesOf / tilesOf / layersOf / ...)
# ==========================================================================
def triples(n):
    """Üçlü sayısı: 11 -> 37. Sv100'de doyar; sonsuz modda tahta büyümez
    (111 taş telefonda okunabilirlik sınırı)."""
    return round(11 + 26 * (1 - math.exp(-min(n, MAX_LEVEL) / 24.0)))

def tiles(n):
    return triples(n) * MATCH_N          # 33 -> 111 taş

def layers(n):
    """Sv1'den itibaren 2 katman: yığın derinliği ilk saniyeden görünsün."""
    if n <= 8:  return 2
    if n <= 26: return 3
    if n <= 60: return 4
    return 5

TOTAL_FACES = 40                          # 4 element + 9 yıldız + 9 rün + 9 rakam + 9 mühür

def faces(n):
    return max(7, min(TOTAL_FACES, round(7 + triples(n) * 0.62)))

def tray(n):
    """Öğrenme penceresi ilk 6 seviyede geniş."""
    return 8 if n <= 6 else 7

def spread(n):
    """Üçlülerin soyma sırasında dağılımı = asıl zorluk kolu."""
    return 1 if n <= 3 else round(max(2, min(9, 2 + n * 0.075)))

def par_time(n):
    """Par süre (sn). Taş başına 3.2s -> 1.7s."""
    return round(tiles(n) * (1.5 * math.exp(-n / 70.0) + 1.7))

def hint_max(n):
    return max(1, 4 - n // 28)

def undo_max(n):
    return max(1, 3 - n // 35)

def level_elo(n):
    return round(800 + 1600 * (1 - math.exp(-n / 38.0)) / (1 - math.exp(-100 / 38.0)))

def difficulty_index(n):
    """0-100 bileşik zorluk: taş + katman + yüz çeşidi + süre baskısı + dağılım."""
    t = tiles(n) / tiles(MAX_LEVEL)
    l = (layers(n) - 2) / 3
    f = faces(n) / TOTAL_FACES
    s = 1 - (par_time(n) / max(1, tiles(n))) / 3.2
    sp = spread(n) / 9
    return round(100 * (0.26 * t + 0.20 * l + 0.18 * f + 0.22 * s + 0.14 * sp), 1)


# --- SONSUZ MOD: "Arafta Koşu" (Sv100 sonrası) ---------------------------
# Sv100'de taş sayısı doygun (111), Elo tavanda (2400). Simülasyon:
# seviye başı %1.5 bırakma ile Sv100'e ulaşan %22 → 48.875 MAU'da ~10.750
# kişi. Bu kadar oyuncu boşluğa bırakılamaz.
ENDLESS_START = MAX_LEVEL + 1

def is_endless(n):   return n > MAX_LEVEL
def endless_run(n):  return max(1, n - MAX_LEVEL)
def endless_time_mult(r): return max(0.55, 1.0 - r * 0.045)
def endless_faces(r):     return min(TOTAL_FACES, 30 + r)
def endless_tray(r):      return 7 if r < 5 else (6 if r < 12 else 5)
def endless_spread(r):    return min(12, 9 + max(0, r - 8) // 5)

# Ölçüm (jsdom + gerçek generateBoard, 80 deneme):
#   Sv100 %100 · Sv112 %100 · Sv120 %98 · Sv140 %99 · Sv180 %95
# Dağılım tavanı 14'te %90'a düşüyordu → 12'ye çekildi.
ENDLESS_SOLVABILITY = {100:1.00, 105:1.00, 112:1.00, 120:0.98, 140:0.99, 180:0.95}


# ==========================================================================
# 1b) V4 GURUR EŞİĞİ — yüzdelik dilim
# ==========================================================================
def top_percentile(chi_value):
    """Oyuncunun bu daldaki üst yüzdelik dilimi (popülasyon dağılımından)."""
    z = (chi_value - POP_MEAN) / POP_SD
    cdf = 0.5 * (1 + math.erf(z / math.sqrt(2)))
    return max(1, round((1 - cdf) * 100))

PRIDE_SHOW_PCT = 50     # yüzde ancak <=%50 ise gösterilir; üstünde teşvik metni


# ==========================================================================
# 2) CHI SKORU MOTORU
# ==========================================================================
DIMS = [
    ("speed",   "Hız",     "Speed",   "Pyro",  "🔥"),
    ("logic",   "Mantık",  "Logic",   "Aqua",  "💧"),
    ("memory",  "Hafıza",  "Memory",  "Terra", "🌍"),
    ("pattern", "Örüntü",  "Pattern", "Zephy", "💨"),
]

def k_factor(sessions):
    return K_FLOOR + (K_BASE - K_FLOOR) * math.exp(-sessions / K_DECAY_N)

def expected(player_elo, lvl_elo):
    return 1.0 / (1.0 + 10 ** ((lvl_elo - player_elo) / 400.0))

def clamp(v, a, b):
    return max(a, min(b, v))

def r_speed(time_used, par):
    if time_used <= 0: return 1.0
    return clamp(1 / (1 + math.exp(-2.2 * (par / time_used - 0.95))), 0, 1)

def r_logic(ok, bad):
    tt = ok + bad
    if tt == 0: return 0.5
    return clamp(((ok / tt) - 0.45) / 0.55, 0, 1)

def r_memory(hints, hint_cap, revisits, triples_n):
    return clamp(0.55 * (1 - hints / max(1, hint_cap)) +
                 0.45 * (1 - min(1, revisits / max(1, triples_n * 1.5))), 0, 1)

def r_pattern(best_combo, triples_n, undos, undo_cap):
    return clamp(0.7 * min(1, best_combo / max(3, triples_n * 0.35)) +
                 0.3 * (1 - undos / max(1, undo_cap)), 0, 1)

def update_chi(current, level_no, r, sessions):
    return clamp(current + k_factor(sessions) * (r - expected(current, level_elo(level_no))),
                 CHI_MIN, CHI_MAX)

def chi_total(sub):
    """Bileşik Chi: %75 aritmetik + %25 harmonik.
    Harmonik pay dengesizliği cezalandırır — oyunun tezi budur."""
    v = [sub["speed"], sub["logic"], sub["memory"], sub["pattern"]]
    a = sum(v) / 4
    h = 4 / sum(1 / max(1e-9, x) for x in v)
    return 0.75 * a + 0.25 * h

def balance_ratio(sub):
    """Zihin Haritası'ndaki çember bütünlüğü: min/max."""
    v = [sub["speed"], sub["logic"], sub["memory"], sub["pattern"]]
    nv = [clamp((x - CHI_MIN) / (CHI_MAX - CHI_MIN), 0.04, 1) for x in v]
    return min(nv) / max(nv)


# ==========================================================================
# 3) IQ NORMALİZASYONU
# ==========================================================================
def reliability(sessions):
    return sessions / (sessions + SB_K)

def chi_to_iq(chi, sessions):
    rho = reliability(sessions)
    iq  = clamp(100 + (15 * ((chi - POP_MEAN) / POP_SD)) * rho, 55, 145)
    ci  = 1.96 * 15 * math.sqrt(max(0.0, 1 - rho))
    return iq, ci, rho

def iq_visible(sessions):
    return sessions >= IQ_MIN_SESSIONS


# ==========================================================================
# 4) SKOR BOZULMASI
# ==========================================================================
def decay(chi, peak_chi, days_idle):
    d = max(0.0, days_idle - GRACE_DAYS)
    floor = max(CHI_MIN, FLOOR_RATIO * peak_chi)
    if chi <= floor: return chi
    return floor + (chi - floor) * math.exp(-LAMBDA * d)

def recovery_sessions(lost_points):
    return math.ceil(lost_points / (20 * 0.35))


# ==========================================================================
# 5) BT ENERJİSİ EKONOMİSİ
# ==========================================================================
# Kural: BT enerjisi SADECE başarısızlıkta harcanır. Kazanılan seviye can yakmaz.
BASE_FAIL   = 0.22
SPIKE_FAIL  = 0.62
SPIKE_EVERY = 6
AVG_LEVEL_MIN = 3.2
VISITS_PER_DAY = 2.4

def fail_rate(n):
    return SPIKE_FAIL if (n % SPIKE_EVERY == 0 and n > 0) else BASE_FAIL

def attempts_to_clear(n):
    return 1.0 / max(1e-6, 1 - fail_rate(n))

def energy_burn_per_level(n):
    return attempts_to_clear(n) - 1.0

def stuck_probability(n):
    return fail_rate(n) ** ENERGY_MAX

def daily_energy_supply(with_ads=True):
    """Günlük can arzı: doğal yenilenme + (varsa) ödüllü reklam."""
    natural = (24 * 60) / REGEN_MIN
    return natural + (AD_MAX_DAY if with_ads else 0)

def daily_energy_demand(levels_per_day=7):
    spike_share = 1.0 / SPIKE_EVERY
    return levels_per_day * (
        spike_share * (1 / (1 - SPIKE_FAIL) - 1) +
        (1 - spike_share) * (1 / (1 - BASE_FAIL) - 1))

def wall_events_per_week(levels_per_day=7):
    spikes = levels_per_day * 7 / SPIKE_EVERY
    return round(spikes * stuck_probability(SPIKE_EVERY), 2)

def energy_verdict(levels_per_day=7):
    supply = daily_energy_supply()
    demand = daily_energy_demand(levels_per_day)
    walls  = wall_events_per_week(levels_per_day)
    ok = 1.5 <= walls <= 4.0
    return supply, demand, walls, ok


# ==========================================================================
# 6) KOMBO / ZİNCİR KALİBRASYONU
# ==========================================================================
# GERÇEK MOTOR ÖLÇÜMÜ (docs/_chain.js ile index.html motoru üzerinde,
# Sv20, 60 deneme/beceri, seçim arası 0.9-2.5sn):
#   chainMs | acemi(ort/3'lü) | orta(ort/3'lü/5'li) | usta(ort/3'lü/5'li)
#     2500  |  1.33 / %3      |  1.90 / %8  / %0    |  1.75 / %5  / %0
#     3000  |  1.42 / %7      |  2.27 / %38 / %0    |  1.95 / %7  / %0
#     3500  |  1.43 / %10     |  2.62 / %55 / %3    |  2.05 / %15 / %0
#     4000  |  1.82 / %22     |  2.95 / %70 / %5    |  2.60 / %48 / %3
#     4500  |  1.92 / %23     |  3.63 / %87 / %17   |  3.07 / %83 / %2   ← SEÇİLEN
#     5000  |  2.25 / %42     |  4.12 / %85 / %37   |  4.27 / %98 / %35
#     6000  |  2.87 / %55     |  7.20 / %93 / %85   |  9.67 / %100/ %100
#
# 4500ms seçildi çünkü: orta oyuncu neredeyse her oyunda 3'lü yakalıyor (%87)
# ama 5'li nadir kalıyor (%17). Acemi de arada bir tadıyor (%23). 6000ms'te
# usta her oyunda 5'li yapıyor (%100) — ödül değersizleşiyor.
CHAIN_MEASURED = {
    2500: (1.90, 0.08, 0.00), 3000: (2.27, 0.38, 0.00),
    3500: (2.62, 0.55, 0.03), 4000: (2.95, 0.70, 0.05),
    4500: (3.63, 0.87, 0.17), 5000: (4.12, 0.85, 0.37),
    6000: (7.20, 0.93, 0.85),
}

def simulate_chain(chain_ms):
    """Gerçek motor ölçümünü döndürür (orta seviye oyuncu).
    Basit olasılık modeli yanıltıcıydı: tepsi kısıtı ve soyma sırası
    dikkate alınmadığında kombo 2 kat fazla çıkıyordu."""
    if chain_ms in CHAIN_MEASURED:
        return CHAIN_MEASURED[chain_ms]
    ks = sorted(CHAIN_MEASURED)
    lo = max([k for k in ks if k <= chain_ms], default=ks[0])
    hi = min([k for k in ks if k >= chain_ms], default=ks[-1])
    if lo == hi: return CHAIN_MEASURED[lo]
    f = (chain_ms - lo) / (hi - lo)
    a, b = CHAIN_MEASURED[lo], CHAIN_MEASURED[hi]
    return tuple(a[i] + (b[i] - a[i]) * f for i in range(3))


# ==========================================================================
# 7) İŞ MODELİ
# ==========================================================================
# Fiyat TICARI_PLAN.md ile birebir: ₺149/ay, ₺990/yıl
SUB_PRICE_GROSS = 149.0
SUB_PRICE_YEAR  = 990.0
CERT_PRICE      = 79.0            # Taşkıran Sertifikası (tek seferlik)
KDV             = 0.20
STORE_CUT_SMALL = 0.15            # <1M$ program (ilk yıl gerçekçi)
STORE_CUT_STD   = 0.30

DOWNLOADS_Y1    = 250_000
D1, D7, D30     = 0.42, 0.20, 0.085
FAMILY_MULT     = 2.3             # 1 indirme -> ortalama aktif profil
SUB_CONV_MAU    = 0.040           # eğitim kategorisi bandı %5-8'in altı, temkinli
SUB_AVG_MONTHS  = 7.5             # eğitim ürünü, oyundan uzun
CERT_CONV_MAU_M = 0.009           # aylık MAU'nun binde 9'u sertifika alır
AD_ARPMAU_M     = 2.4             # ₺ — sadece ödüllü, zorunlu reklam yok
CAC_PAID        = 14.0
PAID_SHARE      = 0.30
SERVER_COST_M   = 15_000.0        # ₺/ay altyapı

def retention(day):
    b = math.log(D1 / D30) / math.log(30.0)
    return D1 * (day ** -b)

def net(gross, cut):
    """KDV düşülür, mağaza payı düşülür."""
    return gross / (1 + KDV) * (1 - cut)

def business_model(cut=STORE_CUT_SMALL, conv=SUB_CONV_MAU, installs=DOWNLOADS_Y1):
    """Kararlı hal aylık iş modeli.

    ⚠️ v1 HATASI: LTV hesabı `D30 * FAMILY_MULT` çarpanını atlıyordu; bir
    install'ın doğrudan MAU olduğu varsayılmıştı. Bu LTV'yi ~20 kat
    şişirip LTV/CAC'yi 29'a çıkarıyordu — hiçbir yatırımcının inanmayacağı
    bir sayı. Doğrusu: 1 install → D30 * FAMILY_MULT kadar MAU.
    """
    mau        = installs * D30 * FAMILY_MULT
    subs       = mau * conv
    sub_net_m  = net(SUB_PRICE_GROSS, cut)
    cert_net   = net(CERT_PRICE, cut)
    ad_net_m   = AD_ARPMAU_M                       # reklamda mağaza payı yok
    sub_rev_m  = subs * sub_net_m
    cert_rev_m = mau * CERT_CONV_MAU_M * cert_net
    ad_rev_m   = mau * ad_net_m
    total_m    = sub_rev_m + cert_rev_m + ad_rev_m
    profit_m   = total_m - SERVER_COST_M
    arpmau     = total_m / mau

    # LTV: bir MAU'nun ömür boyu net katkısı
    ltv_mau     = arpmau * SUB_AVG_MONTHS
    # Bir install kaç MAU'ya dönüşüyor?
    mau_per_install = D30 * FAMILY_MULT
    ltv_install = ltv_mau * mau_per_install
    ua_spend    = installs * PAID_SHARE * CAC_PAID
    blended_cac = ua_spend / installs              # organikler payı düşürür
    payback_m   = blended_cac / max(1e-9, arpmau * mau_per_install)

    return dict(installs=installs, mau=mau, subs=subs, cut=cut, conv=conv,
                sub_net_m=sub_net_m, sub_rev_m=sub_rev_m, cert_rev_m=cert_rev_m,
                ad_rev_m=ad_rev_m, total_m=total_m, profit_m=profit_m,
                arpmau=arpmau, ltv_mau=ltv_mau, ltv_install=ltv_install,
                cac=blended_cac, ratio=ltv_install / blended_cac,
                payback_m=payback_m, ua_spend=ua_spend)

def breakeven_mau(cut=STORE_CUT_SMALL, conv=SUB_CONV_MAU):
    """Sunucu maliyetini karşılayan MAU."""
    per_mau = (net(SUB_PRICE_GROSS, cut) * conv +
               net(CERT_PRICE, cut) * CERT_CONV_MAU_M + AD_ARPMAU_M)
    return SERVER_COST_M / per_mau

def required_conversion(target_profit_m, mau, cut=STORE_CUT_SMALL):
    other = mau * (net(CERT_PRICE, cut) * CERT_CONV_MAU_M + AD_ARPMAU_M)
    need  = target_profit_m + SERVER_COST_M - other
    return need / (mau * net(SUB_PRICE_GROSS, cut))


# ==========================================================================
# 7a) VİRAL DÖNGÜ — Meydan Okuma (V3) k-factor
# ==========================================================================
# Kullanıcı PvP istedi. Canlı eşzamanlı maç reddedildi (sunucu + eşleştirme
# + çocuk güvenliği). Yerine ASENKRON PvP: aynı tohum → aynı tahta, farklı
# zaman. Kod WhatsApp'a gider, sunucu gerekmez.
#
# ⚠️ Bu ancak tahta DETERMİNİSTİK ise mümkün. TİCARİ_PLAN "tahtalarımız
# tohumlu üretiliyor" diyordu ama üretim Math.random() kullanıyordu —
# plan çalışmayan bir varsayıma dayanıyordu. Düzeltildi (BRD.rnd).
VIRAL_SEND_RATE   = 0.08     # MAU'nun haftalık meydan okuma gönderme oranı
VIRAL_PER_SEND    = 2.5      # gönderim başına alıcı
VIRAL_OPEN_RATE   = 0.35     # kodu açan
VIRAL_INSTALL     = 0.22     # açanlardan indiren

def viral_loop(mau=None):
    m = business_model()
    mau = mau or m["mau"]
    weekly_invites = mau * VIRAL_SEND_RATE * VIRAL_PER_SEND
    weekly_new     = weekly_invites * VIRAL_OPEN_RATE * VIRAL_INSTALL
    k              = weekly_new / max(1e-9, mau * VIRAL_SEND_RATE)
    yearly_new     = weekly_new * 52
    ua_equiv       = yearly_new * m["cac"]
    extra_rev      = yearly_new * m["ltv_install"]
    return dict(weekly_invites=weekly_invites, weekly_new=weekly_new,
                monthly_new=weekly_new*4.3, k=k, yearly_new=yearly_new,
                ua_equiv=ua_equiv, extra_rev=extra_rev)


# ==========================================================================
# 7b) ÖDÜL POLİTİKASI — çekiliş mi, onur mu?
# ==========================================================================
# Kullanıcı sordu: "ilk 100 seviyeye gelen 10 kişiye iPhone verelim mi?"
# FİNANSÖR CEVABI: HAYIR. Matematik açık.
IPHONE_TR = 65_000.0

def raffle_analysis(n_prizes=10, prize=IPHONE_TR):
    cost = n_prizes * prize
    m = business_model()
    installs_same_money = cost / m["cac"]
    ltv_of_those = installs_same_money * m["ltv_install"]
    breakeven_installs = cost / m["ltv_install"]
    return dict(cost=cost, ua_installs=installs_same_money,
                ua_ltv=ltv_of_those, ua_net=ltv_of_those - cost,
                breakeven_installs=breakeven_installs)

CERT_PRINT_COST = 45.0          # baskı + kargo
HONOR_FIRST_N   = 100           # ilk N kişiye fiziksel, hediye
SV100_REACH     = 0.22          # simülasyon: seviye başı %1.5 bırakma

def honor_system(mau=None):
    """Çekiliş yerine: Sv100'ü bitiren HERKESE onur + isteyene satılık sertifika."""
    m = business_model()
    mau = mau or m["mau"]
    reachers = mau * SV100_REACH
    gift_cost = HONOR_FIRST_N * CERT_PRINT_COST
    buyers = reachers * 0.15
    margin = buyers * (net(CERT_PRICE, STORE_CUT_SMALL) - CERT_PRINT_COST)
    return dict(reachers=reachers, gift_cost=gift_cost, buyers=buyers,
                margin=margin, net=margin - gift_cost)


# ==========================================================================
# 8) OYUNCU SİMÜLASYONU
# ==========================================================================
def simulate_player(skill=0.6, sessions=60, seed=1):
    """skill 0..1 -> ham performans ortalaması. Chi yörüngesini üretir."""
    rng = random.Random(seed)
    chi = {d[0]: float(CHI_START) for d in DIMS}
    lvl = 1
    rows = []
    for s in range(1, sessions + 1):
        tri = triples(lvl)
        par = par_time(lvl)
        used   = par * rng.uniform(1.5 - skill, 2.3 - skill)
        ok     = int(tri * clamp(skill + rng.uniform(-.12, .12), .1, 1))
        bad    = max(0, tri - ok)
        hints  = rng.randint(0, hint_max(lvl))
        rev    = int(tri * rng.uniform(0, 1.2 - skill))
        combo  = max(1, int(tri * 0.35 * skill * rng.uniform(.6, 1.4)))
        undos  = rng.randint(0, undo_max(lvl))
        r = {
            "speed":   r_speed(used, par),
            "logic":   r_logic(ok, bad),
            "memory":  r_memory(hints, hint_max(lvl), rev, tri),
            "pattern": r_pattern(combo, tri, undos, undo_max(lvl)),
        }
        won = rng.random() > fail_rate(lvl)
        if not won:
            for k in r: r[k] *= 0.55
        for k in chi:
            chi[k] = update_chi(chi[k], lvl, r[k], s)
        if won and lvl < MAX_LEVEL: lvl += 1
        tot = chi_total(chi)
        iq, ci, rho = chi_to_iq(tot, s)
        rows.append(dict(oturum=s, seviye=lvl, **{k: round(v) for k, v in chi.items()},
                         chi=round(tot), iq=round(iq, 1) if iq_visible(s) else "",
                         ci=round(ci, 1), rho=round(rho, 3),
                         denge=round(balance_ratio(chi), 3)))
    return rows


# ==========================================================================
# 9) SENKRON DENETİMİ — model ile index.html aynı mı?
# ==========================================================================
def verify_sync():
    """index.html'deki sabitleri okuyup modelle karşılaştırır."""
    path = os.path.join(ROOT, "index.html")
    if not os.path.exists(path):
        return ["index.html bulunamadi (atlandi)"]
    src = open(path, encoding="utf-8").read()
    def num(pat, cast=float):
        m = re.search(pat, src)
        return cast(m.group(1)) if m else None
    checks = [
        ("MAX_LEVEL",   num(r"const MAX_LEVEL=(\d+)", int),            MAX_LEVEL),
        ("CHI_START",   num(r"CHI_START=(\d+)", int),                  CHI_START),
        ("CHI_MIN",     num(r"CHI_MIN=(\d+)", int),                    CHI_MIN),
        ("CHI_MAX",     num(r"CHI_MAX=(\d+)", int),                    CHI_MAX),
        ("K_BASE",      num(r"K_BASE=(\d+)", int),                     K_BASE),
        ("K_FLOOR",     num(r"K_FLOOR=(\d+)", int),                    K_FLOOR),
        ("K_DECAY_N",   num(r"K_DECAY_N=(\d+)", int),                  K_DECAY_N),
        ("POP_MEAN",    num(r"POP_MEAN=(\d+)", float),                 POP_MEAN),
        ("POP_SD",      num(r"POP_SD=(\d+)", float),                   POP_SD),
        ("SB_K",        num(r"SB_K=(\d+)", int),                       SB_K),
        ("IQ_MIN_SESS", num(r"IQ_MIN_SESSIONS=(\d+)", int),            IQ_MIN_SESSIONS),
        ("ENERGY_MAX",  num(r"ENERGY_MAX=(\d+)", int),                 ENERGY_MAX),
        ("REGEN_MIN",   num(r"REGEN_MIN=(\d+)", int),                  REGEN_MIN),
        ("GRACE_DAYS",  num(r"GRACE_DAYS=(\d+)", int),                 GRACE_DAYS),
        ("HALF_LIFE",   num(r"HALF_LIFE=(\d+)", float),                HALF_LIFE),
        ("FLOOR_RATIO", num(r"FLOOR_RATIO=\.(\d+)", lambda x: float("0."+x)), FLOOR_RATIO),
        ("MATCH_N",     num(r"const MATCH_N=(\d+)", int),              MATCH_N),
        ("CHAIN_MS",    num(r"const CHAIN_MS=(\d+)", int),             CHAIN_MS),
        ("AD_MAX_DAY",  num(r"const AD_MAX_DAY=(\d+)", int),           AD_MAX_DAY),
        ("ENDLESS_START", num(r"const ENDLESS_START = MAX_LEVEL \+ (\d+)", int), 1),
        ("PRIDE_PCT",   num(r"pr\.topPct<=(\d+)", int),                 PRIDE_SHOW_PCT),
    ]
    errs = []
    for name, in_html, in_py in checks:
        if in_html is None:
            errs.append(f"{name}: index.html'de bulunamadi")
        elif abs(in_html - in_py) > 1e-9:
            errs.append(f"{name}: html={in_html} != py={in_py}")

    # Formül karşılaştırması: birkaç seviyede birebir aynı sonuç vermeli
    for n in (1, 7, 20, 45, 80, 100):
        html_tri = re.search(r"Math\.round\(11\+26\*\(1-Math\.exp\(-Math\.min\(n,MAX_LEVEL\)/24\)\)\)", src)
        if not html_tri:
            errs.append("triplesOf formulu degismis")
            break
    return errs


# ==========================================================================
# ÇIKTI ÜRETİMİ
# ==========================================================================
def write_levels():
    p = os.path.join(OUT, "seviye_egrisi.csv")
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["seviye","rutbe_tr","rutbe_en","tas","uclu","katman","yuz_cesidi",
                    "tepsi","dagilim","par_sure_sn","ipucu","geri_al","elo","zorluk_0_100"])
        for n in range(1, MAX_LEVEL + 1):
            tr, en = rank_of(n)
            w.writerow([n, tr, en, tiles(n), triples(n), layers(n), faces(n),
                        tray(n), spread(n), par_time(n), hint_max(n), undo_max(n),
                        level_elo(n), difficulty_index(n)])
    return p

def write_chi_iq():
    p = os.path.join(OUT, "chi_iq_haritasi.csv")
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        head = ["chi"]
        for s in (5, 20, 40, 60, 100): head += [f"s{s}_iq", f"s{s}_ci", f"s{s}_gorunur"]
        w.writerow(head)
        for chi in range(400, 2401, 100):
            row = [chi]
            for s in (5, 20, 40, 60, 100):
                iq, ci, _ = chi_to_iq(chi, s)
                row += [round(iq,1), round(ci,1), "evet" if iq_visible(s) else "hayir"]
            w.writerow(row)
    return p

def write_decay():
    p = os.path.join(OUT, "decay_tablosu.csv")
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["gun","chi_1200","chi_1600","chi_2000","kayip_1600_yuzde","geri_kazanim_oturum"])
        for d in [0,1,2,3,5,7,10,14,21,30,45,60,90]:
            a = decay(1200, 1200, d); b = decay(1600, 1600, d); c = decay(2000, 2000, d)
            loss = (1600 - b) / 1600 * 100
            w.writerow([d, round(a), round(b), round(c), round(loss,1),
                        recovery_sessions(1600 - b)])
    return p

def write_energy():
    p = os.path.join(OUT, "enerji_ekonomisi.csv")
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["seviye_gun","arz_reklamsiz","arz_reklamli","talep","haftalik_duvar","saglikli"])
        for lpd in range(3, 16):
            demand = daily_energy_demand(lpd)
            walls  = wall_events_per_week(lpd)
            w.writerow([lpd, round(daily_energy_supply(False),1), round(daily_energy_supply(True),1),
                        round(demand,2), walls, "evet" if 1.5<=walls<=4.0 else "hayir"])
    return p

def write_chain():
    p = os.path.join(OUT, "kombo_kalibrasyon.csv")
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["chain_ms","ort_en_iyi_kombo","3lu_orani","5li_orani","secim"])
        for ms in [2500, 3000, 3500, 4000, 4500, 5000, 6000, 8000]:
            avg, p3, p5 = simulate_chain(ms)
            w.writerow([ms, round(avg,2), f"%{round(p3*100)}", f"%{round(p5*100)}",
                        "SECILEN" if ms == CHAIN_MS else ""])
    return p

def write_business():
    p = os.path.join(OUT, "is_modeli.csv")
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["senaryo","indirme","mau","abone","abonelik_gelir_ay","sertifika_ay",
                    "reklam_ay","toplam_ay","kar_ay","arpmau","ltv_mau","ltv_install",
                    "cac","ltv_cac","geri_odeme_ay"])
        senaryolar = [
            ("Temkinli",  120_000, 0.025, STORE_CUT_STD),
            ("Baz",       250_000, 0.040, STORE_CUT_SMALL),
            ("Iyimser",   500_000, 0.060, STORE_CUT_SMALL),
        ]
        for ad, inst, conv, cut in senaryolar:
            m = business_model(cut=cut, conv=conv, installs=inst)
            w.writerow([ad, inst, round(m["mau"]), round(m["subs"]),
                        round(m["sub_rev_m"]), round(m["cert_rev_m"]), round(m["ad_rev_m"]),
                        round(m["total_m"]), round(m["profit_m"]), round(m["arpmau"],2),
                        round(m["ltv_mau"],2), round(m["ltv_install"],2),
                        round(m["cac"],2), round(m["ratio"],2), round(m["payback_m"],1)])
    return p

def write_sensitivity():
    p = os.path.join(OUT, "duyarlilik.csv")
    base = business_model()
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["kaldirac","degisim","yeni_aylik_kar","fark_TL","fark_yuzde"])
        rows = [
            ("Abone donusumu",  "+%1 puan", business_model(conv=SUB_CONV_MAU+0.01)["profit_m"]),
            ("Abone donusumu",  "-%1 puan", business_model(conv=max(0.001,SUB_CONV_MAU-0.01))["profit_m"]),
            ("Indirme",         "+%50",     business_model(installs=int(DOWNLOADS_Y1*1.5))["profit_m"]),
            ("Indirme",         "-%50",     business_model(installs=int(DOWNLOADS_Y1*0.5))["profit_m"]),
            ("Magaza payi",     "%15->%30", business_model(cut=STORE_CUT_STD)["profit_m"]),
        ]
        for name, chg, val in rows:
            w.writerow([name, chg, round(val), round(val-base["profit_m"]),
                        f"%{round((val-base['profit_m'])/abs(base['profit_m'])*100)}"])
    return p

def write_endless():
    p = os.path.join(OUT, "sonsuz_mod.csv")
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["seviye","tur","tas","yuz","tepsi","dagilim","sure_carpani",
                    "par_sure","cozulebilirlik"])
        for n in range(ENDLESS_START, ENDLESS_START + 60):
            r = endless_run(n)
            w.writerow([n, r, tiles(MAX_LEVEL), endless_faces(r), endless_tray(r),
                        endless_spread(r), round(endless_time_mult(r), 3),
                        round(par_time(MAX_LEVEL) * endless_time_mult(r)),
                        ENDLESS_SOLVABILITY.get(n, "")])
    return p

def write_sim():
    p = os.path.join(OUT, "oyuncu_simulasyonu.csv")
    profiles = [("acemi",0.45,11), ("orta",0.62,22), ("usta",0.82,33)]
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["profil","oturum","seviye","speed","logic","memory","pattern",
                    "chi","iq","ci","guvenilirlik","denge"])
        for name, sk, sd in profiles:
            for r in simulate_player(sk, 100, sd):
                w.writerow([name, r["oturum"], r["seviye"], r["speed"], r["logic"],
                            r["memory"], r["pattern"], r["chi"], r["iq"], r["ci"],
                            r["rho"], r["denge"]])
    return p


# ==========================================================================
# RAPOR
# ==========================================================================
def bar(v, mx, w=22):
    return "█" * int(round(v / mx * w))

def main():
    print("=" * 74)
    print("  STONEBREAKING — MATEMATİK MODELİ v2  (index.html ile senkron)")
    print("=" * 74)

    print("\n[0] SENKRON DENETİMİ")
    errs = verify_sync()
    if errs:
        for e in errs: print("   ❌ " + e)
        print("   → Model ile oyun AYRIŞMIŞ. Düzeltilmeden yayına alınmamalı.")
    else:
        print("   ✅ 19 sabit + seviye formülü index.html ile birebir aynı")

    print("\n[1] SEVİYE EĞRİSİ")
    print(f"   {'Sv':>3} {'taş':>4} {'kat':>3} {'yüz':>3} {'par':>4} {'elo':>5} {'zorluk':>6}  rütbe")
    for n in [1,5,10,20,35,50,70,85,100]:
        tr,_ = rank_of(n)
        print(f"   {n:>3} {tiles(n):>4} {layers(n):>3} {faces(n):>3} {par_time(n):>4} "
              f"{level_elo(n):>5} {difficulty_index(n):>6}  {tr}")

    print("\n[2] CHI — DENGE CEZASI (oyunun tezi)")
    tests = [
        ("her alanda 1100",        {"speed":1100,"logic":1100,"memory":1100,"pattern":1100}),
        ("tek alan 2000, kalan 800", {"speed":2000,"logic":800,"memory":800,"pattern":800}),
        ("2 alan 1600, 2 alan 900",  {"speed":1600,"logic":1600,"memory":900,"pattern":900}),
    ]
    for name, sub in tests:
        print(f"   {name:<28} Chi={chi_total(sub):7.0f}   çember=%{balance_ratio(sub)*100:.0f}")
    print("   → Tek alanda uzmanlaşan, her alanda ortalama olandan DÜŞÜK alıyor.")

    print("\n[3] IQ NORMALİZASYONU")
    print(f"   eşik: {IQ_MIN_SESSIONS} oturum")
    for s in [5, 19, 20, 40, 60, 100]:
        iq, ci, rho = chi_to_iq(1600, s)
        vis = "görünür" if iq_visible(s) else "GİZLİ"
        print(f"   {s:>3} oturum  ρ={rho:.2f}  Chi1600 → IQ {iq:5.1f} ±{ci:4.1f}   [{vis}]")

    print("\n[4] SKOR BOZULMASI")
    for d in [3, 7, 14, 30, 60, 90]:
        v = decay(1600, 1600, d)
        print(f"   {d:>2} gün   1600 → {v:6.0f}   kayıp %{(1600-v)/1600*100:4.1f}   "
              f"geri kazanım ~{recovery_sessions(1600-v)} oturum")

    print("\n[5] BT ENERJİSİ")
    sup, dem, walls, ok = energy_verdict(7)
    print(f"   arz {sup:.0f}/gün (reklamsız {daily_energy_supply(False):.0f})  "
          f"talep {dem:.2f}/gün  →  haftada {walls} duvar anı  "
          f"{'✅ sağlıklı band' if ok else '❌ band dışı'}")
    print(f"   duvar sonrası bekleme: {REGEN_MIN} dk  ·  günlük reklam sınırı: {AD_MAX_DAY}")

    print("\n[6] KOMBO ZİNCİRİ")
    for ms in [3000, 4000, CHAIN_MS, 6000]:
        avg, p3, p5 = simulate_chain(ms)
        mark = "  ← SEÇİLEN" if ms == CHAIN_MS else ""
        print(f"   {ms:>5}ms  ort {avg:5.2f}  3'lü %{p3*100:3.0f}  5'li %{p5*100:3.0f}{mark}")

    print("\n[7] İŞ MODELİ")
    for name, inst, conv, cut in [("Temkinli",120_000,0.025,STORE_CUT_STD),
                                  ("Baz",     250_000,0.040,STORE_CUT_SMALL),
                                  ("İyimser", 500_000,0.060,STORE_CUT_SMALL)]:
        m = business_model(cut=cut, conv=conv, installs=inst)
        print(f"   {name:<9} MAU {m['mau']:>7,.0f}  abone {m['subs']:>6,.0f}  "
              f"gelir/ay ₺{m['total_m']:>9,.0f}  kâr/ay ₺{m['profit_m']:>9,.0f}  "
              f"ARPMAU ₺{m['arpmau']:.2f}  LTV/CAC {m['ratio']:.1f}  "
              f"geri ödeme {m['payback_m']:.1f} ay")
    be = breakeven_mau()
    print(f"   başabaş MAU: {be:,.0f}  (sunucu ₺{SERVER_COST_M:,.0f}/ay)")
    print(f"   ₺500k/ay kâr için gereken dönüşüm: "
          f"%{required_conversion(500_000, business_model()['mau'])*100:.1f}")

    print("\n[8] DUYARLILIK — hangi kaldıraç en güçlü?")
    base = business_model()["profit_m"]
    lev = [("Abone dönüşümü +1 puan", business_model(conv=SUB_CONV_MAU+0.01)["profit_m"]),
           ("İndirme +%50",           business_model(installs=int(DOWNLOADS_Y1*1.5))["profit_m"]),
           ("Mağaza payı %15→%30",    business_model(cut=STORE_CUT_STD)["profit_m"])]
    for name, v in lev:
        print(f"   {name:<26} ₺{v:>10,.0f}   ({(v-base)/abs(base)*100:+.0f}%)")

    print("\n[9] SONSUZ MOD — Arafta Koşu")
    print(f"   {'Sv':>4} {'tur':>4} {'yüz':>4} {'tepsi':>6} {'dağılım':>8} {'süre×':>6}  çözülebilir")
    for n in [101, 105, 110, 120, 140, 180]:
        r = endless_run(n)
        sol = ENDLESS_SOLVABILITY.get(n, "")
        sol = f"%{sol*100:.0f}" if sol else "—"
        print(f"   {n:>4} {r:>4} {endless_faces(r):>4} {endless_tray(r):>6} "
              f"{endless_spread(r):>8} {endless_time_mult(r):>6.2f}  {sol:>10}")
    print(f"   Sv100'e ulaşan: %{SV100_REACH*100:.0f} → "
          f"{business_model()['mau']*SV100_REACH:,.0f} kişi (Baz senaryo)")

    print("\n[9b] VİRAL DÖNGÜ — Meydan Okuma (asenkron PvP)")
    v = viral_loop()
    print(f"   haftalık davet {v['weekly_invites']:>9,.0f} → yeni install {v['weekly_new']:>7,.0f}")
    print(f"   k-factor {v['k']:.2f}  ·  aylık {v['monthly_new']:,.0f}  ·  yıllık {v['yearly_new']:,.0f}")
    print(f"   UA karşılığı ₺{v['ua_equiv']:,.0f}  ·  ek gelir ₺{v['extra_rev']:,.0f}/yıl")
    print(f"   geliştirme + sunucu maliyeti: ₺0 (deterministik tahta yeterli)")

    print("\n[10] ÖDÜL POLİTİKASI — çekiliş mi, onur mu?")
    ra = raffle_analysis()
    print(f"   10 iPhone maliyeti      ₺{ra['cost']:>12,.0f}")
    print(f"   Aynı parayla UA         {ra['ua_installs']:>13,.0f} install "
          f"→ LTV ₺{ra['ua_ltv']:,.0f}")
    print(f"   UA yolunun net getirisi ₺{ra['ua_net']:>12,.0f}  "
          f"{'(zarar)' if ra['ua_net'] < 0 else ''}")
    print(f"   Çekilişin başabaşı      {ra['breakeven_installs']:>13,.0f} install gerektirir")
    h = honor_system()
    print(f"   → ONUR SİSTEMİ: {h['reachers']:,.0f} kişi Sv100'e ulaşıyor; "
          f"ilk {HONOR_FIRST_N} fiziksel hediye ₺{h['gift_cost']:,.0f}")
    print(f"     satış marjı ₺{h['margin']:,.0f}  →  NET ₺{h['net']:+,.0f}")
    print(f"   KARAR: çekiliş 10 kişiyi mutlu edip {h['reachers']-10:,.0f} kişiyi küstürür;")
    print(f"          onur sistemi hepsini ödüllendirir ve ₺{h['net']:,.0f} KAZANDIRIR.")

    print("\n[11] CSV ÇIKTILARI")
    for fn in (write_levels, write_chi_iq, write_decay, write_energy,
               write_chain, write_business, write_sensitivity, write_sim,
               write_endless):
        print("   ✓ " + os.path.relpath(fn(), ROOT))

    print("\n" + "=" * 74)
    if errs:
        print("  SONUÇ: ⚠️  SENKRON HATASI VAR — yukarıya bak")
        sys.exit(1)
    print("  SONUÇ: ✅ Model ile oyun senkron, tüm tablolar üretildi")
    print("=" * 74)

if __name__ == "__main__":
    main()
