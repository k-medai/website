/**
 * 사이트 전역 문구와 링크.
 * 기존 k-medai.com(Google Sites)에 있던 문장은 그대로 옮겼습니다.
 */
export const site = {
  name: 'Medical AI Lab',
  short: 'MAIL',
  nameKo: '의료인공지능연구실',
  university: '부산대학교',
  universityEn: 'Pusan National University',
  department: '의생명융합공학부',
  departmentEn: 'Department of Biomedical Convergence Engineering',
  college: '정보의생명공학대학',
  collegeEn: 'College of Information and Biomedical Engineering',
  url: 'https://www.k-medai.com',
  description:
    '부산대학교 의생명융합공학부 Medical AI Lab. 그래프 신경망 기반 신약 개발, 암 재발·전이 예측, EHR 예후 예측, 생체신호, 마이크로바이옴 연구.',

  /** 기존 사이트 상단 태그라인(원문 그대로) */
  tagline: 'Powering Artificial intelligence Bio-medical analysis',
  /** 기존 사이트 홈 제목(원문 그대로, 이모지만 제외) */
  welcome: 'Welcome to Medical AI Lab',
  /** 기존 사이트 연구실 소개 문단(원문 그대로) */
  intro: [
    '우리 연구실은 생명의료분야에 인공지능, 데이터 분석 기술을 적용하여 신약 개발, 유전체 연구, 의료 시계열 데이터 처리, 차세대 시퀀싱 기반 예방의학 및 미생물 분석 외 다양한 의료 분야에서 연구를 진행 중이며, 병원과의 협업을 통한 임상적 모델링 구축 및 개인 맞춤형 정밀 의료 구현을 목표로 합니다.',
    '우리 연구실에서는 현장의 실제 데이터에도 적용할 수 있는 효과적인 모델을 개발하고 있습니다.',
    '최신 머신러닝, 딥러닝 기술 및 연구 동향을 조사하고, 다각적 시각에서 분석하여 새로운 모델을 제시합니다.',
    '그래프 신경망(Graph Neural Network)을 이용한 신규 모델, 대조 학습(Contrastive Learning)을 이용한 사전 학습 기법에 관한 연구, 설명가능한 인공지능(Explainable AI), 자기지도 학습(Self-supervised Learning), 인과관계학습(Causal Representation Learning) 등 여러 연구를 진행 중입니다.',
  ],

  /** 기존 사이트 메뉴 순서 그대로 */
  nav: [
    { href: '/people/', label: 'People', labelKo: '구성원' },
    { href: '/research/', label: 'Research', labelKo: '연구' },
    { href: '/publications/', label: 'Publications', labelKo: '논문' },
    { href: '/course/', label: 'Course', labelKo: '강의' },
    { href: '/activity/', label: 'Activity', labelKo: '활동' },
    { href: '/contact/', label: 'Contact', labelKo: '연락처' },
  ],
  service: { href: 'http://service.k-medai.com/', label: 'Service' },

  contact: {
    professor: 'Sunyoung Kwon',
    professorKo: '권선영',
    /** 기존 사이트와 같은 방식으로 @를 (at)으로 표기 */
    email: 'sy.kwon (at) pusan.ac.kr',
    phoneProfessor: '+82-51-510-8555',
    phoneLab: '+82-51-510-8535',
    room: 'Room 517, Kyungam Engineering Hall',
    addressKo: '50612 경상남도 양산시 물금읍 부산대학로 49 경암공학관 517호',
    addressEn: '#517, Advanced Biomedical Convergence Center, 49 Busandaehak-ro, Mulgeum-eup, Yangsan-si, Gyeongsangnam-do, 50612, Korea',
    mapQuery: '경상남도 양산시 물금읍 부산대학로 49 부산대학교 양산캠퍼스',
    directionsEn: 'http://www.pusan.ac.kr/eng/CMS/Contents/Contents.do?mCode=MN054',
    directionsKo: 'http://www.pusan.ac.kr/kor/CMS/Contents/Contents.do?mCode=MN181',
  },

  /** 기존 사이트의 모집 안내(원문 그대로). 모집 일정 공지는 2026-10-10 요청으로 뺐음 */
  recruiting: {
    heading: 'Recruiting Graduate Students',
    howTo: '[지원방법] 부산대학교 AI 전공 지원 및 이메일 송부',
    documents: ['이력서 (국문 or 영문), 또는 자기소개서', '성적증명서', '공인 영어성적이 있다면, 영어성적표'],
    affiliations: [
      { label: 'AI대학원', href: 'https://ai.pusan.ac.kr/ai/index.do' },
      { label: '의료인공지능', href: 'https://maic.pusan.ac.kr/maic/index.do' },
    ],
    pitchKo: [
      '우리 연구실에서는 그래프 신경망(GNN), 설명가능한 인공지능(XAI)과 같은 최신 머신러닝 및 딥러닝 기술과 연구를 진행 중입니다.',
      '병원과 협업하여 현장 데이터를 분석하고 신규 모델을 개발하고 있습니다.',
      '초거대 사전학습 약물 관련 연구도 진행 중입니다.',
      '해당 내용에 관심이 있고, 재미있게 연구 하실 분들은 연락바랍니다!',
    ],
    pitchEn: [
      'Our lab is working with the latest machine learning and deep learning techniques such as graph neural networks (GNN) and explainable artificial intelligence (XAI).',
      'We collaborate with hospitals to analyze real-world field data and develop new models.',
      "We're also working on Hyper-scale pre-learning drugs.",
      'We are looking for people who are interested in these topics and want to have fun doing research!',
    ],
    eligibility: [
      '컴퓨터 과학/공학 및 생물정보학, 화학분야 기졸업자 및 2025년 8월 졸업 예정자',
      '관련 학과 졸업자가 아니어도 인공지능에 관심 있는 분',
      '국비교육으로 프로그래밍 또는 인공지능 수업 수강한 분',
      '프로그래밍 가능자 (python)',
    ],
    benefits: [
      '다양한 업체 및 병원과의 협업을 통한 실무 기회 제공',
      '신약 개발, 유전체 연구 기회 제공',
      '전일제학생(대학원생) 기준 인건비 지원',
      '국내 외 저널 및 학회 지원 및 논문 인센티브 부여',
    ],
  },

  /** 홈 요약 숫자 중 수동값 */
  stats: {
    partners: '10+',
  },

  /** 협력기관 (기존 Research 페이지에 적힌 기관명) */
  partners: [
    '삼성서울병원',
    '서울대학교병원',
    '강남세브란스병원',
    '서울아산병원',
    '고려대구로병원',
    '양산부산대학교병원',
    '부산대학교병원',
    '국립암센터',
    '씨젠의료재단',
    '사운더블헬스',
    '디시젠',
  ],
} as const;
