import { useEffect, useState } from "react";
import { squares, type Square } from "@/lib/board-data";

const styles = `
  body.career-ladder-body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 10px; min-height: 100vh; box-sizing: border-box; }
  .career-ladder-body *, .career-ladder-body *:before, .career-ladder-body *:after { box-sizing: inherit; }
  .game-container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 20px; padding: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  @media (min-width: 768px) { body.career-ladder-body { padding: 20px; } .game-container { padding: 30px; } }
  .gc-header { text-align: center; margin-bottom: 20px; }
  .gc-header h1 { color: #2c3e50; font-size: 1.8em; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
  @media (min-width: 768px) { .gc-header h1 { font-size: 2.5em; } }
  .subtitle { color: #7f8c8d; font-size: 1em; margin-top: 10px; }
  @media (min-width: 768px) { .subtitle { font-size: 1.2em; } }
  .game-board { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 20px 0; }
  @media (min-width: 480px) { .game-board { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 768px) { .game-board { grid-template-columns: repeat(4, 1fr); gap: 15px; } }
  @media (min-width: 1024px) { .game-board { grid-template-columns: repeat(6, 1fr); } }
  .square { width: 100%; min-height: 140px; border: 3px solid #bdc3c7; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; padding: 12px 8px; cursor: pointer; transition: all 0.3s ease; position: relative; background: #f8f9fa; }
  .square:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
  .bronze { background: linear-gradient(135deg, #cd7f32 0%, #a0522d 100%); border-color: #8b4513; color: white; }
  .silver { background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%); border-color: #696969; color: white; }
  .gold { background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%); border-color: #ff8c00; color: #2c3e50; }
  .milestone { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border-color: #a93226; color: white; font-weight: bold; position: relative; overflow: hidden; grid-column: span 2; }
  @media (min-width: 768px) { .milestone { grid-column: span 1; } }
  .milestone::before { content: '🏆'; position: absolute; top: -5px; right: -5px; font-size: 1.5em; animation: cl-bounce 2s infinite; }
  @keyframes cl-bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
  .square-number { background: rgba(255,255,255,0.3); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 6px; font-size: 0.9em; flex-shrink: 0; }
  .gold .square-number { background: rgba(0,0,0,0.1); }
  .square-title { font-size: 0.85em; font-weight: bold; margin-bottom: 4px; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .square-desc { font-size: 0.7em; line-height: 1.2; opacity: 0.9; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .level-header { grid-column: 1 / -1; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 15px; text-align: center; border-radius: 15px; font-size: 1.1em; font-weight: bold; margin: 15px 0 5px 0; }
  @media (min-width: 768px) { .level-header { font-size: 1.5em; padding: 20px; } }
  .cl-modal { position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); overflow-y: auto; padding: 10px; }
  .modal-content { background-color: white; margin: 15% auto; padding: 20px; border-radius: 20px; width: 100%; max-width: 600px; position: relative; animation: cl-slideDown 0.3s ease; color: #2c3e50; }
  @media (min-width: 768px) { .modal-content { margin: 5% auto; padding: 30px; } }
  @keyframes cl-slideDown { from { opacity: 0; transform: translateY(-50px); } to { opacity: 1; transform: translateY(0); } }
  .cl-close { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; position: absolute; right: 15px; top: 10px; }
  .cl-close:hover { color: #000; }
  .criteria-list { list-style: none; padding: 0; }
  .criteria-list li { padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #3498db; font-size: 0.9em; }
  .legend { display: flex; justify-content: center; gap: 15px; margin: 20px 0; flex-wrap: wrap; font-size: 0.85em; }
  @media (min-width: 768px) { .legend { gap: 30px; font-size: 1em; } }
  .legend-item { display: flex; align-items: center; gap: 8px; color: #2c3e50; }
  .legend-box { width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0; }
  .scroll-controls { position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 99; }
  .scroll-btn { background-color: #2c3e50; color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.2em; transition: all 0.2s ease; user-select: none; }
  .scroll-btn:hover { background-color: #34495e; transform: scale(1.05); }
  .scroll-btn:active { transform: scale(0.95); }
`;

const Index = () => {
  const [active, setActive] = useState<Square | null>(null);

  useEffect(() => {
    document.title = "Agape Career Ladder - Interactive Game Board";
    document.body.classList.add("career-ladder-body");
    return () => document.body.classList.remove("career-ladder-body");
  }, []);

  const scrollGame = (direction: "up" | "down") => {
    const amount = window.innerHeight * 0.6;
    window.scrollBy({ top: direction === "up" ? -amount : amount, behavior: "smooth" });
  };

  const legend = [
    { t: "bronze", label: "Bronze Level", bg: "linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)" },
    { t: "silver", label: "Silver Level", bg: "linear-gradient(135deg, #c0c0c0 0%, #808080 100%)" },
    { t: "gold", label: "Gold Level", bg: "linear-gradient(135deg, #ffd700 0%, #ffb347 100%)" },
    { t: "milestone", label: "Major Milestone", bg: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="game-container">
        <header className="gc-header">
          <h1>🏠 Agape Career Ladder Journey</h1>
          <p className="subtitle">Your Path to Professional Growth & Success</p>
        </header>

        <div className="legend">
          {legend.map((l) => (
            <div className="legend-item" key={l.t}>
              <span className="legend-box" style={{ background: l.bg }} />
              {l.label}
            </div>
          ))}
        </div>

        <div className="game-board">
          {squares.map((sq, i) =>
            sq.type === "header" ? (
              <div className="level-header" key={i}>
                <div>{sq.title}</div>
                <div style={{ fontSize: "0.7em", opacity: 0.9, fontWeight: "normal", marginTop: 4 }}>{sq.desc}</div>
              </div>
            ) : (
              <div className={`square ${sq.type}`} key={i} onClick={() => setActive(sq)}>
                <div className="square-number">{sq.number}</div>
                <div className="square-title">{sq.title}</div>
                <div className="square-desc">{sq.desc}</div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="scroll-controls">
        <button className="scroll-btn" onClick={() => scrollGame("up")} title="Scroll Up" aria-label="Scroll up">▲</button>
        <button className="scroll-btn" onClick={() => scrollGame("down")} title="Scroll Down" aria-label="Scroll down">▼</button>
      </div>

      {active && (
        <div className="cl-modal" onClick={(e) => { if (e.target === e.currentTarget) setActive(null); }}>
          <div className="modal-content">
            <span className="cl-close" onClick={() => setActive(null)}>×</span>
            <h2 style={{ marginTop: 0 }}>{active.title}</h2>
            <p style={{ fontSize: "1.05em", color: "#555" }}>{active.desc}</p>
            {active.criteria && (
              <>
                <h3>Requirements to Complete:</h3>
                <ul className="criteria-list">
                  {active.criteria.map((c, idx) => <li key={idx}>✓ {c}</li>)}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
