
import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";


export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [log, setLog] = useState("Ready to launch RankRocket ✨\n");

  useEffect(() => {
    fetch("http://localhost:3001/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => setLog((log) => log + `❌ Failed to load accounts: ${err.message}\n`));
  }, []);

  const selectAccount = (account) => {
    setSelectedAccount(account);
    setLog((log) => log + `Selected account: ${account.name} (${account.email})\n`);
  };

  const runGPT = async () => {
    setLog((log) => log + `🧠 Running GPT content generation for ${selectedAccount?.niche}...\n`);
    try {
      const res = await fetch("http://localhost:3001/run-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedAccount.email })
      });
      const result = await res.json();
      setLog((log) => log + `✅ GPT complete: ${result.message}\n`);
    } catch (err) {
      setLog((log) => log + `❌ GPT failed: ${err.message}\n`);
    }
  };

  const buildSite = async () => {
    setLog((log) => log + `🌍 Launching Google Site builder for ${selectedAccount?.niche}...\n`);
    try {
      const res = await fetch("http://localhost:3001/build-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedAccount.email })
      });
      const result = await res.json();
      setLog((log) => log + `✅ Site build complete: ${result.message}\n`);
    } catch (err) {
      setLog((log) => log + `❌ Site builder failed: ${err.message}\n`);
    }
  };

  return (
    <div className="p-4 grid grid-cols-4 gap-4 min-h-screen">
      <div className="col-span-1 space-y-4">
        <h2 className="text-xl font-bold">Google Accounts</h2>
        {accounts.map((acc) => (
          <Card key={acc.email} onClick={() => selectAccount(acc)} className="hover:bg-muted cursor-pointer">
            <CardContent className="p-2">
              <p className="font-semibold">{acc.name}</p>
              <p className="text-sm text-muted-foreground">{acc.email}</p>
              <p className="text-xs italic">{acc.niche}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="col-span-3 space-y-4">
        <h1 className="text-2xl font-bold">RankRocket Control Panel</h1>

        <div className="flex gap-2">
          <Button disabled={!selectedAccount} onClick={runGPT}>🧠 Run GPT</Button>
          <Button disabled={!selectedAccount} onClick={buildSite}>🌍 Build Site</Button>
          <Button disabled={!selectedAccount}>🔄 Reauth</Button>
        </div>

        <div>
          <Textarea className="w-full h-80 font-mono text-sm" readOnly value={log} />
        </div>
      </div>
    </div>
  );
}
