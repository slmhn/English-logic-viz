const SentenceData = [];

// Helper to add sentences
function add(category, text, s1_w, s1_desc, s2_w, s2_desc, s3_w, s3_desc, s4_w, s4_desc, s5_w, s5_desc) {
    SentenceData.push({
        category: category,
        text: text,
        steps: [
            { name: "1. 确立原点 (主语)", word: s1_w, desc: s1_desc },
            { name: "2. 划定疆域 (现实/非现实)", word: s2_w, desc: s2_desc },
            { name: "3. 打上时间戳 (现在/过去)", word: s3_w, desc: s3_desc },
            { name: "4. 事件底色 (Be/Do/Have)", word: s4_w, desc: s4_desc },
            { name: "5. 空间定位 (介词/宾语)", word: s5_w, desc: s5_desc }
        ]
    });
}

const subjects = [
    { w: "I", desc: "第一人称 '我'" }, { w: "You", desc: "第二人称 '你/你们'" },
    { w: "He", desc: "第三人称单数男 '他'" }, { w: "She", desc: "第三人称单数女 '她'" },
    { w: "It", desc: "第三人称单数物 '它'" }, { w: "We", desc: "第一人称复数 '我们'" },
    { w: "They", desc: "第三人称复数 '他们'" }, { w: "The cat", desc: "具体名词的主语" },
    { w: "My boss", desc: "具体人的主语" }, { w: "This book", desc: "具体物的主语" }
];

const beComplements = [
    { w: "happy", desc: "处于开心的状态" }, { w: "in the room", desc: "处于房间内部的空间" },
    { w: "a teacher", desc: "等同于老师的身份" }, { w: "ready", desc: "处于准备好的状态" },
    { w: "on the table", desc: "贴合在桌子表面" }
];

// Generate 30 Present Be sentences
for (let i = 0; i < 30; i++) {
    let sub = subjects[i % subjects.length];
    let comp = beComplements[i % beComplements.length];
    let beForm = (sub.w === "I") ? "am" : (["You", "We", "They"].includes(sub.w) ? "are" : "is");
    add(
        "现在时: Be状态 (30句)",
        `${sub.w} ${beForm} ${comp.w}.`,
        sub.w, sub.desc,
        "现实域", "客观陈述，无概率滤镜，事实",
        "现在的", `烙印烫在核心动词身上，变为 ${beForm}`,
        `be -> ${beForm}`, "处于特定的稳固状态中",
        comp.w, comp.desc
    );
}

// Generate 10 be going to (Present for Future)
const doVerbsConfig = [
    { w: "play tennis", desc: "执行打网球的动作能量" }, { w: "read a book", desc: "执行读书的动作能量" },
    { w: "eat an apple", desc: "吃苹果的动作" }, { w: "run fast", desc: "快速奔跑" }
];
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let beForm = (sub.w === "I") ? "am" : (["You", "We", "They"].includes(sub.w) ? "are" : "is");
    let act = doVerbsConfig[i % doVerbsConfig.length];
    add(
        "现在时: be going to 表将来 (10句)",
        `${sub.w} ${beForm} going to ${act.w}.`,
        sub.w, sub.desc,
        "现实域 (含趋向)", "以现在事实(going)来规划未来的趋势",
        "现在的", `烙印在 ${beForm} 上`,
        `be -> ${beForm} going`, "处于向某事进发的动态趋势中",
        `to ${act.w}`, `指向目标动作：${act.w}`
    );
}

// Generate 10 be doing (Present Continuous / Future)
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let beForm = (sub.w === "I") ? "am" : (["You", "We", "They"].includes(sub.w) ? "are" : "is");
    let actWord = doVerbsConfig[i % doVerbsConfig.length].w.split(" ")[0]; // play, read...
    let objWord = doVerbsConfig[i % doVerbsConfig.length].w.split(" ").slice(1).join(" "); // tennis, a book...

    // basic ing rule
    let ingWord = actWord + (actWord.endsWith('e') && actWord !== 'see' ? actWord.slice(0, -1) + 'ing' : actWord + 'ing');
    if (actWord === "run") ingWord = "running";
    if (actWord === "eat") ingWord = "eating"; // naive rules for simplicity

    add(
        "现在时: be doing 进行/将来 (10句)",
        `${sub.w} ${beForm} ${ingWord} ${objWord}.`.trim() + ".",
        sub.w, sub.desc,
        "现实域", "正在发生或已经安排妥当的确凿事实",
        "现在的", `时间戳烙印在 ${beForm}`,
        `be -> ${beForm}`, "处于某种状态之中(由ing名词化动作)",
        `${ingWord} ${objWord}`, "空间展开：被当前活动所包裹"
    );
}

