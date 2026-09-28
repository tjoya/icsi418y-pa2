import { useState } from "react";

function Signup() 
{
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
    event.preventDefault();

    try 
    {
        const response = await fetch("http://localhost:9000/signup", 
        {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                firstName,
                lastName,
                username,
                password,
            }),
        });

        const data = await response.json();
        setMessage(data.message);

    } 
    
    catch (error) 
    {
        setMessage("Not connected to the server.");
    }
    };

    return (
        <div>
            <h2>Sign Up</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                />

                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                />

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button type="submit">Sign Up</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Signup;