/**
 * Single source of truth for site content.
 * All copy is English-only; keep claims traceable to the CV.
 */

/**
 * Canonical origin of the deployed site. Change it here and in the two files
 * that cannot import it: static/robots.txt and static/sitemap.xml.
 */
export const siteUrl = 'https://rithea-sreng.up.railway.app';


export const profile = {
	name: 'Rithea Sreng',
	nameLatin: 'Rithea Sreng',
	role: 'Software Development Supervisor · Full-Stack Engineer',
	eyebrow: 'Phnom Penh, Cambodia · available for a conversation',
	pitch: 'I build and run the systems a business actually depends on. More than seven years across retail, ERP, logistics and e-commerce in Cambodia, currently leading web development for the POS platform behind a supermarket group of 20+ stores, a system that runs 24 hours a day. I own it end to end: architecture, delivery, releases, production support, and the developers who build it.',
	email: 'codenester.dev@gmail.com',
	phone: '+855 69 272 705',
	phoneHref: '+85569272705',
	location: 'Phnom Penh, Cambodia',
	linkedin: 'https://www.linkedin.com/in/sreng-rithea-9a885a1a9',
	linkedinLabel: 'linkedin.com/in/sreng-rithea-9a885a1a9',
	github: '' as string // add a URL when you want it shown
};

/* ------------------------------------------------------------------ */
/* hero spec sheet — factual rows, not decoration                      */
/* ------------------------------------------------------------------ */

export const facts: { label: string; value: string; icon: string }[] = [
	{
		label: 'Based in',
		value: 'Phnom Penh, Cambodia',
		icon: 'pin'
	},
	{
		label: 'Currently',
		value: 'Assistant Supervisor, Web Development at Chipmong Group',
		icon: 'briefcase'
	},
	{
		label: 'Focus',
		value: 'POS & ERP platforms, offline-first retail, integrations',
		icon: 'focus'
	},
	{
		label: 'Core stack',
		value: '.NET Core · Vue 3 / Nuxt · SvelteKit · SQL Server · PostgreSQL · SQLite · Redis',
		icon: 'stack'
	}
];

/* ------------------------------------------------------------------ */
/* case studies — problem / what I did / result                        */
/* ------------------------------------------------------------------ */

export type CaseStudy = {
	id: string;
	kind: string;
	title: string;
	org: string;
	period: string;
	role: string;
	problem: string;
	approach: string[];
	result: string;
	stack: string[];
	/* optional: opens a modal with an animated diagram of the concept */
	explore?: { cta: string; title: string; lead: string };
};

