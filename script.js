document.addEventListener("DOMContentLoaded", () => {
    const sentenceInput = document.getElementById("sentenceInput");
    const btnAnalyze = document.getElementById("btnAnalyze");
    const sentenceList = document.getElementById("sentenceList");

    const currentSentenceTitle = document.getElementById("currentSentence");
    const detailDesc = document.getElementById("detailDesc");
    const stepCounter = document.getElementById("stepCounter");
    const btnPlay = document.getElementById("btnPlay");
    const btnSlow = document.getElementById("btnSlow");

    const visContainer = document.getElementById("visContainer");
    const loadingOverlay = document.getElementById("loading-overlay");

    let historyData = [];
    let currentSentObj = null;
    let isAnimating = false;

    // --- NLP UI LOGIC --- //

    function renderHistory() {
        sentenceList.innerHTML = "";
        historyData.forEach((sent) => {
            let div = document.createElement("div");
            div.className = "sentence-item";
            div.textContent = sent.text;
            if (currentSentObj && sent.text === currentSentObj.text) div.classList.add("active");
            div.onclick = () => selectSentence(sent, div);
            sentenceList.appendChild(div);
        });
    }

    async function analyzeSentence() {
        if (isAnimating) return;
        const text = sentenceInput.value.trim();
        if (!text) return;

        btnAnalyze.disabled = true;
        btnAnalyze.textContent = "正在连接大脑处理...";
        loadingOverlay.classList.remove("hidden");

        try {
            const response = await fetch("/parse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) throw new Error("网络错误");

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            if (!historyData.some(h => h.text === result.text)) {
                historyData.unshift(result);
                if (historyData.length > 10) historyData.pop();
            }

            renderHistory();
            selectSentence(result, document.querySelector(".sentence-item"));
            sentenceInput.value = "";

        } catch (err) {
            alert("API 请求失败: " + err);
        } finally {
            btnAnalyze.disabled = false;
            btnAnalyze.textContent = "⚡ 解析底层逻辑";
            loadingOverlay.classList.add("hidden");
        }
    }

    function selectSentence(sentObj, uiElem) {
        if (isAnimating) return;
        document.querySelectorAll(".sentence-item").forEach(el => el.classList.remove("active"));
        if (uiElem) uiElem.classList.add("active");

        currentSentObj = sentObj;
        currentSentenceTitle.textContent = sentObj.text;
        btnPlay.disabled = false;
        btnSlow.disabled = false;

        resetStage();
    }

    function resetStage() {
        gsap.killTweensOf("*");
        visContainer.innerHTML = '<div class="intro-placeholder">就绪。点击播放按钮观察认知过程。</div>';
        detailDesc.textContent = "点击播放按钮体验 0.1 秒的大脑认知建模之旅。";
        stepCounter.textContent = "(0/5)";
    }

    // --- 2D/CSS VISUAL ENGINE --- //

    function getShapeClass(stepIdx, word) {
        const w = word.toLowerCase();
        if (stepIdx === 0) {
            return w.includes("承受者") ? "subject-passive" : "subject";
        }
        if (stepIdx === 1) {
            return w.includes("非现实") ? "reality-modal" : "reality-real";
        }
        if (stepIdx === 2) {
            return w.includes("过去") ? "time-past" : "time-present";
        }
        if (stepIdx === 3) {
            if (w.includes("be +") || w.includes("been") || w.includes("was") || w.includes("were")) {
                if (w.includes("have been")) return "core-have-been";
                if (w.includes("passive")) return "core-passive-be";
                return "core-be";
            }
            if (w.includes("have")) {
                if (w.includes("done")) return "core-have-done";
                return "core-have";
            }
            return "core-do";
        }
        if (stepIdx === 4) return "space";
        return "";
    }

    async function playEngine(speedMultiplier) {
        if (!currentSentObj || isAnimating) return;
        isAnimating = true;
        btnPlay.disabled = true;
        btnSlow.disabled = true;

        visContainer.innerHTML = "";
        const steps = currentSentObj.steps;
        const baseDuration = (speedMultiplier === "slow") ? 1.2 : 0.4;

        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];

            // Create step item DOM
            const stepItem = document.createElement("div");
            stepItem.className = "step-item";

            const shape = document.createElement("div");
            shape.className = `shape ${getShapeClass(i, step.word)}`;

            const label = document.createElement("div");
            label.className = "word-label";
            label.textContent = step.word;

            const name = document.createElement("div");
            name.className = "step-name";
            name.textContent = step.name.split(" ")[1]; // Get the name part

            stepItem.appendChild(shape);
            stepItem.appendChild(label);
            stepItem.appendChild(name);
            visContainer.appendChild(stepItem);

            // Update Text UI
            stepCounter.textContent = `(${i + 1}/5)`;
            detailDesc.innerHTML = `<strong style="color:var(--accent-cyan); font-size:1.2rem;">[${step.name}]</strong> <br><br>👉 选中字眼: <span style="color:#fff;">${step.word}</span> <br>🧠 神经动作: <span style="color:var(--text-muted);">${step.desc}</span>`;

            // Animate
            await gsap.to(stepItem, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: baseDuration,
                ease: "back.out(1.7)"
            });

            // Wait a bit before next step
            await new Promise(r => setTimeout(r, baseDuration * 500));
        }

        detailDesc.innerHTML += `<br><br><span style="color:var(--accent-green);">✅ 0.1秒语感通路建模完成！</span>`;
        isAnimating = false;
        btnPlay.disabled = false;
        btnSlow.disabled = false;
    }

    btnPlay.addEventListener("click", () => playEngine("fast"));
    btnSlow.addEventListener("click", () => playEngine("slow"));
    btnAnalyze.addEventListener("click", analyzeSentence);
    sentenceInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            analyzeSentence();
        }
    });

    // Load initial data if needed (optional)
    if (window.SentenceData && window.SentenceData.length > 0) {
        historyData = window.SentenceData.slice(0, 5);
        renderHistory();
    }
});
