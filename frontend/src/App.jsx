
import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadStudents() {
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to load students");
      setStudents(await res.json());
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setName("");
      setEmail("");
      setMessage("Student registered successfully!");
      await loadStudents();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Student Registration</h1>
      <p>React + Express + MySQL + Docker</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Register Student"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>Registered Students</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