export const cases: CaseStudy[] = [
	{
		id: 'pos-platform',
		kind: 'Retail platform · architecture',
		title: 'The POS architecture that took a supermarket chain from 10 stores to 20+',
		org: 'Chipmong Group',
		period: 'Jul 2025 – present',
		role: 'Assistant Supervisor, Web Development',
		problem: 'A chain that kept opening stores needed one platform it could keep adding stores to. Every new branch added load, and a single shared database was on its way to becoming the bottleneck for the whole chain.',
		approach: [
			'Grouped stores behind dedicated API instances instead of one shared application server.',
			'Gave each store its own database, and added a shared central database only for data that must be chain-wide: vouchers and customers.',
			'Put a distribution gateway in front of the platform so every request is routed to the right store.'
		],
		result: 'The chain grew from 10 to 20+ stores on this design. The platform runs 24/7 and underpins more than US$20M in annual sales.',
		stack: ['C#', '.NET Core', 'SQL Server', 'PostgreSQL', 'Redis', 'nginx', 'IIS']
	},
	{
		id: 'offline-first',
		kind: 'Retail · resilience',
		title: 'Offline-first checkout: sales that do not stop when the connection does',
		org: 'Chipmong Group',
		period: 'Jul 2025 – present',
		role: 'Architecture & delivery lead',
		problem: 'Store connectivity drops. In a supermarket that means a stopped till and a queue of real customers: the one failure the business cannot absorb.',
		approach: [
			'Every store runs a local SQLite store, pre-synced with the master data that store needs.',
			'Checkout keeps selling with no connection at all.',
			'A background scheduler pushes transactions and reconciles on reconnect.'
		],
		result: 'All stores now run hybrid, online and offline, and a network outage no longer stops checkout.',
		stack: ['SQLite', '.NET Core', 'Background scheduler', 'Sync & reconciliation']
	},
	{
		id: 'integration',
		kind: 'Enterprise integration',
		title: 'The integration layer: SAP and the systems around it',
		org: 'Chipmong Group',
		period: 'Jul 2025 – present',
		role: 'Integration design & delivery',
		problem: 'Group systems had to exchange financial and operational data with SAP and with other ERP and business systems: different formats, different rhythms, no manual step allowed.',
		approach: [
			'SAP receives data files over SFTP, mapped to its structure.',
			'Other ERP and business systems connect over SFTP files or APIs.',
			'Sync runs immediately, on scheduled windows, or from cron jobs, whichever the receiving system can take.'
		],
		result: 'Chain data reaches SAP and downstream systems without manual handling.',
		stack: ['SFTP', 'SAP ERP', 'REST APIs', 'Cron & scheduling', '.NET Core']
	},
	{
		id: 'erp-suite',
		kind: 'ERP & POS · multi-client',
		title: 'One ERP + POS platform, reshaped for every client',
		org: 'Biztools Enterprise Solutions',
		period: 'Feb 2023 – Jun 2025',
		role: 'Software Engineer',
		problem: 'Every client wanted the same platform to behave differently: custom requirements across industries, running on two generations of the stack at once.',
		approach: [
			'Built, maintained and enhanced ERP and POS systems to each client’s requirements.',
			'Delivered a container-shipment tracking system and a customer loyalty program on the same platform.',
			'Built Flutter and native Android apps on top of those systems for stock counts and loyalty.',
			'Worked every layer, database, API and UI, from requirement analysis through deployment.'
		],
		result: 'One platform, many client shapes, plus mobile apps that put stock counts and loyalty in store staff’s hands.',
		stack: [
			'.NET Framework 4.x',
			'.NET Core',
			'React',
			'Svelte',
			'Next.js',
			'Flutter',
			'Android',
			'SQL Server'
		]
	},
	{
		id: 'logistics-ecommerce',
		kind: 'Logistics & e-commerce · 0 → 1',
		title: 'Logistics and e-commerce systems built from zero',
		org: 'One Click Solution',
		period: 'Nov 2020 – Feb 2023 · Part time',
		role: 'Full-Stack Developer & Project leader',
		problem: 'No system existed for ordering, fulfilment and delivery: both had to be built while the business was already running.',
		approach: [
			'Built the logistics system and the e-commerce system from the ground up, covering ordering, fulfilment and delivery workflows.',
			'Created reusable internal libraries that other projects adopted.',
			'Led a small team: planned iterations, delegated work, mentored junior developers.'
		],
		result: 'Two production systems, and a shared library base that made the next builds faster.',
		stack: ['C#', '.NET Framework 4.x', 'SignalR', 'SQL Server', 'JavaScript']
	},
	{
		id: 'techniverse-ecosys',
		kind: 'Personal project · modular platform · in progress',
		title: 'Techniverse.Ecosys: a platform you assemble from modules',
		org: 'Own project',
		period: 'Ongoing',
		role: 'Everything: design, build, decisions',
		problem:
			'Business software usually arrives as one fixed bundle: you take the modules the vendor decided on, and every module is welded to the rest. After years of inherited ERPs I wanted the opposite, so I started from a different question. Could a business pick only the modules it actually needs, have each of those modules run on its own, and have every module exist in each language a team might work in, so a module is never locked to one stack?',
		approach: [
			'Modules are the unit of delivery, not the product. Each module is runnable by itself, so one can ship alone and more can be added later without a rewrite.',
			'A complete product is assembled from modules. Pick the ones a business needs and they form the platform, the way bricks form a model.',
			'Only three modules are foundational: Shared, Auth and Identity. Every other module depends on those, and on nothing else.',
			'Modules never reach into one another. They talk through integration events, so any module can be replaced, upgraded or left out.',
			'Shared is one specification, not one library: integration events, the result and error types, the entity base and the permission catalog are defined once and implemented per language, so the platform never belongs to a single stack.',
			'A product is assembled two ways, decided by the implementations chosen. Implementations in the host’s language link into one process and ship as a single deployable. An implementation in another language runs as a service and is assembled over the wire. The same module can be assembled either way, unchanged, and in either language.',
			'The rule is one implementation per supported language, named module plus language: shared-net, shared-go, shared-java and shared-kotlin, then the same four for Auth, Identity and every business module. What a product chooses is which implementation of each module it runs, and that choice lives in its assembly manifest, never in the module. One implementation exists today, the reference one in C# on .NET, and the first product is being built on it.',
			'All implementations of one module are required to pass the same conformance suite and the same acceptance tests, so they behave identically. Behaving identically is the acceptance criterion, and it is required rather than promised: with a single implementation there is nothing yet to compare against, and the second implementation is what proves the rule.',
			'Four language tokens are accepted by the assembly rule: net (C# on .NET, the reference and the only one written so far), go, java and kotlin. Out of scope: Rust, C and C++, where memory management stays the implementer’s job, and Ruby and PHP. Node.js is used for the front end and the tooling, not for modules.'
		],
		result: 'The target: a reference implementation where the same platform can be a single small tool or a full business platform, decided by which modules are switched on, and where every module exists in each supported language, so a product picks the implementation of each module it runs instead of being locked to one stack. What exists today is the first implementation and the first product being built to that rule. The second language is what proves the rule, and it follows the first finished product rather than running beside it.',
		stack: ['.NET 10', 'Go', 'Java', 'Kotlin', 'gRPC', 'PostgreSQL', 'SvelteKit', 'Composable modules'],
		explore: {
			cta: 'See how the modules fit together',
			title: 'Techniverse.Ecosys: how a product is assembled',
			lead: 'The platform is one living system: assembled, it runs as one. Split it, and every piece keeps running on its own, because each piece carries its own Shared, Auth and Identity.'
		}
	}
];

