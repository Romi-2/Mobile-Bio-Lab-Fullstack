import React, { useEffect, useState } from "react";
import { getPendingUsers, approveUser, rejectUser, type User } from "../../service/adminservice";
import "./PendingUsers.css";

const PendingUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const res = await getPendingUsers();
    setUsers(res);
  };

  const handleApprove = async (id: number) => {
    await approveUser(id);
    fetchPending();
  };

  const handleReject = async (id: number) => {
    await rejectUser(id);
    fetchPending();
  };

  return (
    <div className="pending-users">
      <h2>Pending Users</h2>
      {users.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              <span>{u.firstName} {u.lastName} - {u.city}</span>
              <button onClick={() => handleApprove(u.id)}>Approve</button>
              <button onClick={() => handleReject(u.id)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingUsers;
