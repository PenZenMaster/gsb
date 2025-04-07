
/*
 * Author: Skippy the Magnificent (with some help from G)
 * Version: 1.02
 * Date Modified: 04/07/2025 23:25
 * Comment: Added error handling to Add Account and swapped to full backend URL for dev.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UI_VERSION = "1.02";

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [statusMessage, setStatusMessage] = useState("Ready to launch RankRocket ✨");
    const [serverVersion, setServerVersion] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/accounts")
            .then((res) => res.json())
            .then((data) => {
                setAccounts(data);
                const lastUsed = localStorage.getItem("lastSelectedAccount");
                if (lastUsed) {
                    const match = data.find((acc) => acc.email === lastUsed);
                    if (match) setSelectedAccount(match);
                }
            });

        fetch("http://localhost:3000/version")
            .then((res) => res.json())
            .then((data) => setServerVersion(data.version || ""));
    }, []);

    const handleAccountClick = (account) => {
        setSelectedAccount(account);
        localStorage.setItem("lastSelectedAccount", account.email);
        setStatusMessage(`Selected account: ${account.name} (${account.email})`);
    };

    const handleAddAccount = async () => {
        try {
            const res = await fetch("http://localhost:3000/add-account");
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            window.open(data.authUrl, "_blank");
        } catch (err) {
            console.error("❌ Add Account failed:", err);
            setStatusMessage("❌ Failed to add account. Check backend logs.");
        }
    };

    const handleRunGPT = () => {
        if (!selectedAccount) return alert("Select an account first.");
        setStatusMessage("🧠 Running GPT logic...");
        console.log("Running GPT for:", selectedAccount);
    };

    const handleBuildSite = () => {
        if (!selectedAccount) return alert("Select an account first.");
        setStatusMessage("🌍 Building site...");
        console.log("Building site for:", selectedAccount);
    };

    const handleReauth = async () => {
        if (!selectedAccount) return alert("Select an account first.");
        try {
            const res = await fetch(`http://localhost:3000/reauth/${selectedAccount.email}`, { method: "POST" });
            const data = await res.json();
            if (data.authUrl) window.open(data.authUrl, "_blank");
        } catch (err) {
            console.error("❌ Reauth failed:", err);
            setStatusMessage("❌ Reauth failed. Check backend.");
        }
    };

    return (
        <div className="flex flex-row min-h-screen bg-gray-100 p-4 gap-6">
            <div className="w-1/3 space-y-4">
                <h2 className="text-xl font-bold">Google Accounts</h2>
                {accounts.map((account, idx) => (
                    <div key={idx} onClick={() => handleAccountClick(account)} className={`cursor-pointer rounded-lg p-4 shadow-md ${selectedAccount?.email === account.email ? "bg-green-100 border-2 border-green-500" : "bg-white"}`}>
                        <p className="text-lg font-semibold">{account.name}</p>
                        <p className="text-sm text-gray-600">{account.email}</p>
                    </div>
                ))}
            </div>

            <div className="w-2/3 space-y-6">
                <h2 className="text-xl font-bold">
                    RankRocket Control Panel v{UI_VERSION} {serverVersion && `| Server v${serverVersion}`}
                </h2>
                <div className="flex gap-4 flex-wrap">
                    <Button onClick={handleAddAccount}>➕ Add Account</Button>
                    <Button onClick={handleRunGPT}>🧠 Run GPT</Button>
                    <Button onClick={handleBuildSite}>🌍 Build Site</Button>
                    <Button onClick={handleReauth}>🔁 Reauth</Button>
                </div>
                <div className="mt-4 bg-white rounded-lg shadow p-4 border border-gray-300">
                    <p className="text-green-600 font-semibold">✅ {statusMessage}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
