import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

export const isUserBlocked = async (userUid) => {
  const querySnapshot = await getDocs(collection(firestore, 'users'));
  const usersList = querySnapshot.docs.map((doc) => doc.data());
  const userFromFirebase = usersList.find((user) => user.uid === userUid);
  return userFromFirebase.status === 'blocked';
};
