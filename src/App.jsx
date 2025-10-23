import { useState, useEffect } from "react";
import "./App.css";
import { ArrowRightFill } from '@imaimai17468/digital-agency-icons-react';

const GAS_URL = "https://script.google.com/macros/s/AKfycbxeZNwir5wTo13WBxOehhnl1S7Ud90QhUZEuvPVn0u2L_KRY7UE5tLDzj-chKNoei_bog/exec";
// ↑ あなたのデプロイ済みApps ScriptのURLに変更してください

export default function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [ticket, setTicket] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 送信開始：ボタンは無効のままにし、スピナーを表示
    setIsDisabled(true);
    setIsLoading(true);


    const params = new URLSearchParams();
    params.append("name", name);
    params.append("amount", amount);
    params.append("timeslot", timeslot);

    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      setTicket(`${data.ticket}`);
      // レスポンス受信時はスピナーを止めるが、ボタンは無効のままにする
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setTicket("通信エラーが発生しました。");
      setIsLoading(false);
      setIsDisabled(false); // エラー時はボタンを再度有効化
    }
  };

  useEffect(() => {
    if (ticket) {
      const timer = setTimeout(() => {
        setTicket("");
        // 一定時間後にボタンを再度有効化する
        setIsDisabled(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [ticket]);

  return (
    <div className="app">
      <h1>108整理券登録システム</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ニックネームを入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select value={amount} onChange={(e) => setAmount(e.target.value)} required>
          <option value={""} disabled>制作する人数を選択</option>
          <option value={"1"}>1人</option>
          <option value={"2"}>2人</option>
          <option value={"3"}>3人</option>
        </select>
        <select value={timeslot} onChange={(e) => setTimeslot(e.target.value)} required>
          <option value={""} disabled>整理券に記載された時間帯を選択</option>
          <optgroup label="金曜日">
            <option value={"F12:45~13:00"}>12:45~13:00</option>
            <option value={"F13:00~13:30"}>13:00~13:30</option>
            <option value={"F13:30~14:00"}>13:30~14:00</option>
            <option value={"F14:00~14:30"}>14:00~14:30</option>
            <option value={"F14:30~15:00"}>14:30~15:00</option>
            <option value={"F15:00~15:30"}>15:00~15:30</option>
          </optgroup>
          <optgroup label="土曜日">
            <option value={"S9:30~10:00"}>9:30~10:00</option>
            <option value={"S10:00~10:30"}>10:00~10:30</option>
            <option value={"S10:30~11:00"}>10:30~11:00</option>
            <option value={"S11:00~11:30"}>11:00~11:30</option>
            <option value={"S11:30~12:00"}>11:30~12:00</option>
            <option value={"S12:00~12:30"}>12:00~12:30</option>
            <option value={"S12:30~13:00"}>12:30~13:00</option>
            <option value={"S13:00~13:30"}>13:00~13:30</option>
            <option value={"S13:30~14:00"}>13:30~14:00</option>
            <option value={"S14:00~"}>14:00~</option>
          </optgroup>
        </select>
        <button
          type="submit"
          disabled={isDisabled}
          aria-busy={isLoading}
          aria-disabled={isDisabled}
        >
          {isLoading ? (
            <span className="btn-content">
              <span className="spinner" aria-hidden="true"></span>
              <span className="visually-hidden">送信中</span>
            </span>
          ) : (
            <span className="btn-content">送信<ArrowRightFill size={16} /></span>
          )}
        </button>
      </form>
      {ticket && <p className="result">{ticket}</p>}
    </div>
  );
}
