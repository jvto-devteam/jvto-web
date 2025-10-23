import { db } from "@/lib/db";

export default async function TestDB() {
  try {
    const result = await db("SELECT NOW()");
    const serverTime = new Date(result[0].now).toLocaleString();

    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">✅ Database Connected!</h1>
        <p>Server time: {serverTime}</p>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-4 text-red-600">
        ❌ Database Connection Failed:
        <pre>{error.message}</pre>
      </div>
    );
  }
}
