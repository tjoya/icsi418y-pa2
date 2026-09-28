require("dotenv").config();
const { MongoClient } = require("mongodb");

const express = require("express");
const cors = require("cors");
const client = new MongoClient(process.env.MONGO_URI);
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => 
{
    res.json({
        message: "Server is running"
    });
});

app.post("/signup", async (req, res) => 
{
    const { firstName, lastName, username, password } = req.body;

    if (!firstName || !lastName || !username || !password) 
    {
        return res.status(400).json({
            message: "Missing: Required information."
        });
    }

    try {
        const db = client.db("pa2");
        const users = db.collection("users");

        const existingUser = await users.findOne({ username: username });

        if (existingUser !== null) 
        {
            return res.status(409).json({
                message: "Username already exists!"
            });
        }

        await users.insertOne({
            f_name: firstName,
            l_name: lastName,
            username: username,
            password: password
        });

        res.status(201).json({
            message: "User created successfully!"
        });
    }
    catch (error) 
    {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

app.post("/login", async (req, res) => 
{
    const { username, password } = req.body;

    if (!username || !password) 
    {
        return res.status(400).json({
            message: "Missing: Required information."
        });
    }

    try 
    {
        const db = client.db("pa2");
        const users = db.collection("users");

        const user = await users.findOne({ username: username });

        if (user === null) 
        {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }
        if (user.password !== password) 
        {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        res.status(200).json({
            message: "Login successful!",
            user: 
            {
                f_name: user.f_name,
                l_name: user.l_name,
                username: user.username,
                password: user.password
            }
        });
    }
    catch (error) 
    {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

async function connectDatabase() 
{
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Not connected to MongoDB");
        console.error(error);
    }
}

connectDatabase();

app.listen(9000, () => {
    console.log("Server running on port 9000");
});