/* ------------------------------------------------------------------ */
/* experience timeline                                                 */
/* ------------------------------------------------------------------ */

export type Job = {
	org: string;
	role: string;
	period: string;
	current?: boolean;
	points: string[];
	stack: string[];
};

export const jobs: Job[] = [
	{
		org: 'Chipmong Group',
		role: 'Assistant Supervisor, Web Development',
		period: 'Jul 2025 – present',
		current: true,
		points: [
			'Lead web development for the group’s POS platform: plan and prioritise the roadmap with business stakeholders, manage the developers through hands-on code review and mentoring, set the quality standards, and coordinate daily with store operations and the support team.',
			'Own the full delivery cycle: design, build, release and support: release rollouts across stores on nginx and IIS, incident response including outside hours, and the escalation path the support team follows.',
			'Delivered the commercial features the business sells with: mix-and-match promotions and POSM, plus a second online-only POS for an in-house ERP, and stabilised an inherited codebase on taking over.'
		],
		stack: ['C#', '.NET Core', 'Vue 3 + Nuxt', 'TypeScript', 'SQL Server', 'PostgreSQL', 'SQLite', 'Redis']
	},
	{
		org: 'Biztools Enterprise Solutions',
		role: 'Software Engineer',
		period: 'Feb 2023 – Jun 2025',
		points: [
			'Built, maintained and enhanced ERP and POS systems tailored to each client’s requirements across industries.',
			'Delivered a container-shipment tracking system and a customer loyalty program on the same platform.',
			'Moved between legacy (.NET Framework 4.x) and modern (.NET Core) codebases and across front-end stacks as each project needed.'
		],
		stack: ['C#', '.NET Framework 4.x', '.NET Core', 'React', 'Svelte', 'Next.js', 'Flutter', 'Android']
	},
	{
		org: 'One Click Solution',
		role: 'Full-Stack Developer & Project leader',
		period: 'Nov 2020 – Feb 2023 · Part time',
		points: [
			'Built a logistics system and an e-commerce system from the ground up, covering ordering, fulfilment and delivery workflows.',
			'Created and maintained reusable internal libraries adopted across multiple projects, cutting duplication and speeding up later builds.',
			'Led a small team as full-stack developer and team lead: planned iterations, delegated work and mentored junior developers.'
		],
		stack: ['C#', '.NET Framework 4.x', 'SignalR', 'SQL Server', 'JavaScript']
	}
];

