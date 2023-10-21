import React, { useEffect, useState } from "react";
import { User } from "../helpers/types/GroupUserTypes";

type UserTabViewProps = {
  users: User[];
};

const UserTabView: React.FC<UserTabViewProps> = ({ users }) => {
  const itemsPerPage = 4; // Number of users per page
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const [selectedUser, setSelectedUser] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    setCurrentPage(1); // Reset the current page when users change
    users.length > 0 && setSelectedUser(users[0]);
  }, [users]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-[60%] overflow-x-auto rounded-lg bg-sky-50">
      <ul className="w-full bg-[var(--green)] flex gap-x-4 text-white text-[1.25rem] px-2 py-1 rounded-md justify-between">
        {currentUsers.map((user) => (
          <li
            key={user.id}
            className={`btn ${selectedUser.id === user.id ? "activeTab" : ""}`}
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </li>
        ))}
      </ul>
      <div className="px-4">
        {selectedUser.id ? (
          <div className="p-12">
            {/* <h2>User Details</h2> */}
            <p>ID: {selectedUser.id}</p>
            <p>Name: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Role: {selectedUser.role}</p>
          </div>
        ) : (
          <p className="text-[var(--orange)] text-[1.25rem] text-center">
            Select a user to view details
          </p>
        )}
      </div>
      <div className="text-[var(--orange)]">
        {users.length > itemsPerPage && (
          <ul className="flex flex-row gap-4">
            <p>PAGE:</p>
            {Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map(
              (_, index) => (
                <li
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={
                    currentPage === index + 1
                      ? "cursor-pointer text-[var(--blue)] inline"
                      : "cursor-pointer"
                  }
                >
                  {index + 1}
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserTabView;
