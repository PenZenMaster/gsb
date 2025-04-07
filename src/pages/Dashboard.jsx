import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [log, setLog] = useState("Ready to launch RankRocket ✨\n");

  useEffect(() => {
    fetch("http://localhost:3001/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error("Failed to fetch accounts:", err));
  }, []);

  const selectAccount = (acc) => {
    setSelectedAccount(acc);
    setLog((prev) =>
      prev + `\n\n✅ Selected account: ${acc.name} (${acc.email})\n`
    );
    console.log("🔥 Account clicked:", acc);
  };

  const runGPT = async () => {
    if (!selectedAccount) return;
    const res = await fetch("http://localhost:3001/run-gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: selectedAccount.email }),
    });
    const data = await res.json();
    setLog((prev) => prev + `\n🧠 ${data.message}\n`);
  };

  const buildSite = async () => {
    if (!selectedAccount) return;
    const res = await fetch("http://localhost:3001/build-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: selectedAccount.email }),
    });
    const data = await res.json();
    setLog((prev) => prev + `\n🌍 ${data.message}\n`);
  };

  const reauth = async () => {
    if (!selectedAccount) return;
    console.log("🔥 Reauth clicked for", selectedAccount.email);
    const res = await fetch("http://localhost:3001/reauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: selectedAccount.email }),
    });
    console.log("📡 Reauth response status:", res.status);
    const data = await res.json();
    console.log("📦 Reauth response JSON:", data);
    setLog((prev) => prev + `\n🔄 ${data.message}\n`);
  };

  const handleAddAccount = () => {
    if (!accounts || accounts.length === 0) {
      window.open("http://localhost:3001/auth/start?force=true", "_blank");
      return;
    }

    const existingEmails = accounts.map((acc) => acc.email.toLowerCase());
    const warning = `🧠 Heads up!\n\nYou're currently signed in with:\n\n${existingEmails.join(",\n")}\n\nTo add a different Google account:\n• Open this link in an **Incognito** window\n• Or sign out of your current Google account in your browser\n\nOpen the link anyway?`;

    const confirmed = window.confirm(warning);
    if (confirmed) {
      window.open("http://localhost:3001/auth/start?force=true", "_blank");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      <div className="col-span-1 space-y-4">
        <h2 className="text-lg font-bold">Google Accounts</h2>
        {accounts.map((acc, idx) => (
          <div key={idx} onClick={() => selectAccount(acc)} className="cursor-pointer">
            <Card
              className={`p-4 border ${selectedAccount?.email === acc.email ? "border-green-600 bg-green-50" : ""
                }`}
            >
              <div className="font-semibold">{acc.name}</div>
              <div className="text-xs text-gray-500">{acc.email}</div>
            </Card>
          </div>
        ))}
      </div>

      <div className="col-span-3 space-y-4">
        <h1 className="text-2xl font-bold">RankRocket Control Panel</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddAccount}>➕ Add Account</Button>
          <Button disabled={!selectedAccount} onClick={runGPT}>🧠 Run GPT</Button>
          <Button disabled={!selectedAccount} onClick={buildSite}>🌍 Build Site</Button>
          <Button disabled={!selectedAccount} onClick={reauth}>🔄 Reauth</Button>
        </div>

        {!selectedAccount && (
          <div className="text-red-600 font-semibold text-sm">
            👉 Please select an account from the list of Google accounts.
          </div>
        )}

        <div>
          <Textarea className="w-full h-80 font-mono text-sm" readOnly value={log} />
        </div>
      </div>
    </div>
  );
}