// Generate 10 Present Do
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let act = doVerbsConfig[i % doVerbsConfig.length];
    let verb = act.w.split(" ")[0];
    let obj = act.w.split(" ").slice(1).join(" ");
    let doForm = (["He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? (verb + (verb.endsWith('e') ? 's' : 's')) : verb;
    // Special handling just in case, naive fallback
    if (verb === "play") doForm = (["He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "plays" : "play";
    if (verb === "go") doForm = (["He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "goes" : "go";

    add(
        "现在时: Do 动作 (10句)",
        `${sub.w} ${doForm} ${obj}.`.replace(/ \./, '.'),
        sub.w, sub.desc,
        "现实域", "客观的一般事实或习惯律",
        "现在的", "隐藏的do/does烙印在动词表面",
        `do -> ${doForm}`, "释放能量，执行动作",
        obj || "N/A", "能量的承受者或方向"
    );
}

// Generate 10 Present Have
const possessions = [
    { w: "a car", desc: "一辆车" }, { w: "two apples", desc: "两个苹果" },
    { w: "some time", desc: "一些时间" }, { w: "a good idea", desc: "一个好主意" }
];
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let poss = possessions[i % possessions.length];
    let haveForm = (["He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "has" : "have";

    add(
        "现在时: Have 拥有/经验 (10句)",
        `${sub.w} ${haveForm} ${poss.w}.`,
        sub.w, sub.desc,
        "现实域", "确定的客观拥有事实",
        "现在的", `烙印在 have 上，变形为 ${haveForm}`,
        `have -> ${haveForm}`, "拥有、打包包裹住某种物品或属性",
        poss.w, poss.desc
    );
}

// Generate 10 Past Be
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let comp = beComplements[i % beComplements.length];
    let wasForm = (["I", "He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "was" : "were";

    add(
        "过去时: Be状态 (10句)",
        `${sub.w} ${wasForm} ${comp.w}.`,
        sub.w, sub.desc,
        "现实域", "过去发生了的客观事实",
        "过去的", `烙印在动词上，${wasForm} 使得整个场景向过去推移`,
        `be -> ${wasForm}`, "当时处于的状态框定",
        comp.w, comp.desc
    );
}

// Generate 10 Past Do
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let act = doVerbsConfig[i % doVerbsConfig.length];
    let pastVerb = act.w.split(" ")[0]; // need mapping
    let pastMap = { "play": "played", "read": "read", "eat": "ate", "run": "ran" };
    let verb = pastMap[pastVerb] || pastVerb + "ed";
    let obj = act.w.split(" ").slice(1).join(" ");

    add(
        "过去时: Do 动作 (10句)",
        `${sub.w} ${verb} ${obj}.`.replace(/ \./, '.'),
        sub.w, sub.desc,
        "现实域", "发生在过去的确定事实",
        "过去的", `隐藏的did附着，动词变为 ${verb}`,
        `do -> ${verb}`, "在过去某刻释放了这股能量",
        obj || "N/A", "过去的能量承受区域"
    );
}

// Generate 10 Past Have
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let poss = possessions[i % possessions.length];

    add(
        "过去时: Have 拥有/经验 (10句)",
        `${sub.w} had ${poss.w}.`,
        sub.w, sub.desc,
        "现实域", "过去存在的确切事实",
        "过去的", "将核心动词向后拉回过去时间轴",
        "have -> had", "在过去曾包裹或拥有该物",
        poss.w, poss.desc
    );
}

// Generate 20 Modal Will
for (let i = 0; i < 20; i++) {
    let sub = subjects[i % subjects.length];
    let act = doVerbsConfig[i % doVerbsConfig.length];
    add(
        "情态动词将要: Will (20句重点)",
        `${sub.w} will ${act.w}.`,
        sub.w, sub.desc,
        "非现实域 (100%信念)", "预测未来，是一种强烈的个人脑补和意愿规划，尚未成为物理事实",
        "现在的", "时间戳打在情态动词身上保留为will（不退后）",
        "do (原形保命)", `核心动词 ${act.w.split(" ")[0]} 被情态动词保护，保持原形`,
        act.w.split(" ").slice(1).join(" ") || "N/A", "动作辐射的空间方向或对象"
    );
}

// Generate other Modals (can, could, must, should, may, might, would)
const modals = [
    { m: "can", time: "现在的", realDesc: "非现实域 (80%信念)：个人推测的客观能力" },
    { m: "could", time: "过去的/委婉的", realDesc: "非现实域：can向后退一步，由于时间或心理上的推移，能力感变弱" },
    { m: "must", time: "现在的", realDesc: "非现实域 (99%信念)：极高概率的逻辑推理或主观强制" },
    { m: "should", time: "过去的/委婉的", realDesc: "非现实域：shall退一步，主观认为理应发生的义务或预期" },
    { m: "may", time: "现在的", realDesc: "非现实域 (50%信念)：五五开的主观猜测，或者请求许可" },
    { m: "might", time: "过去的/委婉的", realDesc: "非现实域 (30%信念)：may退一步，可能性极低的谨慎猜测" },
    { m: "would", time: "过去的/委婉的", realDesc: "非现实域：will退一步，过去将要或虚拟语气里的意愿" }
];

for (let mod of modals) {
    for (let i = 0; i < 10; i++) {
        let sub = subjects[i % subjects.length];
        let stateIndex = i % 3; // mix be, do, have
        let coreStr, coreDesc, tailStr;
        if (stateIndex === 0) { // be
            coreStr = "be"; coreDesc = "be保持原形纯粹状态"; tailStr = "happy";
        } else if (stateIndex === 1) { // do
            coreStr = doVerbsConfig[i % doVerbsConfig.length].w.split(" ")[0];
            coreDesc = "do原形动作能量释放"; tailStr = doVerbsConfig[i % doVerbsConfig.length].w.split(" ").slice(1).join(" ");
        } else { // have
            coreStr = "have"; coreDesc = "have容器原形属性"; tailStr = "a car";
        }

        add(
            `情态猜测意愿: ${mod.m.charAt(0).toUpperCase() + mod.m.slice(1)} (10句)`,
            `${sub.w} ${mod.m} ${coreStr} ${tailStr}.`.replace(/ \./, '.'),
            sub.w, sub.desc,
            mod.realDesc, "情态滤镜遮罩在事件上方",
            mod.time, `时间烙印在情态动词上：${mod.m}`,
            coreStr, coreDesc,
            tailStr, "最终的空间或状态依附点"
        );
    }
}

// IF Sentences
for (let i = 0; i < 10; i++) {
    let sub1 = subjects[i % subjects.length];
    let sub2 = subjects[(i + 1) % subjects.length];
    // if I were you, I would play.
    let ifBe = (["I", "He", "She", "It"].includes(sub1.w)) ? "were" : "were"; // subjunctive mood is typical
    add(
        "条件与虚拟: If从句 (10句)",
        `If ${sub1.w} ${ifBe} ready, ${sub2.w} would go.`,
        "条件前提 (If)", "引导设定另外一个平行宇宙的时空泡泡",
        "极端非现实域 (虚拟)", "如果是反事实，由于100%非现实，强制将时间轴大幅向过去推",
        "时间退步 (假的过去)", "用表示过去时间戳的 were/would 来拉扯距离感",
        "两个核心态", "从句：were (Be状态)；主句：would + go (原形)",
        "时空泡泡融合", "条件成立，则触发主句结果，否则两个空间都不存在"
    );
}

// Generate 10 Have done (Present Perfect)
const pastParticiples = [
    { w: "played tennis", desc: "打网球的完成状态" }, { w: "read a book", desc: "把书读完的状态" },
    { w: "eaten an apple", desc: "吃掉苹果的状态" }, { w: "finished work", desc: "完成工作的状态" }
];
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let pp = pastParticiples[i % pastParticiples.length];
    let haveForm = (["He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "has" : "have";
    add(
        "完成时: Have done 动作经验 (10句)",
        `${sub.w} ${haveForm} ${pp.w}.`,
        sub.w, sub.desc,
        "现实域", "客观陈述已经具备的经验/成果",
        "现在的", `时间戳打在 ${haveForm}`,
        `have/has (容器)`, "将过去的动作作为一种【经验/成果】包裹在现在的时间点",
        `${pp.w} (done)`, "被彻底封印、凝固的动作结果"
    );
}

// Generate 10 Have been (Present Perfect State)
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let comp = beComplements[i % beComplements.length];
    let haveForm = (["He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "has" : "have";
    add(
        "完成时: Have been 状态延续 (10句)",
        `${sub.w} ${haveForm} been ${comp.w}.`,
        sub.w, sub.desc,
        "现实域", "客观陈述一直处于的状态",
        "现在的", `时间戳打在 ${haveForm}`,
        `have/has (容器)`, "包裹住一种【存在】状态",
        `been ${comp.w}`, `从过去延续到现在的固定状态: ${comp.w}`
    );
}

// Generate 10 Have been doing (Present Perfect Continuous)
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let haveForm = (["He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "has" : "have";
    let actWord = doVerbsConfig[i % doVerbsConfig.length].w.split(" ")[0];
    let ingWord = actWord + (actWord.endsWith('e') && actWord !== 'see' ? actWord.slice(0, -1) + 'ing' : actWord + 'ing');
    if (actWord === "run") ingWord = "running";
    if (actWord === "eat") ingWord = "eating";
    let objWord = doVerbsConfig[i % doVerbsConfig.length].w.split(" ").slice(1).join(" ");

    add(
        "完成时: Have been doing 动作延续 (10句)",
        `${sub.w} ${haveForm} been ${ingWord} ${objWord}.`.trim() + ".",
        sub.w, sub.desc,
        "现实域", "极其确定的连续不断的事实",
        "现在的", `烙印在 ${haveForm} 作为当下的盘点`,
        `have been (双重框架)`, "同时具备包裹经验(have)和稳定状态(be)的双层能量底盘",
        `${ingWord} ${objWord}`, "正在鲜活进行的动态包裹层"
    );
}

// Generate 30 Past Perfect (Had done/been) (10 had done, 10 had been, 10 had been doing)
for (let i = 0; i < 10; i++) { // 10 Had done
    let sub = subjects[i % subjects.length];
    let pp = pastParticiples[i % pastParticiples.length];
    add(
        "过去完成时: Had done 过去的过去经验 (10句)",
        `${sub.w} had ${pp.w}.`,
        sub.w, sub.desc,
        "现实域", "相对过去的更早时间存在的事实",
        "过去的过去", `时间烙印在had，将整个“拥有”的动作推移到时间轴更深处`,
        "had (旧容器)", "包裹着在那个时间点之前就已经完成的成果",
        `${pp.w} (done)`, "被封装的旧动作"
    );
}
for (let i = 0; i < 10; i++) { // 10 Had been
    let sub = subjects[i % subjects.length];
    let comp = beComplements[i % beComplements.length];
    add(
        "过去完成时: Had been 旧状态 (10句)",
        `${sub.w} had been ${comp.w}.`,
        sub.w, sub.desc,
        "现实域", "过去的过去的事实状态",
        "过去的过去", `时间轴拉回过去的起点 (had)`,
        "had (旧容器)", "包裹住曾经存在过的状态",
        `been ${comp.w}`, "那个时候之前的旧状态记录"
    );
}
for (let i = 0; i < 10; i++) { // 10 Had been doing
    let sub = subjects[i % subjects.length];
    let actWord = doVerbsConfig[i % doVerbsConfig.length].w.split(" ")[0];
    let ingWord = actWord + (actWord.endsWith('e') && actWord !== 'see' ? actWord.slice(0, -1) + 'ing' : actWord + 'ing');
    if (actWord === "run") ingWord = "running";
    if (actWord === "eat") ingWord = "eating";
    let objWord = doVerbsConfig[i % doVerbsConfig.length].w.split(" ").slice(1).join(" ");
    add(
        "过去完成时: Had been doing 旧延续动作 (10句)",
        `${sub.w} had been ${ingWord} ${objWord}.`.trim() + ".",
        sub.w, sub.desc,
        "现实域", "追溯到过去的某个时期内，一直在持续的事情",
        "过去的过去", "had 将时间原点锚定在过去",
        "had been (双层旧框架)", "过去的拥有(had) + 过去的存在(been)",
        `${ingWord} ${objWord}`, "当时处于鲜活状态的动作"
    );
}

// Generate 10 Present Do for Future (Schedule/Timetable)
const futureSchedules = [
    { w: "leaves at 8", desc: "8点离开" }, { w: "starts tomorrow", desc: "明天开始" },
    { w: "arrives tonight", desc: "今晚到达" }, { w: "ends at noon", desc: "中午结束" }
];
const trainSubjects = [
    { w: "The train", desc: "列车" }, { w: "The flight", desc: "航班" },
    { w: "The movie", desc: "电影" }, { w: "The meeting", desc: "会议" }
];
for (let i = 0; i < 10; i++) {
    let sub = trainSubjects[i % trainSubjects.length];
    let sched = futureSchedules[i % futureSchedules.length];
    add(
        "现在时: do表将来 (时刻表/安排)(10句)",
        `${sub.w} ${sched.w}.`,
        sub.w, sub.desc,
        "绝对现实域 (铁律)", "尽管发生在未来，但由于是雷打不动的时刻表，大脑将其视为 100% 当下板上钉钉的事实",
        "现在的", "不使用 will，直接强行打上现在的时间戳(s/es)",
        "do", "释放按部就班的动作",
        sched.w.split(" ").slice(1).join(" "), "时间或空间的限制点"
    );
}

// Generate 50 Passive Voice (mixed tenses & modals)
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let wasForm = (["I", "He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "was" : "were";
    let pp = pastParticiples[i % pastParticiples.length];
    add(
        "被动语态: 过去被动 (10句)",
        `${sub.w} ${wasForm} ${pp.w.split(" ")[0]} by them.`,
        `${sub.w} (承受者做主语)`, "能量的承受者反客为主，被提拔到聚光灯中心",
        "现实域", "客观事实",
        "过去的", `烙印在 ${wasForm}，时间轴向左平移`,
        `be + done (状态被动化)`, `${wasForm} 框定了它是一种“状态”，而过去分词（done）代表了被外部能量击发后的凝固结果`,
        "by them", "真实的能量来源在空间后方以介词by牵引出"
    );
}
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let beForm = (sub.w === "I") ? "am" : (["You", "We", "They"].includes(sub.w) ? "are" : "is");
    let pp = pastParticiples[i % pastParticiples.length];
    add(
        "被动语态: 现在被动 (10句)",
        `${sub.w} ${beForm} ${pp.w.split(" ")[0]} every day.`,
        sub.w, "承受者被提拔为主语",
        "现实域", "常规事实",
        "现在的", `时间戳打在 ${beForm}`,
        "be + done", "存在于被作用的客观状态中",
        "every day", "时间空间频率的修饰"
    );
}
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let pp = pastParticiples[i % pastParticiples.length];
    add(
        "被动语态: 将来被动 (10句)",
        `${sub.w} will be ${pp.w.split(" ")[0]}.`,
        sub.w, "未来的承受者做主语",
        "非现实域", "基于某种预测的脑补或安排",
        "现在的", "时间戳刻在 will 身上保命",
        "be (原形) + done", "因为有will保护，be现出原形，被动作结果(done)吸附",
        "N/A", "能量发射源省略"
    );
}
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let haveForm = (["He", "She", "It", "The cat", "My boss", "This book"].includes(sub.w)) ? "has" : "have";
    let pp = pastParticiples[i % pastParticiples.length];
    add(
        "被动语态: 现在完成被动 (10句)",
        `${sub.w} ${haveForm} been ${pp.w.split(" ")[0]}.`,
        sub.w, "承受者为主语",
        "现实域", "已经造成的被动成果",
        "现在的", `时间烙印在 ${haveForm}`,
        "have + been + done", "容器(have)包裹住了它曾经存在(been)并被作用(done)的成果叠加态",
        "N/A", "空间扩展处"
    );
}
for (let i = 0; i < 10; i++) {
    let sub = subjects[i % subjects.length];
    let pp = pastParticiples[i % pastParticiples.length];
    add(
        "被动语态: 情态被动 (10句)",
        `${sub.w} must be ${pp.w.split(" ")[0]}.`,
        sub.w, "承受者为主语",
        "极限非现实域", "由 must 提供高达99%的主观强制或铁律推断",
        "现在的", "烙印打在 must 身上",
        "be (原形) + done", "强制进入“被作用后”的状态",
        "N/A", "N/A"
    );
}

// For browser environment exports
if (typeof window !== "undefined") {
    window.SentenceData = SentenceData;
}
