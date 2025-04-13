import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [log, setLog] = useState("🚀 Ready to launch RankRocket\n");

  useEffect(() => {
    fetch("http://localhost:3001/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error("❌ Failed to fetch accounts:", err));
  }, []);

  const selectAccount = (acc) => {
    setSelectedAccount(acc);
    setLog((prev) => prev + `\n✅ Selected: ${acc.name} (${acc.email})`);
  };

  const runGPT = async () => {
    if (!selectedAccount) return;
    const res = await fetch("http://localhost:3001/run-gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: selectedAccount.email }),
    });
    const data = await res.json();
    setLog((prev) => prev + `\n🧠 GPT: ${data.message}`);
  };

  const buildSite = async () => {
    if (!selectedAccount) return;
    const res = await fetch("http://localhost:3001/build-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: selectedAccount.email }),
    });
    const data = await res.json();
    setLog((prev) => prev + `\n🌍 Site: ${data.message}`);
  };

  const reauth = async () => {
    if (!selectedAccount) return;
    const res = await fetch("http://localhost:3001/reauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: selectedAccount.email }),
    });
    const data = await res.json();
    setLog((prev) => prev + `\n🔄 Reauth: ${data.message}`);
  };

  const launchOAuth = () => {
    window.open("http://localhost:3001/auth/start?force=true", "_blank", "popup,width=500,height=600");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-gray-700">Google Accounts</h2>
          {accounts.map((acc, idx) => (
            <div key={idx} onClick={() => selectAccount(acc)} className="cursor-pointer">
              <Card
                className={`p-4 transition border shadow-sm rounded-xl ${selectedAccount?.email === acc.email
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <div className="font-semibold">{acc.name}</div>
                <div className="text-xs text-gray-500">{acc.email}</div>
              </Card>
            </div>
          ))}
        </div>

        {/* Main Panel */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">RankRocket Control Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Manage content generation and site builds with style.</p>
          </div>

          {/* Button Row */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={launchOAuth} className="bg-black text-white hover:bg-gray-800">
              ➕ Add Account
            </Button>
            <Button disabled={!selectedAccount} onClick={runGPT} className="bg-purple-600 text-white hover:bg-purple-700">
              🧠 Run GPT
            </Button>
            <Button disabled={!selectedAccount} onClick={buildSite} className="bg-green-600 text-white hover:bg-green-700">
              🌍 Build Site
            </Button>
            <Button disabled={!selectedAccount} onClick={reauth} className="bg-blue-600 text-white hover:bg-blue-700">
              🔄 Reauth
            </Button>
          </div>

          {/* Status Box */}
          {!selectedAccount && (
            <div className="text-sm font-semibold text-red-600">
              👉 Please select an account from the list of Google accounts.
            </div>
          )}

          <div>
            <Textarea
              className="w-full h-80 font-mono text-sm p-4 rounded-lg border border-gray-300 bg-gray-50 shadow-inner resize-none"
              readOnly
              value={log}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
