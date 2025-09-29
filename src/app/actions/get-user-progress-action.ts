'use server';

import 'server-only';
import { headers } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin-config';
import { getUserProgress } from '@/lib/firebase/firestore';

export async function getUserProgressAction() {
    try {
        const authorization = headers().get('Authorization');
        if (!authorization?.startsWith('Bearer ')) {
            return null;
        }
        const idToken = authorization.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        return await getUserProgress(userId);

    } catch (error) {
        console.error("Error fetching user progress: ", error);
        return null;
    }
}
