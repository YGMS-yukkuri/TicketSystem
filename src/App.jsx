import { useState, useEffect, useRef } from "react";
import "./App.css";
import { ArrowRightFill, HelpLine } from '@imaimai17468/digital-agency-icons-react';

const GAS_URL = "https://script.google.com/macros/s/AKfycbxeZNwir5wTo13WBxOehhnl1S7Ud90QhUZEuvPVn0u2L_KRY7UE5tLDzj-chKNoei_bog/exec";
// ↑ あなたのデプロイ済みApps ScriptのURLに変更してください

export default function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [ticket, setTicket] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // --- 追加: モーダル制御 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prevActiveEl = useRef(null);
  const modalCloseBtnRef = useRef(null);

  const openModal = () => {
    prevActiveEl.current = document.activeElement;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // フォーカスを元に戻す
    if (prevActiveEl.current instanceof HTMLElement) {
      prevActiveEl.current.focus();
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    // 開いたらモーダル内の閉じるボタンへフォーカス
    requestAnimationFrame(() => modalCloseBtnRef.current?.focus());
    return () => document.removeEventListener("keydown", onKey);
  }, [isModalOpen]);
  // --- 追加ここまで ---


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
          <option value={""} disabled>製作体験を行う人数を選択</option>
          <option value={"1"}>1人</option>
          <option value={"2"}>2人</option>
          <option value={"3"}>3人</option>
        </select>

        <div className="hint-row" onClick={openModal} aria-expanded={isModalOpen}>
          <HelpLine size={24} />
          <span className="hint-text" style={{ textDecoration: "underline", cursor: "pointer" }}>3人以上で参加したい場合は？</span>
        </div>

        <select value={timeslot} onChange={(e) => setTimeslot(e.target.value)} required>
          <option value={""} disabled>整理券に記載された時間帯を選択</option>
          <optgroup label="金曜日">
            <option value={"Fri 12:45~13:00"}>12:45~13:00</option>
            <option value={"Fri 13:00~13:30"}>13:00~13:30</option>
            <option value={"Fri 13:30~14:00"}>13:30~14:00</option>
            <option value={"Fri 14:00~14:30"}>14:00~14:30</option>
            <option value={"Fri 14:30~15:00"}>14:30~15:00</option>
            <option value={"Fri 15:00~15:30"}>15:00~15:30</option>
          </optgroup>
          <optgroup label="土曜日">
            <option value={"Sat 9:30~10:00"}>9:30~10:00</option>
            <option value={"Sat 10:00~10:30"}>10:00~10:30</option>
            <option value={"Sat 10:30~11:00"}>10:30~11:00</option>
            <option value={"Sat 11:00~11:30"}>11:00~11:30</option>
            <option value={"Sat 11:30~12:00"}>11:30~12:00</option>
            <option value={"Sat 12:00~12:30"}>12:00~12:30</option>
            <option value={"Sat 12:30~13:00"}>12:30~13:00</option>
            <option value={"Sat 13:00~13:30"}>13:00~13:30</option>
            <option value={"Sat 13:30~14:00"}>13:30~14:00</option>
            <option value={"Sat 14:00~"}>14:00~</option>
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


        {/* モーダル */}
        {isModalOpen && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              // オーバーレイクリックで閉じる（中のダイアログクリックは無視）
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <h2 id="modal-title">3人以上で参加する場合</h2>
              <p>
                3人以上で参加したい場合は、複数に分かれて整理券を取得してください。<br />一枚の整理券当たりの最大参加人数は3人までとなっています。
              </p>
              <div className="modal-actions">
                <button
                  ref={modalCloseBtnRef}
                  onClick={closeModal}
                  className="btn"
                  aria-label="閉じる"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

      </form>
      {ticket && <p className="result">{ticket}</p>}
    </div>
  );
}
