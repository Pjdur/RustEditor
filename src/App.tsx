import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import "./App.css";

function App() {
  const [content, setContent] = useState<string>("");
  const [filePath, setFilePath] = useState<string | null>(null);

  // Trigger Native Open File Dialog
  const handleOpen = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Text Files", extensions: ["txt", "md", "json", "js"] }],
      });

      if (selected && typeof selected === "string") {
        // Pass the path to Rust backend to read the file safely
        const fileContent = await invoke<string>("open_file", { path: selected });
        setContent(fileContent);
        setFilePath(selected);
      }
    } catch (error) {
      console.error("Failed to open file:", error);
    }
  };

  // Trigger Native Save File Dialog (or direct save if file path exists)
  const handleSave = async () => {
    try {
      let path = filePath;

      // If it's a new file, ask the user where to save it
      if (!path) {
        const selected = await save({
          filters: [{ name: "Text Files", extensions: ["txt", "md"] }],
        });
        if (selected) {
          path = selected;
          setFilePath(selected);
        }
      }

      if (path) {
        await invoke("save_file", { path, content });
        alert("File saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save file:", error);
    }
  };

  return (
  <div className="editor-container">
    <div className="toolbar">
      <div className="button-group">
        <button onClick={handleOpen}>📂 Open</button>
        <button onClick={handleSave}>💾 Save</button>
      </div>
      <span className="file-path" title={filePath || "New File"}>
        {filePath ? filePath : "Untitled.txt"}
      </span>
    </div>
    <div className="editor-workspace">
      <textarea
        className="text-editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type something amazing here..."
        spellCheck="false"
      />
    </div>
  </div>
);
}

export default App;
