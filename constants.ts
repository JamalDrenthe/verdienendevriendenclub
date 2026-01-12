import { Mission, MissionCategory, MissionStatus, User, UserStatus, Notification, Team } from './types';

// --- Mission Generators ---

// Helper to create specific missions easily
const createMission = (
  id: string,
  title: string,
  category: MissionCategory,
  description: string,
  steps: any[],
  status: MissionStatus = MissionStatus.LOCKED,
  isPrio: boolean = false,
  minLevel: number = 0
): Mission => ({
  id,
  title,
  category,
  description,
  xpReward: 1, // VVC Rule: Exact +1 Level per mission
  status,
  isPrio,
  requirements: { minLevel },
  steps: steps.map((s, i) => ({ ...s, id: `${id}_s${i+1}`, completed: false }))
});

const generateMissionLibrary = (): Mission[] => {
  const missions: Mission[] = [];

  // 1. ONBOARDING & IDENTITEIT (5 Missions)
  // Essential for new users.
  missions.push(
    createMission('m_onb_001', 'Profiel & Identiteit verificatie', MissionCategory.ONBOARDING, 
      'Voltooi je basisregistratie om toegang te krijgen tot het platform.',
      [
        { title: 'Persoonsgegevens', description: 'Controleer en bevestig je volledige officiële naam.', requiredInputType: 'text' },
        { title: 'Contactgegevens', description: 'Bevestig je zakelijke e-mailadres en telefoonnummer.', requiredInputType: 'email' },
        { title: 'Identiteitsbewijs', description: 'Upload een veilige kopie van je ID (AVG proof).', requiredInputType: 'file' },
        { title: 'Adresverificatie', description: 'Upload een bewijs van woonadres (< 3 maanden oud).', requiredInputType: 'file' },
        { title: 'IBAN registratie', description: 'Voer je bankrekening in voor vergoedingen.', requiredInputType: 'iban' },
      ], MissionStatus.AVAILABLE, true
    ),
    createMission('m_onb_002', 'Non-Disclosure Agreement (NDA)', MissionCategory.ONBOARDING,
      'Lees en onderteken de geheimhoudingsverklaring voor toegang tot klantdata.',
      [
        { title: 'NDA Document', description: 'Download en lees de VVC NDA v2.4.', requiredInputType: 'boolean' },
        { title: 'Ondertekening', description: 'Upload het ondertekende document.', requiredInputType: 'file' },
        { title: 'Juridische bevestiging', description: 'Ik verklaar bevoegd te zijn om te tekenen.', requiredInputType: 'boolean' }
      ], MissionStatus.AVAILABLE, true
    ),
    createMission('m_onb_003', 'IT Security Compliance', MissionCategory.ONBOARDING,
      'Verifieer dat je werkplek voldoet aan de veiligheidseisen.',
      [
        { title: 'Virusscanner', description: 'Welke virusscanner gebruik je?', requiredInputType: 'text' },
        { title: 'Laatste scan', description: 'Datum van laatste volledige systeemscan.', requiredInputType: 'date' },
        { title: 'Wachtwoord manager', description: 'Bevestig gebruik van een password manager.', requiredInputType: 'boolean' }
      ], MissionStatus.AVAILABLE, false
    ),
    createMission('m_onb_004', 'Competentie Profiel', MissionCategory.ONBOARDING,
      'Breng je vaardigheden in kaart voor team-matching.',
      [
        { title: 'Primaire skill', description: 'Wat is je hoofdexpertise?', requiredInputType: 'text' },
        { title: 'Ervaringsniveau', description: 'Aantal jaren relevante werkervaring.', requiredInputType: 'number' },
        { title: 'CV Upload', description: 'Upload je meest recente CV (PDF).', requiredInputType: 'file' }
      ], MissionStatus.AVAILABLE, false
    ),
    createMission('m_onb_005', 'Community Richtlijnen', MissionCategory.GOVERNANCE,
      'Bevestig dat je de gedragsregels hebt begrepen.',
      [
        { title: 'Gedragscode', description: 'Ik heb de Code of Conduct gelezen.', requiredInputType: 'boolean' },
        { title: 'Communicatie', description: 'Ik begrijp de regels omtrent zakelijke communicatie.', requiredInputType: 'boolean' }
      ], MissionStatus.LOCKED, false, 1
    )
  );

  // 2. PRIO: DAGELIJKSE CHECK-INS (30 Missions)
  // Routine tasks ensuring activity.
  for (let i = 1; i <= 30; i++) {
    missions.push(createMission(
      `m_prio_daily_${i}`, 
      `Check-in Dag ${i}`, 
      MissionCategory.PRIO_CHECKIN,
      'Dagelijkse update van beschikbaarheid en status. Maximaal 15 minuten.',
      [
        { title: 'Beschikbaarheid', description: 'Ben je vandaag beschikbaar voor missies?', requiredInputType: 'boolean' },
        { title: 'Uren', description: 'Hoeveel uur kun je vandaag inzetten?', requiredInputType: 'number' },
        { title: 'Blokkades', description: 'Zijn er belemmeringen voor je werkzaamheden?', requiredInputType: 'text' }
      ],
      i === 1 ? MissionStatus.AVAILABLE : MissionStatus.LOCKED, // Only day 1 available initially
      true,
      0
    ));
  }

  // 3. PRIO: MAANDELIJKSE TAKEN (12 Missions)
  const monthlyTasks = [
    { type: MissionCategory.PRIO_REFERRAL, title: 'Referral Lead', desc: 'Draag een potentiële nieuwe professional aan.' },
    { type: MissionCategory.PRIO_CONTENT, title: 'Content Bijdrage', desc: 'Deel één relevant artikel of inzicht met het team.' },
    { type: MissionCategory.PRIO_NETWORK, title: 'Netwerk Verificatie', desc: 'Valideer 5 contacten in je CRM netwerk.' },
    { type: MissionCategory.PRIO_METADATA, title: 'Data Opschoning', desc: 'Controleer en corrigeer tags op 10 dossiers.' },
  ];

  monthlyTasks.forEach((task, idx) => {
    [1, 2, 3].forEach(month => {
       missions.push(createMission(
         `m_prio_m_${idx}_${month}`,
         `${task.title} - Maand ${month}`,
         task.type,
         task.desc,
         [
           { title: 'Input', description: 'Voer de gevraagde gegevens in.', requiredInputType: 'long_text' },
           { title: 'Bewijslast', description: 'Upload screenshot of document.', requiredInputType: 'file' }
         ],
         MissionStatus.LOCKED,
         true,
         month // higher level needed for later months
       ));
    });
  });

  // 4. KWALITEITSCONTROLE (15 Missions)
  // Concrete testing and QA tasks.
  const qaTasks = [
    'Validatie Login Flow', 'Check Responsive Design Mobile', 'Audit Tekstuele Fouten Homepage',
    'Test Betalingsgateway Sandbox', 'Controleer Broken Links Footer', 'Validatie Afbeeldingen Compressie',
    'Test Wachtwoord Reset Flow', 'Audit Toegankelijkheid (WCAG)', 'Performance Test Dashboard',
    'Cross-browser Test (Safari)', 'Cross-browser Test (Firefox)', 'Validatie API Error Handling',
    'Check GDPR Cookie Banner', 'Test Bestandsgrootte Uploads', 'Validatie Email Templates'
  ];
  
  qaTasks.forEach((task, i) => {
    missions.push(createMission(
      `m_qc_${i}`, task, MissionCategory.QUALITY,
      'Voer een gestructureerde kwaliteitscontrole uit op het aangewezen onderdeel.',
      [
        { title: 'Testplan', description: 'Lees het testprotocol.', requiredInputType: 'boolean' },
        { title: 'Bevindingen', description: 'Beschrijf eventuele bugs of fouten gedetailleerd.', requiredInputType: 'long_text' },
        { title: 'Status', description: 'Geef het onderdeel een pass/fail status.', requiredInputType: 'select', options: ['Pass', 'Fail', 'Needs Info'] },
        { title: 'Bewijs', description: 'Upload screenshots van de test.', requiredInputType: 'file' }
      ],
      MissionStatus.LOCKED, false, Math.floor(i/3) + 2
    ));
  });

  // 5. REVIEW & VERIFICATIE (10 Missions)
  // Peer review tasks.
  for(let i=1; i<=10; i++) {
     missions.push(createMission(
        `m_rev_${i}`, `Peer Review: Dossier #${1000+i}`, MissionCategory.REVIEW,
        'Beoordeel het werk van een collega op volledigheid en juistheid.',
        [
            { title: 'Dossier Check', description: 'Zijn alle documenten aanwezig?', requiredInputType: 'boolean' },
            { title: 'Kwaliteitsoordeel', description: 'Geef inhoudelijke feedback.', requiredInputType: 'long_text' },
            { title: 'Score', description: 'Beoordeling 1-10.', requiredInputType: 'number' }
        ],
        MissionStatus.LOCKED, false, 5
     ));
  }

  // 6. CONTENT & MARKETING (10 Missions)
  const contentTasks = [
      'Schrijf Blog Concept: Remote Work', 'Redigeer Nieuwsbrief Oktober', 'Vertaal Landingspagina (NL-EN)',
      'Analyseer Competitor Content', 'Maak Social Media Kalender Concept', 'Schrijf User Story: Dashboard',
      'Update FAQ Sectie', 'Schrijf Case Study: Project Alpha', 'Maak Persbericht Concept', 'Herschrijf "Over Ons" Pagina'
  ];
  contentTasks.forEach((task, i) => {
      missions.push(createMission(
        `m_cont_${i}`, task, i < 5 ? MissionCategory.CONTENT : MissionCategory.MARKETING,
        'Creëer of optimaliseer professionele content voor externe communicatie.',
        [
            { title: 'Briefing', description: 'Ik heb de tone-of-voice richtlijnen gelezen.', requiredInputType: 'boolean' },
            { title: 'Concept Tekst', description: 'Plak hier de concepttekst of link.', requiredInputType: 'long_text' },
            { title: 'SEO Check', description: 'Zijn de keywords verwerkt?', requiredInputType: 'boolean' }
        ],
        MissionStatus.LOCKED, false, 3
      ));
  });

  // 7. SALES & NETWERK (10 Missions)
  for(let i=1; i<=5; i++) {
      missions.push(createMission(
          `m_sales_${i}`, `Lead Kwalificatie Batch ${i}`, MissionCategory.SALES,
          'Verrijk data van 5 potentiële prospects.',
          [
              { title: 'LinkedIn Check', description: 'Verifieer huidige functies.', requiredInputType: 'boolean' },
              { title: 'Contactdata', description: 'Voeg ontbrekende emails toe.', requiredInputType: 'long_text' },
              { title: 'Validatie', description: 'Is dit een relevante lead?', requiredInputType: 'boolean' }
          ],
          MissionStatus.LOCKED, false, 4
      ));
      missions.push(createMission(
          `m_net_${i}`, `Partner Outreach ${i}`, MissionCategory.NETWORK,
          'Identificeer strategische partners in sector X.',
          [
              { title: 'Bedrijfsnaam', description: 'Naam van potentiële partner.', requiredInputType: 'text' },
              { title: 'Website', description: 'URL van de partner.', requiredInputType: 'url' },
              { title: 'Motivatie', description: 'Waarom past dit bij VVC?', requiredInputType: 'long_text' }
          ],
          MissionStatus.LOCKED, false, 6
      ));
  }

  // 8. DATA & GOVERNANCE (8 Missions)
  for(let i=1; i<=8; i++) {
      missions.push(createMission(
          `m_data_${i}`, `Dataset Categorisatie ${i}`, i < 5 ? MissionCategory.METADATA : MissionCategory.GOVERNANCE,
          'Structureer ongesorteerde data voor betere doorzoekbaarheid.',
          [
              { title: 'Tagging', description: 'Ken relevante tags toe.', requiredInputType: 'text' },
              { title: 'Duplicaten', description: 'Markeer dubbele entries.', requiredInputType: 'boolean' }
          ],
          MissionStatus.LOCKED, false, 2
      ));
  }

  // Ensure we have exactly 100+ items (current count: ~95)
  // Fill remainder with Investment Analysis
  for(let i=1; i<=10; i++) {
      missions.push(createMission(
          `m_inv_${i}`, `Markt Analyse: Sector ${String.fromCharCode(65+i)}`, MissionCategory.INVESTMENT,
          'Analyseer markttrends en groeipotentieel.',
          [
              { title: 'Marktgrootte', description: 'Schatting in Euro.', requiredInputType: 'number' },
              { title: 'Groei %', description: 'Verwachte jaarlijkse groei.', requiredInputType: 'number' },
              { title: 'Rapport', description: 'Upload korte analyse PDF.', requiredInputType: 'file' }
          ],
          MissionStatus.LOCKED, false, 8
      ));
  }

  return missions;
};

