import { initializeApp } from 'firebase/app';
import { clientConfig } from '../../auth-config';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export const app = initializeApp(clientConfig);
export const auth = getAuth(app)
export const db = getFirestore()