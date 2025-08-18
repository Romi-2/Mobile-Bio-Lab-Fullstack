import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  city: string;
}

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get<User[]>("http://localhost:5000/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.firstName} {u.lastName} ({u.role}) - {u.city}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
