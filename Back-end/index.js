const express = require("express");
const bodyParser = require("body-parser");
const mongoDB = require("mongoose");
var cors = require("cors");

const app = express();
const port = 3001;
const DbUrl = "mongodb://localhost:27017/localUser";
app.use(bodyParser.json());

// mongoDB compass connected with backend server
mongoDB.connect(DbUrl, { useNewUrlParser: true });

app.use(cors());
// DEFINED SCHEMA FOR COLLECTION
const myCollectionSchema = new mongoDB.Schema({
  name: String,
  age: Number,
  email: String,
});

// DEFINED/CREATED A COLLECTION FOR DATABASE
const MyCollection = mongoDB.model("users", myCollectionSchema);

// TO CREATE DATA
app.post("/create", async (req, res) => {
  const data = new MyCollection(req.body);
  data.save();
  return res.status(201).send({ message: "Data inserted successfully", data });
});

// TO READ/GET DATA
app.get("/getdata", async (req, res) => {
  await MyCollection.find({})
    .then((data) => {
      return res.status(200).send({ message: "Data retrieved successfully", data: data.reverse() });
    })
    .catch((err) => {
      return err;
    });
});

// TO READ/GET DATA BY ID
app.get("/getDataById", async (req, res) => {
  await MyCollection.findById(req.query.id)
    .then((data) => {
      return res.status(200).send({ message: "Data retrieved successfully", data: data });
    })
    .catch((err) => {
      return err;
    });
});

// TO UPDATE DATA
app.put("/updateById", async (req, res) => {
  const dataId = req.query.id;
  const data = await MyCollection.findOneAndUpdate({ _id: dataId }, { ...req.body }, { new: true });
  return res.status(200).send({ message: "Data updated sucessfully", data });
});

// TO DELETE DATA
app.delete("/deleteById", async (req, res) => {
  const dataId = req.query.id;
  const data = await MyCollection.findOneAndDelete({ _id: dataId }, { new: true });

  return res.status(200).send({ message: "Data deleted sucessfully", data });
});

// TO DUPLICATE DATA
app.post("/duplicateById", async (req, res) => {
  const data = await MyCollection.findById(req.query.id).select("-_id ");

  let newData = data.toObject();
  newData = new MyCollection(newData);
  newData.name = newData.name + " Duplicated";
  await newData.save();

  return res.status(200).send({ message: "Data duplicated sucessfully", newData });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
