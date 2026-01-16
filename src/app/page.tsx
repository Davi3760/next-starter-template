"use client";

import Script from "next/script";

export default function Home() {
  return (
    <>
      <header>
        <h1>Separar tiles e reconstruir o mapa</h1>
        <p>Carregue a imagem do mapa, recorte os tiles e veja o mapa refeito.</p>
      </header>

      <div className="tab-bar">
        <nav className="tabs">
          <button id="tabMap" type="button" className="active">
            Mapa
          </button>
          <button id="tabSprite" type="button">
            Personagem
          </button>
          <button id="tabMonster" type="button">
            Monstros
          </button>
        </nav>
        <div className="tab-actions">
          <button id="saveProjectBtn" type="button">
            Salvar projeto
          </button>
          <label className="file-btn primary">
            Carregar projeto
            <input
              id="loadProjectInput"
              type="file"
              accept="application/json"
            />
          </label>
          <button id="testPlayerBtn" type="button">
            Testar
          </button>
        </div>
      </div>

      <section id="testPanel" className="test-panel">
        <div className="panel">
          <h2>Teste no mapa</h2>
          <div className="test-view">
            <canvas id="testCanvas" width={320} height={320} />
            <div id="starterOverlay" className="starter-overlay">
              <strong>Escolha seu pokemon inicial</strong>
              <div id="starterOptions" className="starter-options" />
            </div>
            <div id="battleOverlay" className="battle-overlay">
              <div className="battle-top">
                <canvas id="battleCanvas" width={320} height={220} />
              </div>
              <div id="battleDialog" className="battle-dialog">
                <span id="battleText">Um monstro selvagem apareceu!</span>
                <span id="battleMore" className="more">
                  ƒ-¬
                </span>
              </div>
              <div id="battleMenu" className="battle-menu">
                <button id="fightBtn" type="button">
                  Lutar
                </button>
                <button id="teamBtn" type="button">
                  Monstro
                </button>
                <button id="itemBtn" type="button">
                  Item
                </button>
                <button id="runBtn" type="button">
                  Fugir
                </button>
              </div>
              <div id="battleMoves" className="battle-moves hidden">
                <button id="moveBtn1" type="button">
                  Golpe 1
                </button>
                <button id="moveBtn2" type="button">
                  Golpe 2
                </button>
                <button id="moveBtn3" type="button">
                  Golpe 3
                </button>
                <button id="moveBtn4" type="button">
                  Golpe 4
                </button>
                <button id="moveBackBtn" type="button">
                  Voltar
                </button>
              </div>
            </div>
          </div>
          <p className="note">Camera centralizada no personagem.</p>
        </div>
      </section>

      <section id="mapTab" className="tab-content active">
        <section className="controls">
          <label>
            Imagem do mapa
            <input id="imageInput" type="file" accept="image/*" multiple />
          </label>
          <label>
            Tamanho do tile (px)
            <input
              id="tileSize"
              type="number"
              min={4}
              max={64}
              defaultValue={16}
            />
          </label>
          <label>
            Largura do mapa (tiles)
            <input
              id="mapWidth"
              type="number"
              min={8}
              max={256}
              defaultValue={100}
            />
          </label>
          <label>
            Altura do mapa (tiles)
            <input
              id="mapHeight"
              type="number"
              min={8}
              max={256}
              defaultValue={100}
            />
          </label>
          <button id="genBtn" type="button">
            Gerar novo mapa
          </button>
        </section>
        <section className="pickers">
          <div id="imageList" className="image-list" />
          <button id="pickGrass" type="button" data-pick="grass">
            Selecionar grama
          </button>
          <div className="picker-preview">
            <canvas id="previewGrass" width={32} height={32} />
          </div>
          <button id="pickTallGrass" type="button" data-pick="tallgrass">
            Selecionar grama alta
          </button>
          <div className="picker-preview">
            <canvas id="previewTallGrass" width={32} height={32} />
          </div>
          <button id="pickWater" type="button" data-pick="water">
            Selecionar agua
          </button>
          <div className="picker-preview">
            <canvas id="previewWater" width={32} height={32} />
          </div>
          <button id="pickPath" type="button" data-pick="path">
            Selecionar caminho
          </button>
          <div className="picker-preview">
            <canvas id="previewPath" width={32} height={32} />
          </div>
          <button id="pickWall" type="button" data-pick="wall">
            Selecionar muro
          </button>
          <div className="picker-preview">
            <canvas id="previewWall" width={32} height={32} />
          </div>
          <button id="pickRock" type="button" data-pick="rock">
            Selecionar rocha
          </button>
          <div className="picker-preview">
            <canvas id="previewRock" width={32} height={32} />
          </div>
          <button id="pickHouse" type="button" data-pick="house">
            Selecionar casa
          </button>
          <div className="picker-preview">
            <canvas id="previewHouse" width={32} height={32} />
          </div>
          <button id="pickTree" type="button" data-pick="tree">
            Selecionar arvore
          </button>
          <div className="picker-preview">
            <canvas id="previewTree" width={32} height={32} />
          </div>
          <button id="pickDecor" type="button" data-pick="decor">
            Selecionar NPC/decoracao
          </button>
          <div className="picker-preview">
            <canvas id="previewDecor" width={32} height={32} />
          </div>
          <label>
            Largura da selecao
            <input
              id="stampWidth"
              className="picker-input"
              type="number"
              min={1}
              max={20}
              defaultValue={1}
            />
          </label>
          <label>
            Altura da selecao
            <input
              id="stampHeight"
              className="picker-input"
              type="number"
              min={1}
              max={20}
              defaultValue={1}
            />
          </label>
          <span id="stampCount" className="note">
            0 blocos
          </span>
          <p className="note">
            Use &quot;Largura da selecao&quot; e &quot;Altura da selecao&quot;.
            Selecao na imagem original aplica o tamanho para NPC/decoracao,
            casa, arvore e rocha.
          </p>
        </section>

        <section className="grid">
          <div className="panel">
            <h2>Imagem original</h2>
            <div className="canvas-wrap">
              <canvas id="sourceCanvas" />
            </div>
            <p className="note">A imagem carregada fica aqui.</p>
          </div>
          <div className="panel">
            <h2>Novo mapa</h2>
            <div className="canvas-wrap">
              <div className="map-stack">
                <canvas id="genCanvas" />
                <canvas id="playerCanvas" />
              </div>
            </div>
            <p className="note">Mapa gerado com as mesmas pecas.</p>
          </div>
        </section>
      </section>

      <section id="spriteTab" className="tab-content">
        <section className="controls">
          <label>
            Spritesheet do personagem
            <input id="spriteInput" type="file" accept="image/*" />
          </label>
          <label>
            Largura do frame (px)
            <input
              id="frameWidth"
              type="number"
              min={8}
              max={128}
              defaultValue={16}
            />
          </label>
          <label>
            Altura do frame (px)
            <input
              id="frameHeight"
              type="number"
              min={8}
              max={128}
              defaultValue={16}
            />
          </label>
          <label>
            Animacao
            <select id="animType" defaultValue="idle">
              <option value="idle">Idle</option>
              <option value="down">Walking baixo</option>
              <option value="up">Walking cima</option>
              <option value="side">Walking lado</option>
            </select>
          </label>
          <label>
            Frames da animacao
            <input
              id="animFrames"
              type="number"
              min={1}
              max={12}
              defaultValue={2}
            />
          </label>
          <label>
            Frame atual
            <input
              id="animFrameIndex"
              type="number"
              min={1}
              max={12}
              defaultValue={1}
            />
          </label>
        </section>
        <section className="grid">
          <div className="panel">
            <h2>Spritesheet</h2>
            <div className="canvas-wrap">
              <canvas id="spriteCanvas" />
            </div>
            <p className="note">
              Clique no frame inicial para preencher os frames da animacao.
            </p>
          </div>
          <div className="panel">
            <h2>Preview do personagem</h2>
            <div className="canvas-wrap">
              <canvas id="spritePreview" width={64} height={64} />
            </div>
            <div className="canvas-wrap">
              <canvas id="animPreview" width={128} height={128} />
            </div>
            <p className="note">Preview da animacao selecionada.</p>
          </div>
        </section>
      </section>

      <section id="monsterTab" className="tab-content">
        <section className="controls">
          <label>
            Spritesheet dos monstros
            <input id="monsterInput" type="file" accept="image/*" />
          </label>
          <label>
            Quantidade de monstros
            <input
              id="monsterCount"
              type="number"
              min={1}
              max={50}
              defaultValue={3}
            />
          </label>
          <label>
            Monstro atual
            <input
              id="monsterIndex"
              type="number"
              min={1}
              max={50}
              defaultValue={1}
            />
          </label>
          <label>
            Nome do monstro
            <input
              id="monsterName"
              type="text"
              placeholder="Ex: Pikachu"
            />
          </label>
          <label>
            Largura da selecao (px)
            <input
              id="monsterSelWidth"
              type="number"
              min={4}
              max={256}
              defaultValue={32}
            />
          </label>
          <label>
            Altura da selecao (px)
            <input
              id="monsterSelHeight"
              type="number"
              min={4}
              max={256}
              defaultValue={32}
            />
          </label>
        </section>
        <section className="pickers">
          <button id="monsterPickFront" type="button">
            Selecionar frente
          </button>
          <div className="picker-preview">
            <canvas id="monsterFrontPreview" width={32} height={32} />
          </div>
          <button id="monsterPickBack" type="button">
            Selecionar costas
          </button>
          <div className="picker-preview">
            <canvas id="monsterBackPreview" width={32} height={32} />
          </div>
          <p className="note">
            Clique no spritesheet para selecionar. Use as setas para mover 1px.
          </p>
        </section>
        <section className="grid">
          <div className="panel">
            <h2>Spritesheet dos monstros</h2>
            <div className="canvas-wrap">
              <canvas id="monsterCanvas" />
            </div>
            <p className="note">
              Selecione frente ou costas do monstro atual.
            </p>
          </div>
          <div className="panel">
            <h2>Preview dos monstros</h2>
            <div className="canvas-wrap">
              <canvas id="monsterPreview" width={160} height={120} />
            </div>
            <p className="note">Preview frente/costas do monstro atual.</p>
          </div>
        </section>
      </section>

      <Script src="/app.js" strategy="afterInteractive" />

      <style jsx global>{`
        :root {
          --bg: #e8f4f8;
          --ink: #1b2b34;
          --accent: #2a7a7b;
          --panel: #ffffff;
          --border: #b7d3d9;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            sans-serif;
          color: var(--ink);
          background: radial-gradient(
              1200px 600px at 15% -10%,
              #cfeef0 0%,
              transparent 60%
            ),
            linear-gradient(135deg, #e8f4f8 0%, #f6fbfd 100%);
        }

        header {
          padding: 24px 20px 10px;
          text-align: center;
        }

        header h1 {
          margin: 0 0 8px;
          font-size: 22px;
          letter-spacing: 0.5px;
        }

        header p {
          margin: 0;
          color: #3b4b51;
        }

        .tab-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 8px 20px 0;
          flex-wrap: wrap;
        }

        .tabs {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .tabs button {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
        }

        .tabs button.active {
          background: #e1f3f3;
          border-color: #82babb;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        .tab-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .tab-actions button,
        .tab-actions label {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 8px 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .tab-actions button,
        .tab-actions .primary {
          cursor: pointer;
          color: #fff;
          background: var(--accent);
          border-color: #206869;
        }

        .test-panel {
          display: none;
          padding: 0 20px 12px;
        }

        .test-panel.active {
          display: block;
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: center;
          padding: 16px 20px 8px;
        }

        .pickers {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: center;
          padding: 0 20px 18px;
        }

        .image-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          align-items: center;
        }

        .image-list button {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 12px;
        }

        .image-list button.active {
          background: #e1f3f3;
          border-color: #82babb;
        }

        .pickers button {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 8px 12px;
          cursor: pointer;
        }

        .pickers button.active {
          background: #e1f3f3;
          border-color: #82babb;
        }

        .picker-preview {
          width: 40px;
          height: 40px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: #f5fbfb;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .picker-input {
          width: 64px;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .picker-select {
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: #fff;
        }

        .controls label,
        .controls button {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 14px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .file-btn {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .file-btn input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .controls input[type="number"] {
          width: 72px;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .controls button {
          cursor: pointer;
          color: #fff;
          background: var(--accent);
          border-color: #206869;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }

        .controls button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(42, 122, 123, 0.25);
        }

        .grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          padding: 12px 20px 28px;
        }

        .panel {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 12px;
          min-height: 240px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .panel h2 {
          margin: 0;
          font-size: 16px;
        }

        .canvas-wrap {
          overflow: auto;
          border: 1px dashed #c9dde2;
          border-radius: 10px;
          padding: 10px;
          background: #f9fcfd;
        }

        .map-stack {
          position: relative;
          display: inline-block;
        }

        #playerCanvas {
          position: absolute;
          left: 0;
          top: 0;
          pointer-events: none;
        }

        .test-view {
          width: min(520px, 100%);
          aspect-ratio: 1 / 1;
          border: 1px dashed #c9dde2;
          border-radius: 10px;
          overflow: hidden;
          background: #f9fcfd;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        #testCanvas {
          width: 100%;
          height: 100%;
        }

        .battle-overlay {
          position: absolute;
          inset: 0;
          background: rgba(248, 252, 253, 0.96);
          display: none;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }

        .battle-overlay.active {
          display: flex;
        }

        #battleCanvas {
          width: 100%;
          height: 100%;
          border: 1px solid #b7d3d9;
          border-radius: 8px;
          background: #ffffff;
        }

        .battle-top {
          flex: 1;
          min-height: 0;
        }

        .battle-dialog {
          background: #ffffff;
          border: 2px solid #3a3a3a;
          border-radius: 6px;
          padding: 10px 12px;
          min-height: 120px;
          max-height: 120px;
          display: flex;
          align-items: center;
          font-size: 13px;
          position: relative;
        }

        .battle-dialog.hidden {
          display: none;
        }

        .battle-dialog .more {
          position: absolute;
          right: 10px;
          bottom: 6px;
          font-size: 12px;
          color: #1b2b34;
          display: none;
        }

        .battle-dialog.more .more {
          display: inline;
        }

        .battle-menu,
        .battle-moves {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          background: #ffffff;
          border: 2px solid #3a3a3a;
          border-radius: 6px;
          padding: 12px;
          min-height: 120px;
          align-items: center;
        }

        .battle-menu.hidden,
        .battle-moves.hidden {
          display: none;
        }

        .battle-menu button,
        .battle-moves button {
          background: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 8px 10px 8px 22px;
          cursor: pointer;
          font-weight: 600;
          text-align: left;
          position: relative;
        }

        .battle-menu button.selected::before,
        .battle-moves button.selected::before {
          content: "ƒ-ô";
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
          color: #1b2b34;
          font-size: 12px;
        }

        .battle-status {
          font-size: 12px;
          color: #3b4b51;
        }

        .starter-overlay {
          position: absolute;
          inset: 0;
          background: rgba(248, 252, 253, 0.96);
          display: none;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          align-items: center;
          justify-content: center;
        }

        .starter-overlay.active {
          display: flex;
        }

        .starter-options {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .starter-card {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 10px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          min-width: 120px;
        }

        .starter-card canvas {
          width: 64px;
          height: 64px;
        }

        canvas {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }

        .note {
          margin: 0;
          font-size: 12px;
          color: #526168;
        }
      `}</style>
    </>
  );
}