/* ------------------------------------------------------------------ */
/* working style + skills + education                                  */
/* ------------------------------------------------------------------ */

export const about: { paragraphs: string[]; caption: string } = {
	caption: 'Phnom Penh · working on retail platforms since 2019',
	paragraphs: [
		'I started in 2019 by building a logistics system and an e-commerce platform from zero, spent the years since on ERP and POS work for a roster of clients, and now supervise web development for a POS platform that runs in more than twenty supermarkets every day of the week.',
		'Most of what I know came from being the person who had to make it work: owning releases, taking the call when a store goes down outside hours, and reviewing the code the team writes.',
		'I studied computer science at the National Polytechnic Institute of Cambodia and finished Google’s Project Management Professional Certificate, seven courses that cover the full lifecycle from initiation through Agile and the capstone.'
	]
};

export const style: { title: string; body: string; icon: string }[] = [
	{
		title: 'End-to-end ownership',
		body: 'Plan, design, build, release and support the platform myself. When live store operations depend on it, I am the person accountable.',
		icon: 'shield'
	},
	{
		title: 'Teaching over lecturing',
		body: 'Raised developer quality at Chipmong through hands-on code review, and mentored juniors at One Click Solution, and trained the support team to fix recurring human-error cases at the source.',
		icon: 'book'
	},
	{
		title: 'Between business and code',
		body: 'Sat between store teams, business stakeholders and the developers, turning operational needs into features people actually use.',
		icon: 'translate'
	},
	{
		title: 'Learn the new stack',
		body: 'Took on a new front-end stack at nearly every job as the market moved: React and Svelte at Biztools, Vue 3 and Nuxt at Chipmong.',
		icon: 'sparkle'
	},
	{
		title: 'Triage under pressure',
		body: 'A POS running 24/7 across 20+ stores makes prioritisation a daily habit: urgent operational fixes weighed against scheduled feature work.',
		icon: 'compass'
	}
];

