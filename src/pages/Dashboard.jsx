
/*
 * Author: Skippy the Magnificent (with some help from G)
 * Version: 1.01
 * Date Modified: 04/07/2025 21:02
 * Comment: Added version number display for frontend and backend in the Control Panel title.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UI_VERSION = "1.01";

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [statusMessage, setStatusMessage] = useState("Ready to launch RankRocket ✨");
    const [serverVersion, setServerVersion] = useState("");

    useEffect(() => {
        fetch("/accounts")
            .then((res) => res.json())
            .then((data) => {
                setAccounts(data);
                const lastUsed = localStorage.getItem("lastSelectedAccount");
                if (lastUsed) {
                    const match = data.find((acc) => acc.email === lastUsed);
                    if (match) setSelectedAccount(match);
                }
            });

        fetch("/version")
            .then((res) => res.json())
            .then((data) => setServerVersion(data.version || ""));
    }, []);

    const handleAccountClick = (account) => {
        setSelectedAccount(account);
        localStorage.setItem("lastSelectedAccount", account.email);
        setStatusMessage(`Selected account: ${account.name} (${account.email})`);
    };

    const handleAddAccount = async () => {
        const res = await fetch("/add-account");
        const data = await res.json();
        window.open(data.authUrl, "_blank");
    };

    const handleRunGPT = () => {
        if (!selectedAccount) return alert("Select an account first.");
        console.log("Running GPT for:", selectedAccount);
    };

    const handleBuildSite = () => {
        if (!selectedAccount) return alert("Select an account first.");
        console.log("Building site for:", selectedAccount);
    };

    const handleReauth = async () => {
        if (!selectedAccount) return alert("Select an account first.");
        const res = await fetch(`/reauth/${selectedAccount.email}`, { method: "POST" });
        const data = await res.json();
        if (data.authUrl) window.open(data.authUrl, "_blank");
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
