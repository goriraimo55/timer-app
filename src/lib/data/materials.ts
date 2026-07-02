import { Material } from "@/lib/types";

export const materials: Material[] = [
  {
    id: "m01",
    title: "はりの曲げとせん断力の基礎",
    category: "材料力学",
    difficulty: "初級",
    studyMinutes: 20,
    rewardXp: 80,
    summary:
      "機械部品を「はり」としてモデル化し、曲げモーメント図・せん断力図を描く基本を学ぶ。設計の第一歩である荷重の見える化を身につける。",
    quiz: [
      {
        question: "単純支持はりの中央に集中荷重がかかるとき、最大曲げモーメントが発生する位置は？",
        choices: ["支点付近", "荷重点の直下", "はりの両端", "発生しない"],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q06"],
    relatedSkillIds: ["mechanics"],
  },
  {
    id: "m02",
    title: "安全率とリスクアセスメントの考え方",
    category: "材料力学",
    difficulty: "初級",
    studyMinutes: 15,
    rewardXp: 70,
    summary:
      "設計における安全率の意味と決め方、荷重の不確実性やリスクをどう織り込むかを学ぶ。安全レビューの土台となる知識。",
    quiz: [
      {
        question: "一般的に、想定荷重の不確実性が高い場合、安全率はどうすべきか？",
        choices: ["小さくする", "大きくする", "無視してよい", "1.0固定にする"],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q06", "q10"],
    relatedSkillIds: ["mechanics", "reporting"],
  },
  {
    id: "m03",
    title: "機械要素設計の基礎(歯車・カム・リンク)",
    category: "機械要素",
    difficulty: "初級",
    studyMinutes: 25,
    rewardXp: 90,
    summary:
      "動力伝達に使われる代表的な機械要素の種類と特徴を学ぶ。歯車・カム・リンク機構それぞれの用途と選定の考え方を整理する。",
    quiz: [
      {
        question: "回転運動を往復運動に変換するのに適した機械要素は？",
        choices: ["歯車", "カム", "ベアリング", "ボルト"],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q08"],
    relatedSkillIds: ["mechanics", "manufacturing"],
  },
  {
    id: "m04",
    title: "治具・取付具設計の基礎",
    category: "機械要素",
    difficulty: "中級",
    studyMinutes: 25,
    rewardXp: 100,
    summary:
      "位置決め・クランプの原理や、作業効率を高める治具設計のポイントを学ぶ。3-2-1位置決め原理など実務でも使う基礎知識。",
    quiz: [
      {
        question: "「3-2-1位置決め原理」で拘束する自由度の合計はいくつ？",
        choices: ["3", "6", "9", "12"],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q02"],
    relatedSkillIds: ["mechanics", "manufacturing"],
  },
  {
    id: "m05",
    title: "ボルトの強度区分とトルク管理",
    category: "ボルト・ナット",
    difficulty: "初級",
    studyMinutes: 18,
    rewardXp: 80,
    summary:
      "ボルトの強度区分表記(4.8, 8.8, 10.9など)の意味と、締結トルクの考え方を学ぶ。ボルト選定の妥当性チェックに直結する知識。",
    quiz: [
      {
        question: "強度区分「10.9」のボルトについて、正しい説明は？",
        choices: [
          "呼び径が10.9mm",
          "引張強さが約1000N/mm²クラス",
          "重量が10.9g",
          "ねじ山数が10.9個",
        ],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q07"],
    relatedSkillIds: ["mechanics", "drawing"],
  },
  {
    id: "m06",
    title: "ベアリングの選定と寿命計算(L10)",
    category: "軸・ベアリング",
    difficulty: "中級",
    studyMinutes: 30,
    rewardXp: 110,
    summary:
      "転がり軸受の種類と選定方法、定格寿命L10の計算方法を学ぶ。回転体を扱う設計では避けて通れない基礎理論。",
    quiz: [
      {
        question: "定格寿命L10とは、どのような寿命を表すか？",
        choices: [
          "全数が破損するまでの時間",
          "10%が破損するまでの回転数(または時間)",
          "10年間保証される期間",
          "10回転あたりの摩耗量",
        ],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q15"],
    relatedSkillIds: ["mechanics", "measurement"],
  },
  {
    id: "m07",
    title: "幾何公差(GD&T)の基礎",
    category: "公差・はめあい",
    difficulty: "中級",
    studyMinutes: 25,
    rewardXp: 100,
    summary:
      "真直度・平面度・位置度など幾何公差の種類と図面上の指示方法を学ぶ。公差の意味を理解すると図面が正確に読めるようになる。",
    quiz: [
      {
        question: "円筒形状の「軸線のブレ」に関係が深い幾何公差はどれ？",
        choices: ["平面度", "真円度", "円周振れ", "平行度"],
        answerIndex: 2,
      },
    ],
    relatedQuestIds: ["q03"],
    relatedSkillIds: ["drawing", "measurement"],
  },
  {
    id: "m08",
    title: "はめあい(すきま・しまり)の考え方",
    category: "公差・はめあい",
    difficulty: "初級",
    studyMinutes: 20,
    rewardXp: 85,
    summary:
      "軸と穴の「はめあい」の種類(すきまばめ・中間ばめ・しまりばめ)と、記号(H7/g6など)の読み方を学ぶ。",
    quiz: [
      {
        question: "軸受のはめあいで、常に軸のほうが穴より大きく仕上げられる方式は？",
        choices: ["すきまばめ", "しまりばめ", "中間ばめ", "どれでもない"],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q03"],
    relatedSkillIds: ["measurement", "drawing"],
  },
  {
    id: "m09",
    title: "板金部品のコスト設計と展開図",
    category: "板金設計",
    difficulty: "中級",
    studyMinutes: 25,
    rewardXp: 100,
    summary:
      "板金部品の展開図の考え方と、材料歩留まりを高めるレイアウトの工夫を学ぶ。曲げ加工特有の注意点も扱う。",
    quiz: [
      {
        question: "板金の曲げ加工で、板厚中心のずれを補正する値の名称は？",
        choices: ["ベンドアローワンス", "セットバック", "K係数", "全て該当"],
        answerIndex: 3,
      },
    ],
    relatedQuestIds: ["q12"],
    relatedSkillIds: ["cad", "manufacturing"],
  },
  {
    id: "m10",
    title: "溶接継手の強度計算",
    category: "溶接設計",
    difficulty: "上級",
    studyMinutes: 30,
    rewardXp: 120,
    summary:
      "すみ肉溶接・突合せ溶接の強度計算方法と、溶接記号の読み方を学ぶ。溶接部特有の応力集中にも触れる。",
    quiz: [
      {
        question: "すみ肉溶接の強度計算で一般的に使用される長さは？",
        choices: ["脚長", "のど厚", "溶接長さ全体", "板厚"],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q11"],
    relatedSkillIds: ["mechanics", "manufacturing"],
  },
  {
    id: "m11",
    title: "切削加工とDFM(製造性を考慮した設計)",
    category: "加工方法",
    difficulty: "中級",
    studyMinutes: 25,
    rewardXp: 100,
    summary:
      "旋盤・フライス加工の基本と、加工しやすい形状にするための設計配慮(DFM)の考え方を学ぶ。",
    quiz: [
      {
        question: "DFM(Design for Manufacturing)の目的として最も適切なものは？",
        choices: [
          "見た目を良くする",
          "製造コスト・加工性を考慮した設計にする",
          "重量を増やす",
          "図面を省略する",
        ],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q08"],
    relatedSkillIds: ["manufacturing", "cad"],
  },
  {
    id: "m12",
    title: "3Dプリンタの積層造形とサポート材",
    category: "加工方法",
    difficulty: "初級",
    studyMinutes: 15,
    rewardXp: 70,
    summary:
      "FDM方式3Dプリンタの積層原理と、オーバーハング・サポート材の関係について学ぶ。データ修正の勘所がつかめる。",
    quiz: [
      {
        question: "オーバーハングが大きい形状で問題になりやすいことは？",
        choices: ["色ムラ", "サポート無しでの垂れ・変形", "材料の匂い", "印刷時間の短縮"],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q04"],
    relatedSkillIds: ["cad", "manufacturing"],
  },
  {
    id: "m13",
    title: "三面図と投影法の基礎",
    category: "図面の読み方",
    difficulty: "初級",
    studyMinutes: 20,
    rewardXp: 80,
    summary:
      "第三角法による三面図の考え方と、立体を平面図から読み取る力を養う。図面を正確に読む第一歩。",
    quiz: [
      {
        question: "日本のJIS製図で標準的に使用される投影法は？",
        choices: ["第一角法", "第三角法", "斜投影法", "透視投影法"],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q01"],
    relatedSkillIds: ["drawing", "cad"],
  },
  {
    id: "m14",
    title: "図面記号とJIS製図法",
    category: "図面の読み方",
    difficulty: "初級",
    studyMinutes: 20,
    rewardXp: 80,
    summary:
      "表面粗さ記号・溶接記号・幾何公差記号など、図面上でよく使われる記号の意味を学ぶ。",
    quiz: [
      {
        question: "表面粗さを示す記号が図面に指示されている理由として正しいのは？",
        choices: [
          "色を指定するため",
          "仕上げ面のなめらかさを指定するため",
          "重量を指定するため",
          "材質を指定するため",
        ],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q01"],
    relatedSkillIds: ["drawing"],
  },
  {
    id: "m15",
    title: "製品安全レビューとリスクアセスメントの視点",
    category: "設計レビュー",
    difficulty: "中級",
    studyMinutes: 25,
    rewardXp: 100,
    summary:
      "製品や作業に潜む危険源の洗い出し方と、リスクレベルの評価方法を学ぶ。安全レビューを行う上での基本の型。",
    quiz: [
      {
        question: "リスクアセスメントにおいて「リスク」は一般的に何の組み合わせで評価されるか？",
        choices: [
          "コストと納期",
          "発生頻度と危害の重大性",
          "重量と体積",
          "色と形状",
        ],
        answerIndex: 1,
      },
    ],
    relatedQuestIds: ["q02", "q05", "q09", "q10"],
    relatedSkillIds: ["reporting", "mechanics"],
  },
];
