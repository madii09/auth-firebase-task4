// import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { auth, firestore } from '../firebaseConfig';

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([]);
  const selectedUsers = useMemo(
    () => users.filter((user) => user.selected),
    [users]
  );

  const isAllUsersSelected =
    selectedUsers.length > 0 && selectedUsers.length === users.length;

  const selectUsers = (uid) => {
    let selectedUsers = [];

    if (uid === undefined) {
      selectedUsers = users.map((user) => ({
        ...user,
        selected: !isAllUsersSelected,
      }));
    } else {
      selectedUsers = users.map((user) => {
        if (user.uid === uid) {
          return { ...user, selected: !user.selected };
        }
        return user;
      });
    }

    setUsers(selectedUsers);
  };
  const handleDelete = async () => {
    // Loop through each selected user and handle the deletion
    const promises = selectedUsers.map(async (user) => {
      try {
        // Delete the user from Firestore database
        await deleteDoc(doc(firestore, 'users', user.uid));

        // If the deleted user is the current authenticated user, delete them from Firebase Auth
        if (user.uid === auth.currentUser.uid) {
          // Delete the user from Firebase Authentication
          await deleteUser(auth.currentUser);

          // Sign out the current user and redirect to login
          await auth.signOut();
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    });

    // Wait for all user deletions to be processed
    await Promise.all(promises);

    // Update the local users' state by filtering out the deleted users
    setUsers((prevUsers) =>
      prevUsers.filter(
        (user) => !selectedUsers.some((selUser) => selUser.uid === user.uid)
      )
    );
  };

  const handleBlock = async () => {
    const promises = selectedUsers.map(async (user) => {
      try {
        // Update the user's status in Firestore to 'blocked'
        await updateDoc(doc(firestore, 'users', user.uid), {
          status: 'blocked',
        });
        console.log(`User ${user.uid} has been blocked.`);

        if (user.uid === auth.currentUser.uid) {
          await auth.signOut();
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    });

    await Promise.all(promises);

    // Update state to reflect blocked status in the UI
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        selectedUsers.some((selUser) => selUser.uid === user.uid)
          ? { ...user, status: 'blocked' }
          : user
      )
    );
  };

  const handleUnblock = async () => {
    const promises = selectedUsers.map(async (user) => {
      try {
        // Update the user's status in Firestore to 'active'
        await updateDoc(doc(firestore, 'users', user.uid), {
          status: 'active',
        });
        console.log(`User ${user.uid} has been unblocked.`);
      } catch (error) {
        console.error('Error unblocking user:', error);
      }
    });

    // Wait for all unblock operations to finish
    await Promise.all(promises);

    // Update state to reflect unblocked status in the UI
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        selectedUsers.some((selUser) => selUser.uid === user.uid)
          ? { ...user, status: 'active' }
          : user
      )
    );
  };

  const handleLogout = () => {
    auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const usersList = querySnapshot.docs.map((doc) => doc.data());
      const modifiedUsers = usersList.map((userData) => ({
        ...userData,
        selected: false,
      }));
      setUsers(modifiedUsers);
    };

    fetchUsers();
  }, []);

  console.log(selectedUsers);

  return (
    <div className='container'>
      <h2>User Management</h2>
      <div className='toolbar mb-3'>
        <button className='btn btn-danger' onClick={handleBlock}>
          Block
        </button>
        <button className='btn btn-secondary' onClick={handleUnblock}>
          Unblock
        </button>
        <button className='btn btn-danger' onClick={handleDelete}>
          Delete
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>
              <input
                type='checkbox'
                onChange={() => selectUsers()}
                checked={isAllUsersSelected}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Registration Time</th>
            <th>Last Login Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 &&
            users.map((user) => (
              <tr key={user.uid}>
                <td>
                  <input
                    type='checkbox'
                    checked={user.selected}
                    onChange={() => selectUsers(user.uid)}
                  />
                </td>
                <td>{user.uid}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{Math.floor(user.registrationTime.seconds / 60)}</td>
                <td>{Math.floor(user.lastLogin.seconds / 60)}</td>
                <td>{user.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {users.length === 0 && <h2>Loading...</h2>}
      <button className='btn btn-secondary' onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserManagement;
