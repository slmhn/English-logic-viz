import spacy
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os

app = FastAPI()

# Allow CORS so our frontend HTML can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the spaCy English model (make sure to: python -m spacy download en_core_web_sm)
print("Loading spaCy model...")
try:
    nlp = spacy.load("en_core_web_sm")
    print("Model loaded successfully!")
except OSError:
    print("Model not found. Please run: python -m spacy download en_core_web_sm")
    exit(1)

def parse_sentence_to_5_steps(text: str):
    doc = nlp(text)
    
    # Defaults
    subject = "Unknown"
    subject_desc = "未找到明确主语"
    
    reality = "现实域"
    reality_desc = "事实客观陈述"
    
    time_stamp = "现在的"
    time_desc = "基于现在的判定"
    
    core_type = "do"
    core_word = ""
    core_desc = "默认动作能量发射"
    
    space_word = "N/A"
    space_desc = "动作承受者或空间界标"

    # Quick scan for components
    verb_root = None
    auxiliaries = []
    
    for token in doc:
        if token.dep_ == "ROOT":
            verb_root = token
        if token.dep_ in ["aux", "auxpass"]:
            auxiliaries.append(token)
            
    if not verb_root:
        return {
            "error": "Failed to find the root verb. Please enter a complete sentence."
        }

    # 1. Subject Extraction
    for child in verb_root.children:
        if child.dep_ in ["nsubj", "nsubjpass", "csubj"]:
            subject = "".join([t.text_with_ws for t in child.subtree]).strip()
            subject_desc = "动作的发出者或射体(Trajector)"
            if child.dep_ == "nsubjpass":
                subject_desc = "承受者(被提拔为了主语)"
            break

    # 2. Reality (Modals)
    modals = ["will", "would", "can", "could", "shall", "should", "may", "might", "must"]
    has_modal = False
    for aux in auxiliaries:
        if aux.lemma_.lower() in modals:
            reality = f"非现实域 ({aux.text})"
            reality_desc = f"借助情态动词 {aux.text} 表达说话人的推论或意愿"
            has_modal = True
            
            # Time shift for modals
            if aux.lemma_.lower() in ["would", "could", "should", "might"]:
                time_stamp = "过去的/委婉的"
            break

    # 3. Time (Tense)
    # If no modal, check the first verb (root or first aux) for tense
    if not has_modal:
        first_verb = auxiliaries[0] if auxiliaries else verb_root
        if first_verb.morph.get("Tense"):
            tense = first_verb.morph.get("Tense")[0]
            if tense == "Past":
                time_stamp = "过去的"
                time_desc = f"时间烙印在 {first_verb.text} 上，将事件整体拉回过去"
            else:
                time_stamp = "现在的"
                time_desc = f"时间烙印在 {first_verb.text} 上，锚定当前事实"
                
    # 4. Core (Be/Do/Have + Voice/Aspect)
    is_passive = any(aux.dep_ == "auxpass" for aux in auxiliaries)
    is_perfect = any(aux.lemma_ == "have" for aux in auxiliaries)
    is_continuous = any(aux.lemma_ == "be" and aux.dep_ == "aux" for aux in auxiliaries)
    
    root_lemma = verb_root.lemma_.lower()
    
    if is_passive:
        core_type = "be"
        core_word = f"be + {verb_root.text} (done)"
        core_desc = "状态被动化：作为承受动作后的固化结果存在"
        if is_perfect:
            core_type = "have-been"
            core_word = f"have been {verb_root.text}"
            core_desc = "包裹住曾经存在过并被作用的成果叠加态（双重框架被动）"
    elif is_perfect:
        if is_continuous:
            core_type = "have-been"
            core_word = f"have been {verb_root.text}"
            core_desc = "双重框架：包裹过去的经验并且状态还在延续进行"
        else:
            core_type = "have-done"
            core_word = f"have {verb_root.text}"
            core_desc = "将过去的动作作为一种【经验/成果】包裹在现在层"
    else:
        # Simple Aspect
        if root_lemma == "be":
            core_type = "be"
            core_word = verb_root.text
            core_desc = "表达一种纯粹的客观存在状态"
        elif root_lemma == "have":
            core_type = "have"
            core_word = verb_root.text
            core_desc = "表示拥有、打包或经验法则"
        else:
            core_type = "do"
            if is_continuous:
                core_word = f"be {verb_root.text}"
                core_desc = "正在鲜活进行释放的动态动作"
            else:
                core_word = verb_root.text
                core_desc = "向外界释放能量，执行动作"

    # 5. Space (Landmark/Object/Prep)
    space_elements = []
    for child in verb_root.children:
        if child.dep_ in ["dobj", "pobj", "attr", "acomp", "prep"]:
            ext = "".join([t.text_with_ws for t in child.subtree]).strip()
            space_elements.append(ext)
    
    if space_elements:
        space_word = " ".join(space_elements)
        space_desc = "能量释放的界标或空间落点"
        
    return {
        "text": text,
        "steps": [
            { "name": "1. 确立原点 (主语/Trajector)", "word": subject, "desc": subject_desc },
            { "name": "2. 划定疆域 (认识情态)", "word": reality, "desc": reality_desc },
            { "name": "3. 打上时间戳 (Temporal Grounding)", "word": time_stamp, "desc": time_desc },
            { "name": "4. 事件底色 (Action Chain/Bounding)", "word": core_word, "desc": core_desc },
            { "name": "5. 空间界标 (Landmark/Prep)", "word": space_word, "desc": space_desc }
        ]
    }

@app.get("/")
async def get_index():
    return FileResponse("index.html")

@app.post("/parse")
async def parse_sentence(request: Request):
    data = await request.json()
    sentence = data.get("text", "")
    if not sentence:
        return {"error": "Empty sentence"}
        
    result = parse_sentence_to_5_steps(sentence)
    return result

# Mount static files (optional, but good for script.js, style.css)
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    print("🚀 NLP Cognitive Grammar Engine starting...")
    print("👉 Please open: http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
