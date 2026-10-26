import { Activity, AlertTriangle, Download, FileText, HardDrive, Logs, ShieldCheck } from "lucide-react";

export default function Reports() {
  function exportReport() {
    const lines = [
      "BEGATE DRIVE LAB — TECHNICAL REPORT",
      "Prototype version: 0.1.0",
      "Report type: Prototype status report",
      "",
      "HARDWARE STATUS",
      "Mode: Simulation",
      "Controller: Not connected",
      "Detected drives: 0",
      "Active recovery sessions: 0",
      "",
      "DATA INTEGRITY NOTE",
      "No physical drive was accessed. No real drive identity, sector-read results, imaging statistics, or recovery results are available.",
      "",
      "This report records prototype status only and is not a report of a real recovery operation."
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Begate-Drive-Lab-Prototype-Report.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return <section className="panel report-workspace">
    <div className="panel-head">
      <div><h2>Technical reports</h2><p>Export a clear record of diagnostics and recovery activity.</p></div>
      <span className="pill">REFERENCE MODE</span>
    </div>
    <div className="report-banner">
      <div className="report-icon"><FileText size={23}/></div>
      <div><b>Begate Drive Lab technical report</b><p>This report describes the current prototype state. No physical drive has been connected, so it contains no real drive diagnostics or recovery results.</p></div>
    </div>
    <div className="report-grid">
      <div className="report-content-list">
        <label className="field-label">REPORT CONTENT</label>
        <div className="report-line"><ShieldCheck size={15}/><span>Safety and hardware connection status</span><span className="pill green">Available</span></div>
        <div className="report-line"><HardDrive size={15}/><span>Drive identity and capacity</span><span className="pill">No device</span></div>
        <div className="report-line"><Activity size={15}/><span>Imaging and recovery statistics</span><span className="pill">No session</span></div>
        <div className="report-line"><Logs size={15}/><span>Operation and error log</span><span className="pill blue">Prototype events</span></div>
      </div>
      <div className="report-preview">
        <label className="field-label">REPORT PREVIEW</label>
        <h3>Begate Drive Lab</h3>
        <p className="report-subtitle">Technical Diagnostics Report · Prototype 0.1.0</p>
        <div className="report-separator"/>
        <div className="report-data"><span>Hardware mode</span><b>Simulation</b></div>
        <div className="report-data"><span>Controller status</span><b>Not connected</b></div>
        <div className="report-data"><span>Detected drives</span><b>0</b></div>
        <div className="report-data"><span>Recovery sessions</span><b>0</b></div>
        <div className="report-warning"><AlertTriangle size={14}/> No live hardware data included.</div>
        <button className="btn primary wide" onClick={exportReport}><Download size={15}/> Export report (TXT)</button>
      </div>
    </div>
    <div className="warning"><ShieldCheck size={16}/><p><b>Accuracy first.</b> Report fields for model, serial, firmware, sector reads, errors, and recovered files will populate only after a verified hardware backend and real session data are available.</p></div>
  </section>;
}
