import tkinter as tk
from tkinter import messagebox
import matplotlib.pyplot as plt

# Nilai tukar mata uang sederhana (dalam Rupiah)
exchange_rates = {"IDR": 1, "USD": 15000, "EUR": 16500}

# Fungsi untuk membersihkan input uang
def clean_currency(value):
    try:
        # Hapus tanda titik (jika ada) dan ubah ke float
        return float(value.replace(".", ""))
    except ValueError:
        messagebox.showerror("Error", "Masukkan angka yang valid!")
        return None

# Fungsi untuk menghitung dan menampilkan laporan
def hitung_laporan():
    try:
        # Ambil data dari input
        selected_currency = currency_var.get()
        exchange_rate = exchange_rates[selected_currency]

        # Konversi pendapatan ke IDR
        pendapatan_raw = clean_currency(entry_pendapatan.get())
        if pendapatan_raw is None:
            return
        pendapatan = pendapatan_raw * exchange_rate

        # Konversi pengeluaran ke IDR
        pengeluaran = {
            "Makan": clean_currency(entry_makan.get()) or 0,
            "Transportasi": clean_currency(entry_transport.get()) or 0,
            "Hiburan": clean_currency(entry_hiburan.get()) or 0,
            "Lainnya": clean_currency(entry_lainnya.get()) or 0,
        }

        # Hitung total pengeluaran dan sisa uang
        total_pengeluaran = sum(pengeluaran.values())
        sisa_uang = pendapatan - total_pengeluaran

        # Tampilkan hasil laporan
        laporan = (
            f"Pendapatan dalam IDR: Rp {pendapatan:,.2f}\n"
            f"Total Pengeluaran: Rp {total_pengeluaran:,.2f}\n"
            f"Sisa Uang: Rp {sisa_uang:,.2f}"
        )
        messagebox.showinfo("Laporan Keuangan", laporan)

        # Buat grafik
        buat_grafik(pengeluaran)

    except ValueError:
        messagebox.showerror("Error", "Harap masukkan angka yang valid!")

# Fungsi untuk membuat grafik pengeluaran
def buat_grafik(pengeluaran):
    kategori = list(pengeluaran.keys())
    jumlah = list(pengeluaran.values())

    plt.figure(figsize=(6, 4))
    plt.bar(kategori, jumlah, color='skyblue')
    plt.title("Pengeluaran Per Kategori")
    plt.xlabel("Kategori")
    plt.ylabel("Jumlah (Rp)")
    plt.show()

# Membuat jendela utama
root = tk.Tk()
root.title("Personal Finance Mentor")
root.geometry("400x500")
root.resizable(False, False)

# Judul aplikasi
label_title = tk.Label(root, text="Personal Finance Mentor", font=("Helvetica", 16, "bold"), fg="blue")
label_title.pack(pady=10)

# Pilihan mata uang
frame_currency = tk.Frame(root)
frame_currency.pack(pady=5)
tk.Label(frame_currency, text="Pilih Mata Uang:", font=("Helvetica", 12)).grid(row=0, column=0, padx=5)
currency_var = tk.StringVar(value="IDR")
currency_menu = tk.OptionMenu(frame_currency, currency_var, *exchange_rates.keys())
currency_menu.grid(row=0, column=1)

# Input pendapatan
frame_pendapatan = tk.Frame(root)
frame_pendapatan.pack(pady=5)
tk.Label(frame_pendapatan, text="Pendapatan:", font=("Helvetica", 12)).grid(row=0, column=0, padx=5)
entry_pendapatan = tk.Entry(frame_pendapatan, font=("Helvetica", 12))
entry_pendapatan.grid(row=0, column=1)

# Input pengeluaran
frame_pengeluaran = tk.Frame(root)
frame_pengeluaran.pack(pady=10)
tk.Label(frame_pengeluaran, text="Makan:", font=("Helvetica", 12)).grid(row=0, column=0, padx=5, pady=2)
entry_makan = tk.Entry(frame_pengeluaran, font=("Helvetica", 12))
entry_makan.grid(row=0, column=1)
tk.Label(frame_pengeluaran, text="Transportasi:", font=("Helvetica", 12)).grid(row=1, column=0, padx=5, pady=2)
entry_transport = tk.Entry(frame_pengeluaran, font=("Helvetica", 12))
entry_transport.grid(row=1, column=1)
tk.Label(frame_pengeluaran, text="Hiburan:", font=("Helvetica", 12)).grid(row=2, column=0, padx=5, pady=2)
entry_hiburan = tk.Entry(frame_pengeluaran, font=("Helvetica", 12))
entry_hiburan.grid(row=2, column=1)
tk.Label(frame_pengeluaran, text="Lainnya:", font=("Helvetica", 12)).grid(row=3, column=0, padx=5, pady=2)
entry_lainnya = tk.Entry(frame_pengeluaran, font=("Helvetica", 12))
entry_lainnya.grid(row=3, column=1)

# Tombol hitung
btn_hitung = tk.Button(root, text="Hitung Laporan", font=("Helvetica", 12, "bold"), bg="green", fg="white", command=hitung_laporan)
btn_hitung.pack(pady=20)

# Menjalankan aplikasi
root.mainloop()
