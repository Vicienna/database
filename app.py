from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

# Fungsi untuk memuat data dari file JSON
def load_data():
    if not os.path.exists('data.json'):
        return []
    with open('data.json', 'r') as f:
        return json.load(f)

# Fungsi untuk menyimpan data ke file JSON
def save_data(data):
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=4)

# Endpoint untuk menambah data
@app.route('/add', methods=['POST'])
def add_data():
    new_entry = request.json
    data = load_data()
    data.append(new_entry)
    save_data(data)
    return jsonify({"message": "Data berhasil ditambahkan!"}), 201

# Endpoint untuk menghapus data berdasarkan nama variabel
@app.route('/delete/<variable>', methods=['DELETE'])
def delete_data(variable):
    data = load_data()
    data = [entry for entry in data if entry.get('name') != variable]
    save_data(data)
    return jsonify({"message": "Data berhasil dihapus!"}), 200

# Endpoint untuk mengedit data berdasarkan nama variabel
@app.route('/edit/<variable>', methods=['PUT'])
def edit_data(variable):
    updated_entry = request.json
    data = load_data()
    for i in range(len(data)):
        if data[i].get('name') == variable:
            data[i] = updated_entry
            save_data(data)
            return jsonify({"message": "Data berhasil diperbarui!"}), 200
    return jsonify({"message": "Data tidak ditemukan!"}), 404

# Endpoint untuk melihat data berdasarkan nama variabel
@app.route('/view/<variable>', methods=['GET'])
def view_data(variable):
    data = load_data()
    for entry in data:
        if entry.get('name') == variable:
            return jsonify(entry), 200
    return jsonify({"message": "Data tidak ditemukan!"}), 404

# Menjalankan server Flask
if __name__ == '__main__':
    app.run(debug=True)
