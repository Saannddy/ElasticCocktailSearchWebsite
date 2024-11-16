
# CocktailSearchWeb 🍹  

A beautiful and simple web application to search cocktail data using **React**, **Tailwind CSS**, **Elasticsearch**, and **Kibana**.

---

## 🚀 Quick Start (1)

Follow these steps to set up and run the project (front-end):

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/Saannddy/Cloud-CocktailSearchWeb
   ```

2. **Navigate into the Project Directory**  
   ```bash
   cd CocktailSearch
   ```

3. **Install Project Dependencies**  
   ```bash
   npm install
   ```

4. **Run the Development Server**  
   ```bash
   npm run dev
   ```

5. **Open the App in Your Browser**  
   Visit: [http://localhost:5173](http://localhost:5173)

---

## 🔍 Setting up Elasticsearch and Kibana  

To enable powerful search features, we’ll set up **Elasticsearch** and **Kibana**.

1. **Install Elasticsearch and Kibana**  
   Download and install **Elasticsearch** and **Kibana** from their official website: [https://www.elastic.co/downloads/](https://www.elastic.co/downloads/).

2. **Run Elasticsearch**  
   Start the Elasticsearch server:
   ```bash
   ./bin/elasticsearch
   ```

3. **Run Kibana**  
   Start the Kibana server:
   ```bash
   ./bin/kibana
   ```

4. **Replace Elasticsearch Credentials**  
   Open `/api/server.js` and replace the placeholder values with your Elasticsearch username and password.

5. **Open Kibana**  
   Visit: [http://localhost:5601/](http://localhost:5601)

6. **Index Cocktail Data**  
   Upload `cocktails.csv` data into Elasticsearch and create an index named `cocktail_data`.

7. **Goes to Dev tools**
   Config as below
   ```
   DELETE /cocktail_data_bm25 
   //Only if you have already create once

   PUT /cocktail_data_bm25
   {
      "mappings": {
      "properties": {
         "strDrinks": {
            "type": "text",
            "similarity": "BM25" 
         },
         "strIBA": {
            "type": "text",
         "similarity": "BM25" 
         },
         "strIngredients": {
            "type": "text",
            "similarity": "BM25" 
         },
         "strCategory": {
            "type": "text",
         "similarity": "BM25"
         }
      }
   }
   }

   POST /_reindex
   {
      "source": {
      "index": "cocktail_data"
      },
      "dest": {
      "index": "cocktail_data_bm25"
      }
   }
   ```

---

## 🚀 Quick Start (cont.)

Follow these steps to set up and run the project (back-end):

1. **Split the Terminal from Quick Start 1 and Navigate to Backend**  
   ```bash
   cd ../api
   ```

3. **Install Project Dependencies**  
   ```bash
   npm update
   npm install
   ```

4. **Run the Development Server**  
   ```bash
   npm start
   ```

5. **Try Search in Browser That Open on QuickStart(1)**  

---

## ✨ Features  

- Search for cocktail data using **Elasticsearch**.
- Elegant design with **Tailwind CSS**.
- Dynamic loading state and error handling.
- Displays cocktail name, ingredients, and instructions.

---

## 🛠️ Technologies Used  

- **Vite** – Blazing fast build tool for frontend projects.
- **React** – JavaScript library for building user interfaces.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **Elasticsearch** – Search and analytics engine.
- **Kibana** – Data visualization and exploration tool for Elasticsearch.

---

## 📂 Project Structure  

```
Cloud-CocktailSearchWeb/
│
├── api/
│   │
│   ├── package.json          # Project dependencies and scripts
│   └── server.js             # Main Backend File
│
├── CocktailSearch/
│   │
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable components
│   │   ├── App.jsx           # Main React component
│   │   └── index.css         # Tailwind CSS setup
│   │ 
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── package.json          # Project dependencies and scripts
│   └── README.md             # React documentation
│
├── cocktails.csv             # Cocktails Data file
└── README.md                 # Project documentation
```

---

## 🐞 Troubleshooting  

If Tailwind CSS styles are not applied correctly:  
1. Make sure the `content` field in **`tailwind.config.js`** points to your source files:
   ```javascript
   content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
   ```
2. Restart the Vite dev server:
   ```bash
   npm run dev
   ```
