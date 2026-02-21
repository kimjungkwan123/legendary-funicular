(() => {
  const RESULT_DELAY_MS = 900;
  const NO_RESULT_DELAY_MS = 240;

  const sceneLabel = document.getElementById("sceneLabel");
  const sceneTitle = document.getElementById("sceneTitle");
  const sceneBody = document.getElementById("sceneBody");
  const sceneResult = document.getElementById("sceneResult");
  const choicesWrap = document.getElementById("choices");
  const restartBtn = document.getElementById("restartBtn");
  const editorBtn = document.getElementById("editorBtn");
  const editorModal = document.getElementById("editorModal");
  const closeEditorBtn = document.getElementById("closeEditorBtn");
  const applyEditorBtn = document.getElementById("applyEditorBtn");
  const resetEditorBtn = document.getElementById("resetEditorBtn");
  const storyTextarea = document.getElementById("storyTextarea");
  const card = document.querySelector(".card");
  const characterImg = document.getElementById("characterImg");
  const characterMood = document.getElementById("characterMood");
  const CHARACTER_FALLBACK_SRC =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160'><rect width='120' height='160' rx='20' fill='#f5ebe4'/><circle cx='60' cy='52' r='24' fill='#e6c8b8'/><rect x='26' y='84' width='68' height='56' rx='28' fill='#dcb59f'/><circle cx='50' cy='48' r='3' fill='#5b443b'/><circle cx='70' cy='48' r='3' fill='#5b443b'/><path d='M50 62 q10 8 20 0' fill='none' stroke='#5b443b' stroke-width='2'/></svg>"
    );

  const STORAGE_KEY = "proposal_game_story_v3";
  const LEGACY_STORAGE_KEYS = ["proposal_game_story_v1"];
  const DEFAULT_STORY = {
    start: "scene_1",
    nodes: {
      scene_1: {
        label: "[Game Start]",
        title: "Scene 1. 런웨이 뒤편의 우연 (패션쇼장)",
        body:
          "시끄러운 음악과 모델들의 분주한 발소리 속에서, 카메라를 든 기자(남자)가 보입니다. 스태프인 당신(여자)은 그를 본 순간 심장이 뛰기 시작합니다.",
        options: [
          {
            text: "[선택 A] \"페이스북 대나무숲에 올려봐야지. 혹시 여자친구 있으세요?\"",
            result: "용감한 자가 미인을 얻는다.",
            next: "scene_1_5"
          },
          {
            text: "[선택 B] '바빠 보이는데 그냥 일이나 하자...'",
            next: "gameover_1"
          }
        ]
      },
      gameover_1: {
        type: "gameover",
        title: "GAME OVER",
        body: "남자는 취재를 마치고 떠났고, 다시는 만날 수 없었습니다. 인연은 용기 있는 자의 것입니다!"
      },
      scene_1_5: {
        title: "Scene 1.5. 남자의 고민",
        body:
          "남자는 여자에게 연락을 받았지만 고민한다. 이상한 사람일 수도 있기 때문이다.",
        options: [
          {
            text: "A : 이상한 사람이겠지. 무시한다.",
            result: "망설임 끝에 연락을 끊었다. 인연은 여기서 멈춥니다.",
            next: "gameover_1_5"
          },
          {
            text: "B : 나 좋다는데 이상한 사람은 아니겠지. 연락해본다.",
            result: "용기 내어 연락을 이어가 보기로 한다.",
            next: "scene_2"
          }
        ]
      },
      gameover_1_5: {
        type: "gameover",
        title: "GAME OVER",
        body: "서로를 알아갈 기회가 시작되기 전에 끝나버렸습니다."
      },
      scene_2: {
        label: "",
        title: "Scene 2. 6개월의 기다림",
        body:
          "달콤한 데이트를 이어가던 어느 날, 남자가 어렵게 말을 꺼냅니다. \"나 일본으로 6개월간 교환학생을 가게 됐어...\"",
        options: [
          {
            text: "[선택 A] \"못 보내! 나랑 같이 있어줘.\"",
            next: "gameover_2"
          },
          {
            text: "[선택 B] \"그래, 잘 다녀와. 기다릴게.\"",
            result: "쿨하게 보내준 당신 덕분에 두 사람의 신뢰는 더 깊어집니다.",
            next: "scene_3"
          }
        ]
      },
      gameover_2: {
        type: "gameover",
        title: "GAME OVER",
        body: "서로의 일상에 지쳐 연락은 뜸해지고, 결국 자연스럽게 멀어지게 됩니다."
      },
      scene_3: {
        title: "Scene 3. 다시 만난 우리",
        body:
          "6개월 후, 남자가 한국으로 돌아왔습니다. 당신은 망설이다가 먼저 메시지를 보냅니다. \"오랜만이야, 우리 커피 한잔할까?\"",
        options: [
          {
            text: "[선택 A] (남자) \"그래, 얼굴 보고 얘기하자.\"",
            result: "어색함도 잠시, 두 사람은 예전처럼 즐거운 대화를 나눕니다.",
            next: "scene_4"
          },
          {
            text: "[선택 B] (남자) \"미안, 한국 오니까 정신이 없네.\"",
            next: "gameover_3"
          }
        ]
      },
      gameover_3: {
        type: "gameover",
        title: "GAME OVER",
        body: "타이밍이 맞지 않았습니다. 인연의 끈이 느슨해집니다."
      },
      scene_4: {
        title: "Scene 4. 주짓수 도장으로의 초대",
        body:
          "남자가 새로운 취미를 제안합니다. \"나 주짓수 배우고 싶은데 혼자 가긴 좀 쑥스럽네... 같이 가볼래?\"",
        options: [
          {
            text: "[선택 A] \"좋아! 나도 운동 배우고 싶었어.\"",
            result: "함께 땀 흘리며 구르고 웃으며 사이가 더 돈독해집니다.",
            next: "scene_5"
          },
          {
            text: "[선택 B] \"난 운동은 좀... 너 혼자 다녀와.\"",
            next: "gameover_4"
          }
        ]
      },
      gameover_4: {
        type: "gameover",
        title: "GAME OVER",
        body: "함께할 수 있는 공통분모를 놓쳐버렸습니다."
      },
      scene_5: {
        title: "Scene 5. 의심스러운 독서모임",
        body:
          "어느 날 남자가 독서모임을 하자고 제안합니다. 그런데 분위기가 좀 이상합니다. \"이 사람... 혹시 사이비 아니야?\"",
        options: [
          {
            text: "[선택 A] \"미안, 나 그런데 관심 없어.\" (거절)",
            next: "gameover_5"
          },
          {
            text: "[선택 B] \"일단 가볼게. 무슨 책 읽는데?\"",
            result:
              "걱정과 달리 건전한 모임이었고, 둘은 지적인 대화도 잘 통한다는 걸 깨닫습니다.",
            next: "scene_6"
          }
        ]
      },
      gameover_5: {
        type: "gameover",
        title: "GAME OVER",
        body: "남자는 그저 책을 읽고 싶었을 뿐인데... 오해로 인해 멀어집니다."
      },
      scene_6: {
        title: "Scene 6. \"우리 무슨 사이야?\"",
        body:
          "단둘이 보내는 시간이 많아지자, 당신은 확신이 필요해집니다. \"우리... 대체 무슨 사이야?\"",
        options: [
          {
            text: "[선택 A] (남자) \"우린 정말 좋은 친구지.\"",
            next: "gameover_6"
          },
          {
            text: "[선택 B] (남자) \"좋아하는 사이. 연인 사이.\"",
            result: "드디어 공식적인 연인이 되었습니다!",
            next: "scene_7"
          }
        ]
      },
      gameover_6: {
        type: "gameover",
        title: "GAME OVER",
        body: "영원히 '친구 1'로 남게 되었습니다."
      },
      scene_7: {
        title: "Scene 7. 일이야, 나야?",
        body:
          "연애 중, 공부와 대인관계로 바쁜 남자와 연락 문제로 갈등이 생깁니다. 서운함이 폭발한 당신, \"일이 중요해, 내가 중요해?\"",
        options: [
          {
            text: "[선택 A] (남자) \"너도 소중하지. 하지만 내 일도 존중해줘.\"",
            next: "gameover_7"
          },
          {
            text: "[선택 B] (남자) \"왜 이렇게 말이 많아? 우리 그냥 헤어져!\"",
            next: "scene_8"
          }
        ]
      },
      gameover_7: {
        type: "gameover",
        title: "GAME OVER",
        body: "계속되는 서운함과 집착에 결국 서로가 지쳐버립니다."
      },
      scene_8: {
        title: "Scene 8. 후회와 재회",
        body:
          "수많은 연애를 했지만 늘 조금의 실망으로 끝내버렸던 남자. 하지만 당신만큼은 잊히지 않습니다. 남자가 용기를 내어 다시 연락합니다.",
        options: [
          {
            text: "[선택 A] '이제 와서 왜 이래?' 무시한다.",
            next: "gameover_8"
          },
          {
            text: "[선택 B] 답장을 보내 다시 만난다.",
            result: "비 온 뒤 땅이 굳어지듯, 두 사람은 더 단단해집니다.",
            next: "scene_9"
          }
        ]
      },
      gameover_8: {
        type: "gameover",
        title: "GAME OVER",
        body: "당신의 인생에서 그 남자는 완전히 삭제되었습니다."
      },
      scene_9: {
        title: "Scene 9. 여행지의 밤",
        body:
          "남자와 여행을 갔는데 남자가 코를 너무 곱니다. 여자는 짜증이 납니다.",
        options: [
          {
            text: "[선택 9-1] 코를 막는다.",
            result: "욱한 마음에 코를 막아버렸다. 상황은 돌이킬 수 없게 커졌습니다.",
            next: "gameover_9"
          },
          {
            text: "[선택 9-2] 다른 방에 가서 잡니다.",
            result: "잠깐 거리를 두고 진정하기로 했다. 갈등은 크게 번지지 않았습니다.",
            next: "scene_10"
          }
        ]
      },
      gameover_9: {
        type: "gameover",
        title: "GAME OVER",
        body: "남자 사망."
      },
      scene_10: {
        title: "Scene 10. 빨래 전쟁",
        body:
          "남자 집에 놀러갔는데 빨래를 너무 안 합니다. 여자는 짜증이 납니다.",
        options: [
          {
            text: "[선택 A] 아우 빨래좀해.",
            result: "감정 섞인 말이 먼저 나가버렸다. 분위기가 급격히 식어버립니다.",
            next: "gameover_10"
          },
          {
            text: "[선택 B] 빨래 같이 하자. 자연스럽게 말한다.",
            result: "잔소리 대신 제안을 건넸다. 같이 움직이니 분위기가 부드러워졌습니다.",
            next: "scene_11"
          }
        ]
      },
      gameover_10: {
        type: "gameover",
        title: "GAME OVER",
        body: "남자 짜증."
      },
      scene_11: {
        title: "Scene 11. 여행 중 엇갈림",
        body:
          "여행갔는데 남자가 혼자 구경한다. 여자는 짜증이 난다.",
        options: [
          {
            text: "[선택 A] 그렇게 혼자가 좋으면 혼자 살아.",
            result: "서운함이 날카로운 말로 터졌다. 상대도 바로 방어적으로 변했습니다.",
            next: "gameover_11"
          },
          {
            text: "[선택 B] 앞으로는 우리 같이 많이 구경하자. 자기 혼자만의 시간도 존중해줄게.",
            result: "바라는 점과 존중을 함께 전했다. 서로의 속도를 맞추기로 했습니다.",
            next: "scene_12"
          }
        ]
      },
      gameover_11: {
        type: "gameover",
        title: "GAME OVER",
        body: "남자 짜증."
      },
      scene_12: {
        title: "Scene 12. 기억의 온도",
        body:
          "대화를 하는데 남자가 매번 다 까먹는다. 여자는 짜증이 난다.",
        options: [
          {
            text: "[선택 A] 자긴 맨날 다 까먹어?",
            result: "비난조의 말이 먼저 튀어나왔다. 대화가 싸움으로 번집니다.",
            next: "gameover_12"
          },
          {
            text: "[선택 B] 까먹어도 좋아. 앞으로 더 많이 추억 쌓으면 되지.",
            result: "실수를 탓하기보다 미래를 선택했다. 두 사람의 온도가 다시 맞춰집니다.",
            next: "scene_13"
          }
        ]
      },
      gameover_12: {
        type: "gameover",
        title: "GAME OVER",
        body: "남자 짜증."
      },
      scene_13: {
        title: "Scene 13. 마지막 한 발자국",
        body:
          "카페에서 대화하던 도중 당신이 툭 던집니다. \"우리 결혼하자! 근데... 프로포즈는 언제 해줄 거야?\"",
        options: [
          {
            text: "[선택 A] (남자) \"결혼하고 싶으면 네가 먼저 해.\"",
            next: "gameover_13"
          },
          {
            text: "[선택 B] (남자) \"바로 지금.\"",
            next: "proposal_yes"
          }
        ]
      },
      gameover_13: {
        type: "gameover",
        title: "GAME OVER",
        body: "로맨틱한 분위기가 산산조각 났습니다."
      },
      ending_reality: {
        type: "ending",
        title: "💍 [Ending: Reality]",
        body:
          "(이 화면에서 실제 반지나 선물을 건네며 직접 말씀하세요)\n\n\"수많은 오해와 헤어짐의 기로가 있었지만, 결국 내 마지막 선택지는 항상 너였어. 나랑 결혼해줄래?\""
      },
      proposal_yes: {
        type: "proposal",
        title: "💍 [Ending: Reality]",
        body: ""
      }
    }
  };

  const cloneStory = (data) => JSON.parse(JSON.stringify(data));

  const loadStory = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && parsed.start && parsed.nodes) {
          return parsed;
        }
      }

      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacyRaw = window.localStorage.getItem(legacyKey);
        if (!legacyRaw) continue;
        const legacyParsed = JSON.parse(legacyRaw);
        if (!legacyParsed || typeof legacyParsed !== "object") continue;
        if (!legacyParsed.start || !legacyParsed.nodes) continue;
        saveStory(legacyParsed);
        return legacyParsed;
      }

      return cloneStory(DEFAULT_STORY);
    } catch {
      return cloneStory(DEFAULT_STORY);
    }
  };

  const saveStory = (data) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  };

  let storyData = loadStory();
  let currentNodeId = storyData.start;
  let proposalTimers = [];

  const clearChildren = (el) => {
    while (el.firstChild) el.removeChild(el.firstChild);
  };

  const clearProposalTimers = () => {
    proposalTimers.forEach((timerId) => window.clearTimeout(timerId));
    proposalTimers = [];
  };

  const setCharacterMood = (nodeType) => {
    if (characterImg) characterImg.classList.remove("panic");
    if (nodeType === "gameover") {
      characterMood.textContent = "😵 헉... 너무 당황했어!";
      if (characterImg) characterImg.classList.add("panic");
      return;
    }
    if (nodeType === "proposal") {
      characterMood.textContent = "🥹 드디어 이 순간이 왔어.";
      return;
    }
    characterMood.textContent = "😊 차근차근, 우리 잘 해보자!";
  };

  const addChoiceButton = (option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn primary";
    btn.textContent = option.text;
    btn.addEventListener("click", () => {
      if (option.result) {
        sceneResult.textContent = `👉 ${option.result}`;
      } else {
        sceneResult.textContent = "";
      }

      window.setTimeout(() => {
        currentNodeId = option.next;
        render();
      }, option.result ? RESULT_DELAY_MS : NO_RESULT_DELAY_MS);
    });
    choicesWrap.appendChild(btn);
  };

  const renderProposalStage = () => {
    // Proposal scene intentionally has no extra panel/text.
    // Keep the screen minimal for real-life proposal timing.
  };

  const render = () => {
    clearProposalTimers();
    const node = storyData.nodes[currentNodeId];
    card.classList.remove("ending", "proposal");
    clearChildren(choicesWrap);
    sceneResult.textContent = "";

    if (!node) {
      sceneLabel.textContent = "";
      sceneTitle.textContent = "오류";
      sceneBody.textContent = "장면을 불러오지 못했습니다.";
      return;
    }

    sceneLabel.textContent = node.label || "";
    sceneTitle.textContent = node.title || "";
    sceneBody.textContent = node.body || "";
    setCharacterMood(node.type);

    const prevGameOver = document.querySelector(".gameover");
    if (prevGameOver) prevGameOver.remove();

    if (node.type === "gameover") {
      const box = document.createElement("div");
      box.className = "gameover";
      box.textContent = "❌ GAME OVER";
      choicesWrap.appendChild(box);

      addChoiceButton({ text: "처음부터 다시 하기", next: storyData.start });
      return;
    }

    if (node.type === "ending") {
      card.classList.add("ending");
      addChoiceButton({ text: "엔딩 다시 보기", next: "ending_reality" });
      addChoiceButton({ text: "처음부터 다시 하기", next: storyData.start });
      return;
    }

    if (node.type === "proposal") {
      card.classList.add("proposal");
      sceneBody.textContent = "";
      sceneResult.textContent = "";
      renderProposalStage();
      addChoiceButton({ text: "처음부터 다시 하기", next: storyData.start });
      return;
    }

    node.options.forEach(addChoiceButton);
  };

  restartBtn.addEventListener("click", () => {
    currentNodeId = storyData.start;
    render();
  });

  const openEditor = () => {
    storyTextarea.value = JSON.stringify(storyData, null, 2);
    editorModal.classList.add("open");
    editorModal.setAttribute("aria-hidden", "false");
  };

  const closeEditor = () => {
    editorModal.classList.remove("open");
    editorModal.setAttribute("aria-hidden", "true");
  };

  editorBtn.addEventListener("click", openEditor);
  closeEditorBtn.addEventListener("click", closeEditor);

  applyEditorBtn.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(storyTextarea.value);
      if (!parsed || typeof parsed !== "object" || !parsed.start || !parsed.nodes) {
        window.alert("형식이 올바르지 않습니다. start / nodes를 확인해주세요.");
        return;
      }
      storyData = parsed;
      saveStory(storyData);
      currentNodeId = storyData.start;
      closeEditor();
      render();
    } catch {
      window.alert("JSON 문법 오류가 있습니다. 쉼표/따옴표를 확인해주세요.");
    }
  });

  resetEditorBtn.addEventListener("click", () => {
    storyData = cloneStory(DEFAULT_STORY);
    saveStory(storyData);
    storyTextarea.value = JSON.stringify(storyData, null, 2);
    currentNodeId = storyData.start;
    render();
  });

  editorModal.addEventListener("click", (event) => {
    if (event.target === editorModal) closeEditor();
  });

  if (characterImg) {
    characterImg.addEventListener("error", () => {
      if (characterImg.src.includes(CHARACTER_FALLBACK_SRC)) return;
      characterImg.src = CHARACTER_FALLBACK_SRC;
    });
  }

  render();
})();