export const skillGroups: { label: string; items: string[]; icon: string }[] = [
	{
		label: 'Programming',
		icon: 'code',
		items: ['C#', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS']
	},
	{
		label: 'Backend',
		icon: 'server',
		items: [
			'.NET Framework 4.x',
			'.NET Core / .NET',
			'REST API design',
			'gRPC',
			'GraphQL',
			'Entity Framework Core',
			'SignalR (real-time)',
			'WebSocket (real-time)'
		]
	},
	{
		label: 'Frontend',
		icon: 'layout',
		items: ['Vue 3 + Nuxt', 'SvelteKit / Svelte', 'React', 'Next.js']
	},
	{
		label: 'Data & tooling',
		icon: 'database',
		items: [
			'SQL Server',
			'PostgreSQL',
			'SQLite',
			'Redis + in-memory caching',
			'Encrypted data storage',
			'Git'
		]
	},
	{
		label: 'Architecture & delivery',
		icon: 'flow',
		items: [
			'System design & architecture',
			'Database design',
			'Microservices & modular monoliths',
			'Apache Kafka (event streaming)',
			'Deployment & CI/CD',
			'Docker',
			'Linux & IIS hosting',
			'Firebase',
			'SAP ERP integration',
			'Offline-first / sync design'
		]
	},
	{
		label: 'Practices',
		icon: 'shield',
		items: [
			'Agile / Scrum',
			'Code review',
			'Clean / modular architecture',
			'JWT authentication',
			'TDD',
			'AI-assisted development'
		]
	},
	{
		label: 'Leadership',
		icon: 'team',
		items: [
			'Team supervision & mentoring',
			'Requirements analysis',
			'Delivery planning & prioritisation',
			'Stakeholder coordination'
		]
	}
];

export const education: { title: string; org: string; year: string; icon: string; url?: string }[] = [
	{
		title: 'Google Project Management Professional Certificate',
		org: 'Coursera · seven courses, from initiation through Agile and the capstone',
		year: 'Sep 2026',
		icon: 'cert',
		url: 'https://www.coursera.org/account/accomplishments/specialization/8SM29XFB8QF8'
	},
	{
		title: 'Bachelor of Computer Science',
		org: 'National Polytechnic Institute of Cambodia',
		year: '2019 – 2022',
		icon: 'graduation'
	}
];

export const languages: { name: string; level: string }[] = [
	{
		name: 'Khmer',
		level: 'Native'
	},
	{
		name: 'English',
		level: 'Excellent · professional working proficiency'
	}
];

/* ------------------------------------------------------------------ */
/* UI strings                                                          */
/* ------------------------------------------------------------------ */

export const ui = {
	nav: {
		home: 'Home',
		work: 'Work',
		experience: 'Experience',
		delivery: 'How I work',

		skills: 'Skills',
		education: 'Education',
		contact: 'Contact'
	},
	hero: {
		seeWork: 'See the work',
		contactMe: 'Contact me',
		atAGlance: 'At a glance'
	},
	work: {
		title: 'Selected work',
		lead: 'Systems I have designed, built and run, with the problem behind each one, what I did about it, and what changed.',
		problem: 'The problem',
		approach: 'What I did',
		result: 'Result',
		stack: 'Stack'
	},
	experience: {
		title: 'Experience',
		present: 'Present'
	},
	style: {
		title: 'Working style'
	},
	about: {
		nav: 'About',
		title: 'About'
	},
	skills: {
		title: 'Skills',
		languages: 'Languages spoken'
	},
	education: {
		title: 'Education & certifications'
	},
	contact: {
		title: 'Let’s talk',
		lead: 'Open to conversations about development supervision, platform ownership and full-stack work, in Phnom Penh or remote.',
		cv: 'Download CV (PDF)',
		linkedin: 'LinkedIn',
		phone: 'Phone',
		email: 'Email',
		location: 'Based in'
	},
	footer: {
		built: 'Designed and built by Rithea Sreng · SvelteKit, prerendered, no trackers.'
	},
	controls: {
		theme: 'Switch theme',
		shape: 'Switch corner style',
		menu: 'Menu'
	}
};

/**
 * The four numbers that answer the question a manager actually has: what does this person
 * run, and how big is it. Every figure here is one he has confirmed; there is no estimate,
 * no rounded claim and no unmeasured percentage, which is why the band is short.
 */
export const stats: { value: string; label: string; note: string }[] = [
	{
		value: '20+',
		label: 'stores',
		note: 'running the platform I own'
	},
	{
		value: '24 hours',
		label: 'a day',
		note: 'the chain trades on it'
	},
	{
		value: '1 to 3',
		label: 'releases a month',
		note: 'each rolled out to every store'
	},
	{
		value: 'US$20M+',
		label: 'in annual sales',
		note: 'carried by that platform, at the chain’s best year'
	}
];

/**
 * How the work runs, as opposed to what was built. This is the section a hiring manager
 * reads for the job they are filling: the roadmap, the review habit, the release train,
 * who answers at night, and how a fault is actually closed. Every line describes practice
 * he already follows on the live platform; nothing here is aspirational.
 */
export const delivery: { title: string; lead: string; steps: { name: string; body: string }[] } = {
	title: 'How I run delivery',
	lead: 'The platform is not the whole job. Keeping more than twenty stores selling, and improving them without breaking a night shift, is the job.',
	steps: [
		{
			name: 'Plan with the business',
			body: 'Store teams and head office bring the problems. I turn them into a roadmap, agree what ships next, and say plainly what cannot be done without slowing everything else down.'
		},
		{
			name: 'Build with review',
			body: 'Every change passes code review before it ships. I review it and coach through it, so the developers grow into the work instead of being corrected after it.'
		},
		{
			name: 'Release on a rhythm',
			body: 'One to three releases a month reach every store. Rolling out to all of them together means no store is left running a version nobody else has.'
		},
		{
			name: 'Answer when it breaks',
			body: 'Incidents outside hours come to me, with an escalation path the support team follows, so a store is never waiting on someone who has gone to bed.'
		},
		{
			name: 'Close the real cause',
			body: 'When something fails I trace it to the source rather than patching the symptom, then train the people involved so the same fault does not return.'
		}
	]
};

/**
 * Three decisions and what each one cost. This is the section that separates someone who
 * ships code from someone who owns a system: every choice here had a real alternative, and
 * naming the price is the part most portfolios leave out. All three are live on the
 * platform he runs today.
 */
export const decisions: { title: string; lead: string; items: { name: string; problem: string; decision: string; cost: string }[] } = {
	title: 'Three decisions, and what each one cost',
	lead: 'Any architecture can be described as though it were obvious. These are the three choices that shaped the platform, with the price of each one written down.',
	items: [
		{
			name: 'A database per store instead of one shared database',
			problem: 'The chain kept opening branches, and a single shared database was on its way to becoming the bottleneck for every store at once.',
			decision: 'Give each store its own database, and keep one central database for only the few things that must be chain wide: vouchers and customers.',
			cost: 'More databases to provision and keep in step, and chain wide reporting that has to gather across them, in exchange for a chain that can keep opening stores without a rewrite.'
		},
		{
			name: 'Checkout that keeps selling when the connection drops',
			problem: 'A link goes down, and a supermarket till that stops working is a queue heading out of the door.',
			decision: 'The store keeps selling against a local SQLite database seeded with the master data it needs, while a background scheduler pushes transactions and reconciles on reconnect.',
			cost: 'Duplicates and conflicts had to be handled deliberately rather than assumed away, and the codebase carries a synchronisation path an always online design would never have needed.'
		},
		{
			name: 'A gateway in front, routing by store',
			problem: 'Every request had to reach the right store data, on a platform the business intended to keep extending.',
			decision: 'Put a distribution gateway in front so requests are routed per store, and group stores behind dedicated API instances instead of one shared application server.',
			cost: 'One more hop and one more thing to operate, in exchange for scaling store group by store group and a failure that stays inside its own group.'
		}
	]
};

/**
 * The site as its own case study. A lead level reader is judging craft as much as
 * employment history, and this page is evidence he can point at: hand written markup and
 * SVG, motion that respects the system setting, no trackers. Every line here is checkable
 * by looking at the site itself.
 */
export const built: { title: string; lead: string; items: { name: string; body: string }[] } = {
	title: 'How this site is built',
	lead: 'The page you are reading is part of the work. It is small on purpose, and the choices behind it are the same ones I would make on a platform someone has to maintain.',
	items: [
		{
			name: 'Prerendered, not a single page app',
			body: 'Every page is rendered to plain HTML at build time. What reaches a visitor is markup, styles and a little JavaScript, which is why it loads quickly on a phone on a shop floor connection.'
		},
		{
			name: 'Hand written SVG, no charting library',
			body: 'The architecture diagram and the module flow are drawn by hand and styled with the same variables as the rest of the page, so they follow the theme and the corner style without being told to.'
		},
		{
			name: 'Motion that can be switched off',
			body: 'The animation on the diagram is CSS inside a reduced motion query. A visitor who has asked their system for less movement gets the same information with none of the movement.'
		},
		{
			name: 'Two controls, applied through variables',
			body: 'Theme and corner style are set once on the document root and every surface reads them, rather than each component deciding for itself. That is why the diagram shapes change with the corner control.'
		},
		{
			name: 'Nothing watching you',
			body: 'No trackers, no analytics scripts, no cookie banner. The only file this site sends anywhere else is the CV, and only when someone asks for it.'
		}
	]
};
