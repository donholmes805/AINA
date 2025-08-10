import { get, put } from '@vercel/blob';
import { User, UserRole } from '../types';

export const config = {
  runtime: 'edge',
};

const CONFIG_PATH = 'config.json';
const ADMIN_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin';

// Fetches config, or creates a default if it doesn't exist.
async function getConfig() {
    try {
        const blob = await get(CONFIG_PATH);
        return await blob.json();
    } catch (error: any) {
        if (error.status === 404) {
            // First run, create default config
            const defaultConfig = { password: DEFAULT_PASSWORD };
            await put(CONFIG_PATH, JSON.stringify(defaultConfig), { access: 'protected' });
            return defaultConfig;
        }
        throw error;
    }
}

export default async function handler(req: Request) {
    if (req.method === 'POST') { // Handle Login
        try {
            const { username, password } = await req.json();
            const config = await getConfig();

            if (username.toLowerCase() === ADMIN_USERNAME && password === config.password) {
                const user: User = { id: 'user_admin_01', name: 'Admin', role: UserRole.Admin };
                return new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                return new Response(JSON.stringify({ error: 'Invalid username or password.' }), { status: 401 });
            }
        } catch (error) {
            console.error('Login error:', error);
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
        }
    }

    if (req.method === 'PUT') { // Handle Password Change
        try {
            const { oldPassword, newPassword } = await req.json();
            if (!newPassword || newPassword.length < 4) {
                return new Response(JSON.stringify({ error: 'New password must be at least 4 characters long.' }), { status: 400 });
            }

            const config = await getConfig();
            if (oldPassword !== config.password) {
                return new Response(JSON.stringify({ error: 'Your current password is not correct.' }), { status: 403 });
            }

            const newConfig = { password: newPassword };
            await put(CONFIG_PATH, JSON.stringify(newConfig), { access: 'protected' });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } catch (error) {
            console.error('Password change error:', error);
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
        }
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}