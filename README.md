# 🚀 ClickHouse ↔️ Flat File Ingestion Tool

This is a full-stack web application for **bidirectional data ingestion** between [ClickHouse](https://clickhouse.com/) and **Flat File (CSV)**. The tool allows authenticated data transfer, schema discovery, column selection, and batch ingestion in both directions:

- ClickHouse ➡️ Flat File
- Flat File ➡️ ClickHouse

---

## 📌 Features

✅ Web UI with source/target selection  
✅ JWT-based ClickHouse authentication  
✅ Flat File CSV upload with delimiter support  
✅ Schema discovery and column selection  
✅ Efficient ingestion with batching  
✅ Data preview before ingestion  
✅ Progress and completion reporting  
✅ Error handling and logging

---

## 🛠️ Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Frontend    | React + Vite + Tailwind CSS |
| Backend     | Spring Boot (Java)  |
| Database    | ClickHouse (Docker) |
| Auth        | JWT (ClickHouse only) |
| File Format | CSV (Flat File)     |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/clickhouse-flatfile-ingestion.git
cd clickhouse-flatfile-ingestion
```

### 2. Start ClickHouse via Docker

```bash
docker run -d --name clickhouse \
    -p 8123:8123 -p 9000:9000 \
    clickhouse/clickhouse-server
```

> Optional: Load example datasets like `uk_price_paid` or `ontime` for testing.

### 3. Backend - Spring Boot

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Backend Configuration (`application.properties`)

```properties
clickhouse.host=localhost
clickhouse.port=8123
clickhouse.database=default
clickhouse.username=default
clickhouse.password=
```

### 4. Frontend - React (Vite)

```bash
cd frontend
npm install
npm run dev
```

Then open your browser at: [http://localhost:5173](http://localhost:5173)

---

## 🔄 Application Flow

### 🔁 Flat File ➡️ ClickHouse

1. Select `Flat File` as source.
2. Upload CSV file and set delimiter.
3. Preview data and select columns.
4. Choose ClickHouse target connection.
5. Select target table or create new.
6. Start ingestion.

### 🔁 ClickHouse ➡️ Flat File

1. Select `ClickHouse` as source.
2. Connect using host, port, database, user, JWT.
3. Select one or more tables.
4. (Bonus) Input JOIN conditions if needed.
5. Select target columns and preview data.
6. Export to flat file (CSV).

---

## 🔗 API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/api/preview`        | Preview data from uploaded CSV       |
| POST   | `/api/ingest`         | Ingest selected data to ClickHouse   |
| GET    | `/api/tables`         | Get all tables from ClickHouse       |
| GET    | `/api/columns`        | Get columns of a table               |
| POST   | `/api/flatfile/upload`| Upload CSV and parse schema          |

---

## 📸 UI Screenshots

> Add screenshots here showing:
- Table listing
- Column selection
- CSV preview
- Status updates
- Final record count

---

## ✅ Test Cases

| #  | Test Case                                      | Status |
|----|------------------------------------------------|--------|
| 1  | Flat File ➡️ ClickHouse (selected columns)      | ✅     |
| 2  | ClickHouse ➡️ Flat File (CSV)                   | ✅     |
| 3  | Flat File ➡️ New ClickHouse Table               | ✅     |
| 4  | Join ClickHouse Tables ➡️ Flat File             | 🔄 Bonus |
| 5  | Error handling: invalid auth / broken CSV       | ✅     |
| 6  | CSV Preview before ingestion                    | ✅     |

---

## ⚠️ Known Issues

- No file size limit handling for now.
- All fields default to `String` during dynamic table creation (can be improved).
- JWT support is only pass-through; no validation on app level.

---

## 📚 Resources

- [ClickHouse JDBC](https://github.com/ClickHouse/clickhouse-jdbc)
- [ClickHouse Example Datasets](https://clickhouse.com/docs/en/getting-started/example-datasets)
- [JWT Introduction](https://jwt.io/introduction)

---

## 🤝 Author

👤 **Nishant Rathore**  
📧 nishantrathore2002@gmail.com  

---

```md
# 🚀 ClickHouse ↔️ Flat File Ingestion Tool

This is a full-stack web application for **bidirectional data ingestion** between [ClickHouse](https://clickhouse.com/) and **Flat File (CSV)**. The tool allows authenticated data transfer, schema discovery, column selection, and batch ingestion in both directions:

- ClickHouse ➡️ Flat File
- Flat File ➡️ ClickHouse

---

## 📌 Features

✅ Web UI with source/target selection  
✅ JWT-based ClickHouse authentication  
✅ Flat File CSV upload with delimiter support  
✅ Schema discovery and column selection  
✅ Efficient ingestion with batching  
✅ Data preview before ingestion  
✅ Progress and completion reporting  
✅ Error handling and logging

---

## 🛠️ Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Frontend    | React + Vite + Tailwind CSS |
| Backend     | Spring Boot (Java)  |
| Database    | ClickHouse (Docker) |
| Auth        | JWT (ClickHouse only) |
| File Format | CSV (Flat File)     |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/clickhouse-flatfile-ingestion.git
cd clickhouse-flatfile-ingestion
```

### 2. Start ClickHouse via Docker

```bash
docker run -d --name clickhouse \
    -p 8123:8123 -p 9000:9000 \
    clickhouse/clickhouse-server
```

> Optional: Load example datasets like `uk_price_paid` or `ontime` for testing.

### 3. Backend - Spring Boot

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Backend Configuration (`application.properties`)

```properties
clickhouse.host=localhost
clickhouse.port=8123
clickhouse.database=default
clickhouse.username=default
clickhouse.password=
```

### 4. Frontend - React (Vite)

```bash
cd frontend
npm install
npm run dev
```

Then open your browser at: [http://localhost:5173](http://localhost:5173)

---

## 🔄 Application Flow

### 🔁 Flat File ➡️ ClickHouse

1. Connect using host, port, database, user, JWT.
2. Select `Flat File` as source.
3. Upload CSV file and set delimiter.
4. Preview data and select columns.
5. Choose ClickHouse target connection.
6. Select target table or create new.
7. Start ingestion.

### 🔁 ClickHouse ➡️ Flat File

1. Select `ClickHouse` as source.
2. 
3. Select one or more tables.
5. Select target columns and preview data.
6. Export to flat file (CSV).

---

## 🔗 API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/api/preview`        | Preview data from uploaded CSV       |
| POST   | `/api/ingest`         | Ingest selected data to ClickHouse   |
| GET    | `/api/tables`         | Get all tables from ClickHouse       |
| GET    | `/api/columns`        | Get columns of a table               |
| POST   | `/api/flatfile/upload`| Upload CSV and parse schema          |

---

## 📸 UI Screenshots
![Screenshot 2025-04-16 235139](https://github.com/user-attachments/assets/e3c82ebb-eeb2-4b44-920b-fe98466c5cd7)
![Screenshot 2025-04-16 235149](https://github.com/user-attachments/assets/f1ec5303-830a-405f-8686-a5377a25e629)
![Screenshot 2025-04-16 235202](https://github.com/user-attachments/assets/3d45d1eb-393c-4a38-ac2c-fa58e5412825)
![Screenshot 2025-04-16 235227](https://github.com/user-attachments/assets/fecbd9a2-853e-4950-820e-b8b82f6e5a4b)


---

## ✅ Test Cases

| #  | Test Case                                      | Status |
|----|------------------------------------------------|--------|
| 1  | Flat File ➡️ ClickHouse (selected columns)      | ✅     |
| 2  | ClickHouse ➡️ Flat File (CSV)                   | ✅     |
| 3  | Flat File ➡️ New ClickHouse Table               | ✅     |
| 5  | Error handling: invalid auth / broken CSV       | ✅     |
| 6  | CSV Preview before ingestion                    | ✅     |

---

## ⚠️ Known Issues

- No file size limit handling for now.
- All fields default to `String` during dynamic table creation (can be improved).
- JWT support is only pass-through; no validation on app level.

---

## 📚 Resources

- [ClickHouse JDBC](https://github.com/ClickHouse/clickhouse-jdbc)
- [ClickHouse Example Datasets](https://clickhouse.com/docs/en/getting-started/example-datasets)
- [JWT Introduction](https://jwt.io/introduction)

---

## 🤝 Author

👤 Nishant Rathore  
📧 nishantrathore2002@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/nishantrathore2002/) • [GitHub](https://github.com/NISHANT-RATHORE)

---