export const MOCK_MISSIONS = generateMissionLibrary();

// --- Users & Teams ---

export const CURRENT_USER: User = {
  id: 'u_123',
  firstName: 'Sanne',
  lastName: 'de Vries',
  email: 'sanne@vvc.work',
  level: 4,
  xp: 35,
  status: UserStatus.ACTIVE,
  avatarUrl: 'https://picsum.photos/200/200',
  specializations: ['Content', 'Kwaliteitscontrole'],
  bio: 'Focus op contentkwaliteit en procesoptimalisatie.',
  teamId: 't_alpha'
};

export const MOCK_TEAMS: Team[] = [
  { id: 't_alpha', name: 'Team Alpha', members: ['u_123', 'u_2', 'u_3'], score: 1450 },
  { id: 't_beta', name: 'Team Beta', members: ['u_4', 'u_5'], score: 1320 },
  { id: 't_gamma', name: 'Team Gamma', members: ['u_6', 'u_7'], score: 980 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Onboarding Compleet', message: 'Je ID verificatie is succesvol afgerond.', type: 'success', read: false, timestamp: Date.now() - 3600000 },
  { id: 'n2', title: 'Prio Onboarding', message: 'De dagelijkse check-in staat voor je klaar.', type: 'mission_invite', read: false, timestamp: Date.now() - 7200000 },
  { id: 'n3', title: 'Nieuwe Policy', message: 'Governance update: lees de nieuwe regels in taak m_gov_001.', type: 'info', read: true, timestamp: Date.now() - 86400000 },
];

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  { id: 'u_2', firstName: 'Peter', lastName: 'Jansen', email: 'peter@vvc.work', level: 12, xp: 10, status: UserStatus.ACTIVE, avatarUrl: 'https://picsum.photos/201/201', specializations: ['Sales', 'Management'], teamId: 't_alpha' },
  { id: 'u_3', firstName: 'Klaas', lastName: 'Vaak', email: 'klaas@vvc.work', level: 2, xp: 90, status: UserStatus.NEW, avatarUrl: 'https://picsum.photos/202/202', specializations: ['Review'], teamId: 't_alpha' },
  { id: 'u_4', firstName: 'Lotte', lastName: 'Bakker', email: 'lotte@vvc.work', level: 8, xp: 50, status: UserStatus.ACTIVE, avatarUrl: 'https://picsum.photos/203/203', specializations: ['Community'], teamId: 't_beta' },
  { id: 'u_5', firstName: 'Bas', lastName: 'Smit', email: 'bas@vvc.work', level: 22, xp: 0, status: UserStatus.RESTRICTED, avatarUrl: 'https://picsum.photos/204/204', specializations: ['Investment'], teamId: 't_beta' },
];