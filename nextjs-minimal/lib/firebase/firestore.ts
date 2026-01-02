import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
} from "firebase/firestore";

// ============================================================================
// TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TTSession {
  id: string;
  userId: string;
  ttSessionId: string;
  scenarioId: string;
  scenarioName?: string;
  startedAt?: Date;
  completedAt?: Date;
  durationSeconds?: number;
  status: "started" | "completed" | "incomplete" | "analyzing";
  analysisData?: any;
  score?: number;
  feedbackSummary?: string;
  strengths?: string[];
  areasForImprovement?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  scenarioId: string;
  scenarioName?: string;
  totalAttempts: number;
  completedAttempts: number;
  bestScore?: number;
  averageScore?: number;
  latestScore?: number;
  totalTimeSeconds: number;
  averageTimeSeconds?: number;
  lastPracticedAt?: Date;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FIRESTORE OPERATIONS
// ============================================================================

/**
 * Get or create user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) throw new Error("Firestore not initialized");
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) return null;

  const data = userDoc.data();
  return {
    id: userDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as UserProfile;
}

/**
 * Create or update user profile
 */
export async function setUserProfile(userId: string, profile: Partial<UserProfile>) {
  if (!db) throw new Error("Firestore not initialized");
  const now = Timestamp.now();
  const userRef = doc(db, "users", userId);

  const existingUser = await getDoc(userRef);

  await setDoc(
    userRef,
    {
      ...profile,
      updatedAt: now,
      ...(existingUser.exists() ? {} : { createdAt: now }),
    },
    { merge: true }
  );
}

/**
 * Create a new TT session
 */
export async function createTTSession(session: Omit<TTSession, "id" | "createdAt" | "updatedAt">) {
  if (!db) throw new Error("Firestore not initialized");
  const now = Timestamp.now();
  const sessionsRef = collection(db, "tt_sessions");

  const docRef = await addDoc(sessionsRef, {
    ...session,
    startedAt: session.startedAt ? Timestamp.fromDate(session.startedAt) : null,
    completedAt: session.completedAt ? Timestamp.fromDate(session.completedAt) : null,
    lastPracticedAt: session.completedAt ? Timestamp.fromDate(session.completedAt) : null,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

/**
 * Update a TT session
 */
export async function updateTTSession(sessionId: string, updates: Partial<TTSession>) {
  if (!db) throw new Error("Firestore not initialized");
  const sessionRef = doc(db, "tt_sessions", sessionId);

  await updateDoc(sessionRef, {
    ...updates,
    startedAt: updates.startedAt ? Timestamp.fromDate(updates.startedAt) : undefined,
    completedAt: updates.completedAt ? Timestamp.fromDate(updates.completedAt) : undefined,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get user's sessions
 */
export async function getUserSessions(
  userId: string,
  limitCount: number = 20
): Promise<TTSession[]> {
  if (!db) throw new Error("Firestore not initialized");
  const sessionsRef = collection(db, "tt_sessions");
  const q = query(
    sessionsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startedAt: data.startedAt?.toDate(),
      completedAt: data.completedAt?.toDate(),
      lastPracticedAt: data.lastPracticedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as unknown as TTSession;
  });
}

/**
 * Get or create user progress for a scenario
 */
export async function getUserProgress(
  userId: string,
  scenarioId: string
): Promise<UserProgress | null> {
  if (!db) throw new Error("Firestore not initialized");
  const progressRef = collection(db, "user_progress");
  const q = query(
    progressRef,
    where("userId", "==", userId),
    where("scenarioId", "==", scenarioId),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    lastPracticedAt: doc.data().lastPracticedAt?.toDate(),
    lastPracticeDate: doc.data().lastPracticeDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as UserProgress;
}

/**
 * Update user progress after completing a session
 */
export async function updateUserProgress(
  userId: string,
  scenarioId: string,
  scenarioName: string,
  score?: number,
  durationSeconds?: number
) {
  if (!db) throw new Error("Firestore not initialized");
  const progressRef = collection(db, "user_progress");
  const q = query(
    progressRef,
    where("userId", "==", userId),
    where("scenarioId", "==", scenarioId),
    limit(1)
  );

  const snapshot = await getDocs(q);
  const now = Timestamp.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (snapshot.empty) {
    // Create new progress record
    await addDoc(progressRef, {
      userId,
      scenarioId,
      scenarioName,
      totalAttempts: 1,
      completedAttempts: 1,
      bestScore: score || null,
      averageScore: score || null,
      latestScore: score || null,
      totalTimeSeconds: durationSeconds || 0,
      averageTimeSeconds: durationSeconds || null,
      lastPracticedAt: now,
      currentStreak: 1,
      longestStreak: 1,
      lastPracticeDate: Timestamp.fromDate(today),
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // Update existing progress
    const progressDoc = snapshot.docs[0];
    const data = progressDoc.data();

    const lastPracticeDate = data.lastPracticeDate?.toDate();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (lastPracticeDate) {
      const lastDate = new Date(lastPracticeDate);
      lastDate.setHours(0, 0, 0, 0);

      if (lastDate.getTime() === yesterday.getTime()) {
        newStreak = (data.currentStreak || 0) + 1;
      } else if (lastDate.getTime() === today.getTime()) {
        newStreak = data.currentStreak || 1;
      }
    }

    const newCompletedAttempts = data.completedAttempts + 1;
    const newAverageScore = score
      ? ((data.averageScore || 0) * data.completedAttempts + score) / newCompletedAttempts
      : data.averageScore;

    const newTotalTime = (data.totalTimeSeconds || 0) + (durationSeconds || 0);
    const newAverageTime = newTotalTime / newCompletedAttempts;

    await updateDoc(doc(db, "user_progress", progressDoc.id), {
      totalAttempts: (data.totalAttempts || 0) + 1,
      completedAttempts: newCompletedAttempts,
      bestScore:
        score && data.bestScore ? Math.max(data.bestScore, score) : score || data.bestScore,
      averageScore: newAverageScore,
      latestScore: score,
      totalTimeSeconds: newTotalTime,
      averageTimeSeconds: newAverageTime,
      lastPracticedAt: now,
      currentStreak: newStreak,
      longestStreak: Math.max(data.longestStreak || 0, newStreak),
      lastPracticeDate: Timestamp.fromDate(today),
      updatedAt: now,
    });
  }
}

/**
 * Get all user progress records
 */
export async function getAllUserProgress(userId: string): Promise<UserProgress[]> {
  if (!db) throw new Error("Firestore not initialized");
  const progressRef = collection(db, "user_progress");
  const q = query(progressRef, where("userId", "==", userId), orderBy("lastPracticedAt", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      lastPracticedAt: data.lastPracticedAt?.toDate(),
      lastPracticeDate: data.lastPracticeDate?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as unknown as UserProgress;
  });
}
