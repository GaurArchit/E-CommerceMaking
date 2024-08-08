import express from "express";
import mongoose, { Schema, model } from "mongoose";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { error } from "console";
import cors from "cors";

const app = express();
app.use(cors());

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __dirname = dirname(fileURLToPath(import.meta.url));
let menulist = [];

app.set("views", join(__dirname, "views")); // Correctly set the views directory
app.set("view engine", "pug"); // Set Pug as the view engine

app.get("/", (req, res) => {
  res.send("jai guruji");
});

app.get("/admin/menu", (req, res) => {
  res.render("menu"); // Render the 'menu.pug' template
});
app.post("/admin/menu", (req, res) => {
  const newMenuItem = req.body.menu.trim();
  console.log(newMenuItem);
  menulist = [...menulist, newMenuItem];

  res.redirect("/admin/menulist");
});

app.get("/admin/menulist", (req, res) => {
  res.send(menulist);
});

const dburl = process.env.monurl;
console.log(dburl);
mongoose
  .connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection  backend established");
  })
  .catch((error) => {
    console.log("Error is there", error);
  });

const Menu = new Schema({
  menu: {
    type: String,
    required: true,
  },
  reatedAt: { type: Date, default: Date.now },
});
const Menur = model("menus", Menu);

app.get("/500", async (req, res) => {
  try {
    // Convert menulist to an array of objects with `menu` field
    const menuItems = menulist.map((item) => ({ menu: item }));

    await Menur.insertMany(menuItems);
    console.log("Data inserted successfully");
    res.send(menuItems);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data");
  }
});

app.listen(5030, () => {
  console.log("connection established");
});
