const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/createContact", (req, res) => {
  const { first_name, last_name, email, mobile_number, data_store } = req.body;

  if (data_store !== "sql") {
    return res.status(400).json({ message: "Invalid data store specified" });
  }
  const query = `INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)`;
  db.query(
    query,
    [first_name, last_name, email, mobile_number],
    (error, results, fields) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Contact already exists" });
        }
        console.error(error);
        return res.status(500).json({ message: "Failed to create contact" });
      }

      return res.status(201).json({ message: "Contact created successfully" });
    }
  );
});

app.get("/getContact", (req, res) => {
  const contact_id = req.body.contact_id;
  const data_store = req.body.data_store;

  if (data_store !== "sql") {
    return res.status(400).json({ message: "Invalid data store specified" });
  }

  const query = `SELECT * FROM contacts WHERE id = ${contact_id}`;

  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error retrieving contact" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const contact = results[0];

    return res.status(200).json({ contact });
  });
});

app.post("/updateContact", (req, res) => {
  const { contact_id, new_email, new_mobile_number, data_store } = req.body;
  if (data_store !== "sql") {
    return res.status(400).json({ message: "Invalid data store specified" });
  }
  const sql = `UPDATE contacts
               SET email = ?, mobile_number = ?
               WHERE id = ?`;

  db.query(sql, [new_email, new_mobile_number, contact_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating contact" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.status(200).json({ message: "Contact updated successfully" });
  });
});

app.post("/deleteContact", (req, res) => {
  const contact_id = req.body.contact_id;
  const data_store = req.body.data_store;

  if (data_store !== "sql") {
    return res.status(400).json({ message: "Invalid data store specified" });
  }
  const query = `DELETE FROM contacts WHERE ID = ?`;
  db.query(query, [contact_id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error deleting contact" });
    }
    return res.json({ message: "Contact deleted successfully" });
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
