import { useState, useEffect, use} from "react";
import "./App.css";
import { ArrowRightFill } from '@imaimai17468/digital-agency-icons-react';

const GAS_URL = "https://script.google.com/macros/s/AKfycbxeZNwir5wTo13WBxOehhnl1S7Ud90QhUZEuvPVn0u2L_KRY7UE5tLDzj-chKNoei_bog/exec";
// ↑ あなたのデプロイ済みApps ScriptのURLに変更してください

export default function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [ticket, setTicket] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsClicked(true);


    const params = new URLSearchParams();
    params.append("name", name);
    params.append("amount", amount);

    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      setTicket(`整理券番号：${data.ticket}`);
    } catch (err) {
      console.error(err);
      setTicket("通信エラーが発生しました。");
      setIsClicked(false);
    }
  };

  useEffect(() => {
    if (ticket) {
      const timer = setTimeout(() => {
        setTicket("");
        setIsClicked(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [ticket]);

  return (
    <div className="app">
      <h1>108在庫管理システム</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前を入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          step="1"
          min="1"
          placeholder="制作個数を入力"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit" disabled={isClicked}>送信<ArrowRightFill size={16} /></button>
      </form>
      {ticket && <p className="result">{ticket}</p>}
    </div>
  );
}
