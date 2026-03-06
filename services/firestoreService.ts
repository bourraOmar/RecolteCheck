import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// --- User Profile ---
export interface UserProfile {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  createdAt: Timestamp | null;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', userId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}

export async function saveUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, data, { merge: true });
}

// --- Parcelles ---
export interface Parcelle {
  id?: string;
  nom: string;
  surface: number;
  location: string;
  cultures: string[];
  periodeRecolte: string;
  createdAt: Timestamp | null;
}

function parcellesCol(userId: string) {
  return collection(db, 'users', userId, 'parcelles');
}

export function parcelleDoc(userId: string, parcelleId: string) {
  return doc(db, 'users', userId, 'parcelles', parcelleId);
}

export async function addParcelle(userId: string, data: Omit<Parcelle, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(parcellesCol(userId), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateParcelle(userId: string, parcelleId: string, data: Partial<Parcelle>): Promise<void> {
  await updateDoc(parcelleDoc(userId, parcelleId), data);
}

export async function deleteParcelle(userId: string, parcelleId: string): Promise<void> {
  await deleteDoc(parcelleDoc(userId, parcelleId));
}

export function subscribeParcelles(userId: string, callback: (parcelles: Parcelle[]) => void) {
  const q = query(parcellesCol(userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: Parcelle[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as Parcelle);
    });
    callback(items);
  });
}

// --- Zones ---
export interface Zone {
  id?: string;
  nom: string;
  surface: number;
  createdAt: Timestamp | null;
}

function zonesCol(userId: string, parcelleId: string) {
  return collection(db, 'users', userId, 'parcelles', parcelleId, 'zones');
}

export function zoneDoc(userId: string, parcelleId: string, zoneId: string) {
  return doc(db, 'users', userId, 'parcelles', parcelleId, 'zones', zoneId);
}

export async function addZone(userId: string, parcelleId: string, data: Omit<Zone, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(zonesCol(userId, parcelleId), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateZone(userId: string, parcelleId: string, zoneId: string, data: Partial<Zone>): Promise<void> {
  await updateDoc(zoneDoc(userId, parcelleId, zoneId), data);
}

export async function deleteZone(userId: string, parcelleId: string, zoneId: string): Promise<void> {
  await deleteDoc(zoneDoc(userId, parcelleId, zoneId));
}

export function subscribeZones(userId: string, parcelleId: string, callback: (zones: Zone[]) => void) {
  const q = query(zonesCol(userId, parcelleId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: Zone[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as Zone);
    });
    callback(items);
  });
}

// --- Récoltes ---
export interface Recolte {
  id?: string;
  culture: string;
  poids: number;
  date: Timestamp | null;
  notes: string;
  createdAt: Timestamp | null;
}

function recoltesCol(userId: string, parcelleId: string, zoneId: string) {
  return collection(db, 'users', userId, 'parcelles', parcelleId, 'zones', zoneId, 'recoltes');
}

export async function addRecolte(
  userId: string,
  parcelleId: string,
  zoneId: string,
  data: Omit<Recolte, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(recoltesCol(userId, parcelleId, zoneId), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteRecolte(
  userId: string,
  parcelleId: string,
  zoneId: string,
  recolteId: string
): Promise<void> {
  const ref = doc(db, 'users', userId, 'parcelles', parcelleId, 'zones', zoneId, 'recoltes', recolteId);
  await deleteDoc(ref);
}

export function subscribeRecoltes(
  userId: string,
  parcelleId: string,
  zoneId: string,
  callback: (recoltes: Recolte[]) => void
) {
  const q = query(recoltesCol(userId, parcelleId, zoneId), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: Recolte[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as Recolte);
    });
    callback(items);
  });
}
